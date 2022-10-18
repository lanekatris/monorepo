import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import * as apigateway from "@pulumi/aws-apigateway";
import { APIGatewayEvent } from "aws-lambda";
import AWS from "aws-sdk";

import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";
import { rhinofitSyncData } from "./rhinofit/rhinofitSyncData";
import { v4 as uuidv4 } from "uuid";
import getInboxLambda from "./inbox/getInbox";

const config = new pulumi.Config();

const bus = new aws.cloudwatch.EventBus("bus");

enum EventNames {
  GraphicsDriverRead = "graphics-driver-read",
}

enum EventSource {
  Arbiter = "Arbiter",
}

export enum Routes {
  GetInbox = "inbox",
}

interface GraphicsDriverRead {
  YourVersion: string;
  LatestVersion: string;
  Source: string;
}

// Create an event rule to watch for events.
const rule = new aws.cloudwatch.EventRule("rule", {
  eventBusName: bus.name,

  // Specify the event pattern to watch for.
  eventPattern: JSON.stringify({
    source: [EventSource.Arbiter],
  }),
});

// Create a Lambda Function
const publishToQueueLambda = new aws.lambda.CallbackFunction(
  "publish-to-event-bridge-lambda",
  {
    policies: [
      aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
      "arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess", // doesn't exist as an enum 🤷
    ],

    runtime: "nodejs16.x",
    callback: async (ev: APIGatewayEvent) => {
      if (!ev.body)
        return {
          statusCode: 400,
          body: "No data submitted",
        };

      if (!ev.isBase64Encoded) {
        return {
          statusCode: 400,
          body: "The body is not base 64, not sure what to do",
        };
      }

      const body: GraphicsDriverRead = JSON.parse(
        Buffer.from(ev.body, "base64").toString()
      );

      const client = new EventBridgeClient({});
      const command = new PutEventsCommand({
        Entries: [
          {
            EventBusName: bus.name.get(),
            Detail: JSON.stringify(body),
            DetailType: EventNames.GraphicsDriverRead,
            Source: EventSource.Arbiter,
          },
        ],
      });
      const response = await client.send(command);
      console.log("response", response);
      return {
        statusCode: 200,
        body: JSON.stringify(response), // has to be string
      };
    },
  }
);

const rhinofitCustomerName = config
  .require("rhinofit.customer-1")
  .replace(/ /g, "-");
const rhinofitSyncDataLambda = new aws.lambda.CallbackFunction(
  `rhinofit-sync-data-${rhinofitCustomerName}`,
  {
    policies: [],
    runtime: "nodejs16.x",
    callback: rhinofitSyncData,
  }
);

const getInboxLambdaPulumi = new aws.lambda.CallbackFunction("get-inbox", {
  policies: [
    aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
    aws.iam.ManagedPolicies.AmazonDynamoDBFullAccess,
  ],
  runtime: "nodejs16.x",
  callback: getInboxLambda,
});

// Define an endpoint that invokes a lambda to handle requests
const api = new apigateway.RestAPI("api", {
  routes: [
    {
      path: `/${EventNames.GraphicsDriverRead}`,
      method: "POST",
      eventHandler: publishToQueueLambda,
      apiKeyRequired: true,
    },
    {
      path: `/${Routes.GetInbox}`,
      method: "GET",
      apiKeyRequired: true,
      eventHandler: getInboxLambdaPulumi,
    },
  ],
  apiKeySource: "HEADER",
});

export const url = api.url;

// Create an API key to manage usage
const apiKey = new aws.apigateway.ApiKey("api-key");
// Define usage plan for an API stage
const usagePlan = new aws.apigateway.UsagePlan("usage-plan", {
  apiStages: [
    {
      apiId: api.api.id,
      stage: api.stage.stageName,
    },
  ],
});
// Associate the key to the plan
new aws.apigateway.UsagePlanKey("usage-plan-key", {
  keyId: apiKey.id,
  keyType: "API_KEY",
  usagePlanId: usagePlan.id,
});

export const apiKeyValue = apiKey.value;

const topic = new aws.sns.Topic("mytopic");
const topicSubscription = new aws.sns.TopicSubscription("my-t-subscription", {
  topic: topic,
  protocol: "email",
  endpoint: config.requireSecret("email"),
});
const sendEmailLambda = new aws.lambda.CallbackFunction("send-email", {
  runtime: "nodejs16.x",
  policies: [
    aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
    aws.iam.ManagedPolicies.AmazonSNSFullAccess,
  ],
  callback: async (event: { detail: GraphicsDriverRead }) => {
    const { YourVersion, LatestVersion } = event.detail;
    if (YourVersion === LatestVersion) {
      console.log("Versions match, not doing anything");
      return;
    }

    const client = new SNSClient({});
    const arnToSend = topic.arn.get();
    const message = `Your Nvidia Graphics Driver (${YourVersion}) is Out of Date. Latest: ${LatestVersion}`;
    const command = new PublishCommand({
      Message: message,
      Subject: message,
      TopicArn: arnToSend,
    });
    console.log("Sending SNS email...");
    const response = await client.send(command);
    console.log("response", response);
  },
});

const lambaTargetEmail = new aws.cloudwatch.EventTarget("lambda-email-target", {
  arn: sendEmailLambda.arn,
  rule: rule.name,
  eventBusName: bus.name,
});

const dynamoTableEvents = new aws.dynamodb.Table("events", {
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  readCapacity: 1,
  writeCapacity: 1,
});

const dyanmoTableInbox = new aws.dynamodb.Table("inbox", {
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  readCapacity: 1,
  writeCapacity: 1,
});

// todo: trigger when event submitted to event bridge -> dynamo
const copyEventsToDyanmo = new aws.lambda.CallbackFunction(
  "copy-events-to-dynamo",
  {
    runtime: "nodejs16.x",
    policies: [
      aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
      aws.iam.ManagedPolicies.AmazonDynamoDBFullAccess,
    ],
    callback: async (event: {
      detail: GraphicsDriverRead;
      "detail-type": string;
    }) => {
      // console.log("copy events to dynamo", ev);
      console.log(
        `Copying event to dynamo table: ${dynamoTableEvents.name.get()}...`
      );
      const docClient = new AWS.DynamoDB.DocumentClient();
      await docClient
        .put({
          TableName: dynamoTableEvents.name.get(),
          Item: {
            id: uuidv4(),
            eventName: event["detail-type"],
            date: new Date().toISOString(),
            data: event.detail,
          },
        })
        .promise();
    },
  }
);

const copyEventsToDyanmoTarget = new aws.cloudwatch.EventTarget(
  "copy-events-target",
  {
    arn: copyEventsToDyanmo.arn,
    rule: rule.name,
    eventBusName: bus.name,
  }
);

const lambdaPermissionCopyToDynamo = new aws.lambda.Permission(
  "lambda-permission-copy-to-dynamo",
  {
    action: "lambda:InvokeFunction",
    principal: "events.amazonaws.com",
    function: copyEventsToDyanmo.arn,
    sourceArn: rule.arn,
  }
);

const lambdaPermissionEmail = new aws.lambda.Permission(
  "lambda-permission-email",
  {
    action: "lambda:InvokeFunction",
    principal: "events.amazonaws.com",
    function: sendEmailLambda.arn,
    sourceArn: rule.arn,
  }
);
