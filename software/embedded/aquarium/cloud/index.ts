import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import {aquaHandler} from './aqua-handler'

const config = new pulumi.Config();

const policy = new aws.iot.Policy("aqua-policy", {
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: ["iot:*"],
        Effect: "Allow",
        Resource: "*",
      },
    ],
  }),
});

const thing = new aws.iot.Thing("aqua-thing");
export const thingName = thing.name

const cert = new aws.iot.Certificate("aqua-cert", { active: true });

const thingAttachment = new aws.iot.ThingPrincipalAttachment("aqua-principal", {
  principal: cert.arn,
  thing: thing.name,
});

const certAttachment = new aws.iot.PolicyAttachment("aqua-cert-principal", {
  policy: policy.name,
  target: cert.arn,
});

export const privateKey = cert.privateKey;
export const publicKey = cert.publicKey;
export const endpoint = aws.iot.getEndpointOutput();
export const certificatePem = cert.certificatePem;


const aquaLambda = new aws.lambda.CallbackFunction('aqua-listener',{
  policies: [
    aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
    aws.iam.ManagedPolicies.AWSIoTFullAccess
  ],
  callback: aquaHandler,
  environment:{
    variables: {
      PGUSER: config.requireSecret('pgUser'),
      PGHOST: config.requireSecret('pgHost'),
      PGPASSWORD: config.requireSecret('pgPassword'),
      PGDATABASE: config.requireSecret('pgDatabase'),
      PGPORT: config.requireSecret('pgPort')
    }

  }
})

const rule = new aws.iot.TopicRule('aquarule', {
  description: 'Listen for sensor data and persist',
  enabled : true,
  sql: thing.name.apply(name => `SELECT * FROM '$aws/things/${name}/testies'`),
  sqlVersion: '2016-03-23',
  lambda: {
    functionArn: aquaLambda.arn
  }
})

const lambdaPermission = new aws.lambda.Permission('aqua-iot-permission', {
  action: 'lambda:InvokeFunction',
  'function': aquaLambda.arn,
  principal: 'iot.amazonaws.com',
  sourceArn: rule.arn
  // handler: 'exports.handler'
})

// const iamPolicyForLambda = topic


// config.requireSecret("netlifyBuildUrl").apply((url) => {
//   const buildNetlify: aws.cloudwatch.EventRuleEventHandler = async (
//     e: aws.cloudwatch.EventRuleEvent
//   ) => {
//     console.log(`posting to: ${url}`);
//     await axios.post(url, {});
//   };
//
//   const buildNetlifySchedule: aws.cloudwatch.EventRuleEventSubscription =
//     aws.cloudwatch.onSchedule(
//       "buildNetlifySchedule",
//       "cron(0 5 * * ? *)",
//       buildNetlify
//     );
// });

// import * as aws from "@pulumi/aws";
// import * as pulumi from "@pulumi/pulumi";
// import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
// import * as apigateway from "@pulumi/aws-apigateway";
// import { APIGatewayEvent } from "aws-lambda";
// import AWS from "aws-sdk";
//
// import {
//   EventBridgeClient,
//   PutEventsCommand,
// } from "@aws-sdk/client-eventbridge";
// import { rhinofitSyncData } from "./rhinofit/rhinofitSyncData";
// import { v4 as uuidv4 } from "uuid";
// import getInboxLambda from "./inbox/getInbox";
//
// const config = new pulumi.Config();
//
// const bus = new aws.cloudwatch.EventBus("bus");
//
// enum EventNames {
//   GraphicsDriverRead = "graphics-driver-read",
// }
//
// enum EventSource {
//   Arbiter = "Arbiter",
// }
//
// export enum Routes {
//   GetInbox = "inbox",
// }
//
// interface GraphicsDriverRead {
//   YourVersion: string;
//   LatestVersion: string;
//   Source: string;
// }
//
// interface DirectoryFilesCounted {
//   Count: number;
//   Source: string;
// }
//
// // ==============================================================
//
// const matchAllFromArbiterRule = new aws.cloudwatch.EventRule(
//   "arbiter-match-all-events",
//   {
//     eventBusName: bus.name,
//     eventPattern: JSON.stringify({
//       source: [EventSource.Arbiter],
//     }),
//   }
// );
//
// const matchGraphicsDriverRead = new aws.cloudwatch.EventRule(
//   "arbiter-match-graphics-driver-read",
//   {
//     eventBusName: bus.name,
//     eventPattern: JSON.stringify({
//       "detail-type": [EventNames.GraphicsDriverRead],
//     }),
//   }
// );
//
// const matchDirectoryFilesCount = new aws.cloudwatch.EventRule(
//   "arbiter-match-directory-files-counted",
//   {
//     eventBusName: bus.name,
//     eventPattern: JSON.stringify({
//       "detail-type": ["directory-files-counted"],
//     }),
//   }
// );
// // ==============================================================
//
// // Create a Lambda Function
// const publishToQueueLambda = new aws.lambda.CallbackFunction(
//   "publish-to-event-bridge-lambda",
//   {
//     policies: [
//       aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
//       "arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess", // doesn't exist as an enum 🤷
//     ],
//
//     runtime: "nodejs16.x",
//     callback: async (ev: APIGatewayEvent) => {
//       if (!ev.body)
//         return {
//           statusCode: 400,
//           body: "No data submitted",
//         };
//
//       if (!ev.isBase64Encoded) {
//         return {
//           statusCode: 400,
//           body: "The body is not base 64, not sure what to do",
//         };
//       }
//
//       const body: GraphicsDriverRead = JSON.parse(
//         Buffer.from(ev.body, "base64").toString()
//       );
//
//       const client = new EventBridgeClient({});
//       const command = new PutEventsCommand({
//         Entries: [
//           {
//             EventBusName: bus.name.get(),
//             Detail: JSON.stringify(body),
//             DetailType: EventNames.GraphicsDriverRead,
//             Source: EventSource.Arbiter,
//           },
//         ],
//       });
//       const response = await client.send(command);
//       console.log("response", response);
//       return {
//         statusCode: 200,
//         body: JSON.stringify(response), // has to be string
//       };
//     },
//   }
// );
//
// interface PublishToQueueInput {
//   detail: any;
//   detailType: string;
//   source: string;
// }
//
// const publishToQueueLambdaTwo = new aws.lambda.CallbackFunction(
//   "publish-to-event-bridge-two",
//   {
//     policies: [
//       aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
//       "arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess", // doesn't exist as an enum 🤷
//     ],
//     runtime: "nodejs16.x",
//     callback: async (ev: APIGatewayEvent) => {
//       if (!ev.body)
//         return {
//           statusCode: 400,
//           body: "No data submitted",
//         };
//
//       if (!ev.isBase64Encoded) {
//         return {
//           statusCode: 400,
//           body: "The body is not base 64, not sure what to do",
//         };
//       }
//       const { detail, detailType, source }: PublishToQueueInput = JSON.parse(
//         Buffer.from(ev.body, "base64").toString()
//       );
//       console.log("event v2 data", { detail, detailType, source });
//       const client = new EventBridgeClient({});
//       const command = new PutEventsCommand({
//         Entries: [
//           {
//             EventBusName: bus.name.get(),
//             Detail: JSON.stringify(detail),
//             DetailType: detailType,
//             Source: source,
//           },
//         ],
//       });
//       const response = await client.send(command);
//       console.log("response", response);
//       return {
//         statusCode: 200,
//         body: JSON.stringify(response), // has to be string
//       };
//     },
//   }
// );
//
// const rhinofitCustomerName = config
//   .require("rhinofit.customer-1")
//   .replace(/ /g, "-");
// const rhinofitSyncDataLambda = new aws.lambda.CallbackFunction(
//   `rhinofit-sync-data-${rhinofitCustomerName}`,
//   {
//     policies: [],
//     runtime: "nodejs16.x",
//     callback: rhinofitSyncData,
//   }
// );
//
// const getInboxLambdaPulumi = new aws.lambda.CallbackFunction("get-inbox", {
//   policies: [
//     aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
//     aws.iam.ManagedPolicies.AmazonDynamoDBFullAccess,
//   ],
//   runtime: "nodejs16.x",
//   callback: getInboxLambda,
// });
//
// // Define an endpoint that invokes a lambda to handle requests
// const api = new apigateway.RestAPI("api", {
//   routes: [
//     {
//       path: `/${EventNames.GraphicsDriverRead}`,
//       method: "POST",
//       eventHandler: publishToQueueLambda,
//       apiKeyRequired: true,
//     },
//     {
//       path: `/publish`,
//       method: "POST",
//       apiKeyRequired: true,
//       eventHandler: publishToQueueLambdaTwo,
//     },
//     {
//       path: `/${Routes.GetInbox}`,
//       method: "GET",
//       apiKeyRequired: true,
//       eventHandler: getInboxLambdaPulumi,
//     },
//   ],
//   apiKeySource: "HEADER",
// });
//
// export const url = api.url;
//
// // Create an API key to manage usage
// const apiKey = new aws.apigateway.ApiKey("api-key");
// // Define usage plan for an API stage
// const usagePlan = new aws.apigateway.UsagePlan("usage-plan", {
//   apiStages: [
//     {
//       apiId: api.api.id,
//       stage: api.stage.stageName,
//     },
//   ],
// });
// // Associate the key to the plan
// new aws.apigateway.UsagePlanKey("usage-plan-key", {
//   keyId: apiKey.id,
//   keyType: "API_KEY",
//   usagePlanId: usagePlan.id,
// });
//
// export const apiKeyValue = apiKey.value;
//
// const topic = new aws.sns.Topic("mytopic");
// const topicSubscription = new aws.sns.TopicSubscription("my-t-subscription", {
//   topic: topic,
//   protocol: "email",
//   endpoint: config.requireSecret("email"),
// });
// const sendEmailLambda = new aws.lambda.CallbackFunction("send-email", {
//   runtime: "nodejs16.x",
//   policies: [
//     aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
//     aws.iam.ManagedPolicies.AmazonSNSFullAccess,
//   ],
//   callback: async (event: { detail: GraphicsDriverRead }) => {
//     const { YourVersion, LatestVersion } = event.detail;
//     if (YourVersion === LatestVersion) {
//       console.log("Versions match, not doing anything");
//       return;
//     }
//
//     const client = new SNSClient({});
//     const arnToSend = topic.arn.get();
//     const message = `Your Nvidia Graphics Driver (${YourVersion}) is Out of Date. Latest: ${LatestVersion}`;
//     const command = new PublishCommand({
//       Message: message,
//       Subject: message,
//       TopicArn: arnToSend,
//     });
//     console.log("Sending SNS email...");
//     const response = await client.send(command);
//     console.log("response", response);
//   },
// });
//
// const sendEmailAboutObsidianLambda = new aws.lambda.CallbackFunction(
//   "send-email-about-obsidian",
//   {
//     runtime: "nodejs16.x",
//     policies: [
//       aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
//       aws.iam.ManagedPolicies.AmazonSNSFullAccess,
//     ],
//     callback: async (event: { detail: DirectoryFilesCounted }) => {
//       // console.log("send email about obsidian hit", event);
//       const { Source, Count } = event.detail;
//       if (Count <= 10) {
//         console.log(`File count is ${Count}, not doing anything`);
//         return;
//       }
//       console.log("Sending SNS email...");
//       const client = new SNSClient({});
//       const arnToSend = topic.arn.get();
//       const message = `Your obsidian vault root needs cleaned up. You have ${Count} files in there.`;
//       const command = new PublishCommand({
//         Message: message,
//         Subject: message,
//         TopicArn: arnToSend,
//       });
//       const response = await client.send(command);
//       console.log("response", response);
//     },
//   }
// );
//
// const lambaTargetEmail = new aws.cloudwatch.EventTarget("lambda-email-target", {
//   arn: sendEmailLambda.arn,
//   rule: matchGraphicsDriverRead.name,
//   eventBusName: bus.name,
// });
//
// const lambdaTargetObsidianEmail = new aws.cloudwatch.EventTarget(
//   "lambda-obisidan-email-target",
//   {
//     arn: sendEmailAboutObsidianLambda.arn,
//     rule: matchDirectoryFilesCount.name,
//     eventBusName: bus.name,
//   }
// );
//
// const dynamoTableEvents = new aws.dynamodb.Table("events", {
//   attributes: [{ name: "id", type: "S" }],
//   hashKey: "id",
//   readCapacity: 1,
//   writeCapacity: 1,
// });
//
// const dyanmoTableInbox = new aws.dynamodb.Table("inbox", {
//   attributes: [{ name: "id", type: "S" }],
//   hashKey: "id",
//   readCapacity: 1,
//   writeCapacity: 1,
// });
//
// // todo: trigger when event submitted to event bridge -> dynamo
// const copyEventsToDyanmo = new aws.lambda.CallbackFunction(
//   "copy-events-to-dynamo",
//   {
//     runtime: "nodejs16.x",
//     policies: [
//       aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
//       aws.iam.ManagedPolicies.AmazonDynamoDBFullAccess,
//     ],
//     callback: async (event: {
//       detail: GraphicsDriverRead;
//       "detail-type": string;
//     }) => {
//       // console.log("copy events to dynamo", ev);
//       console.log(
//         `Copying event to dynamo table: ${dynamoTableEvents.name.get()}...`
//       );
//       const docClient = new AWS.DynamoDB.DocumentClient();
//       await docClient
//         .put({
//           TableName: dynamoTableEvents.name.get(),
//           Item: {
//             id: uuidv4(),
//             eventName: event["detail-type"],
//             date: new Date().toISOString(),
//             data: event.detail,
//           },
//         })
//         .promise();
//     },
//   }
// );
//
// const copyEventsToDyanmoTarget = new aws.cloudwatch.EventTarget(
//   "copy-events-target",
//   {
//     arn: copyEventsToDyanmo.arn,
//     rule: matchAllFromArbiterRule.name,
//     eventBusName: bus.name,
//   }
// );
//
// const lambdaPermissionCopyToDynamo = new aws.lambda.Permission(
//   "lambda-permission-copy-to-dynamo",
//   {
//     action: "lambda:InvokeFunction",
//     principal: "events.amazonaws.com",
//     function: copyEventsToDyanmo.arn,
//     sourceArn: matchAllFromArbiterRule.arn,
//   }
// );
//
// const lambdaPermissionEmail = new aws.lambda.Permission(
//   "lambda-permission-email",
//   {
//     action: "lambda:InvokeFunction",
//     principal: "events.amazonaws.com",
//     function: sendEmailLambda.arn,
//     sourceArn: matchGraphicsDriverRead.arn,
//   }
// );
//
// const lambdaPermissionObisidanEmail = new aws.lambda.Permission(
//   "lambda-obsidian-permission-email",
//   {
//     action: "lambda:InvokeFunction",
//     principal: "events.amazonaws.com",
//     function: sendEmailAboutObsidianLambda.arn,
//     sourceArn: matchDirectoryFilesCount.arn,
//   }
// );
