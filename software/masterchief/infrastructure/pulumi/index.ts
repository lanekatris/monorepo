import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const config = new pulumi.Config();

const api = new aws.apigatewayv2.Api('api', {
  protocolType: 'HTTP',
});

// Create a stage and set it to deploy automatically.
const stage = new aws.apigatewayv2.Stage('stage', {
  apiId: api.id,
  name: pulumi.getStack(),
  autoDeploy: true,
});

// Create an event bus.
const bus = new aws.cloudwatch.EventBus('bus');

// Create an event rule to watch for events.
const rule = new aws.cloudwatch.EventRule('rule', {
  eventBusName: bus.name,

  // Specify the event pattern to watch for.
  eventPattern: JSON.stringify({
    source: ['my-event-source'],
  }),
});

// Define a policy granting API Gateway permission to publish to EventBridge.
const apiGatewayRole = new aws.iam.Role('api-gateway-role', {
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'sts:AssumeRole',
        Effect: 'Allow',
        Principal: {
          Service: 'apigateway.amazonaws.com',
        },
      },
    ],
  },
  managedPolicyArns: ['arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess'],
});

// Create an API Gateway integration to forward requests to EventBridge.
const integration = new aws.apigatewayv2.Integration('integration', {
  apiId: api.id,

  // The integration type and subtype.
  integrationType: 'AWS_PROXY',
  integrationSubtype: 'EventBridge-PutEvents',
  credentialsArn: apiGatewayRole.arn,

  // The body of the request to be sent to EventBridge. Note the
  // event source matches pattern defined on the EventRule, and the
  // Detail expression, which just forwards the body of the original
  // API Gateway request (i.e., the uploaded document).
  requestParameters: {
    EventBusName: bus.name,
    Source: 'my-event-source',
    DetailType: 'my-detail-type',
    Detail: '$request.body',
  },
});

// Finally, define the route.
const route = new aws.apigatewayv2.Route('route', {
  apiId: api.id,
  routeKey: 'POST /uploads',
  target: pulumi.interpolate`integrations/${integration.id}`,
});
// ...

// Create a Lambda function handler with permission to log to CloudWatch.
const lambda = new aws.lambda.CallbackFunction('lambda', {
  runtime: 'nodejs16.x',
  policies: [aws.iam.ManagedPolicies.CloudWatchLogsFullAccess],
  callback: async (event: any) => {
    // For now, just log the event, including the uploaded document.
    // That'll be enough to verify everything's working.
    console.log({ source: event.source, detail: event.detail });
  },
});

const topic = new aws.sns.Topic('mytopic');
const topicSubscription = new aws.sns.TopicSubscription('my-t-subscription', {
  topic: topic,
  protocol: 'email',
  endpoint: config.requireSecret('email'),
});
const sendEmailLambda = new aws.lambda.CallbackFunction('send-email', {
  runtime: 'nodejs16.x',
  policies: [
    aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
    aws.iam.ManagedPolicies.AmazonSNSFullAccess,
  ],
  callback: async (event: any) => {
    const client = new SNSClient({});
    const arnToSend = topic.arn.get();
    const command = new PublishCommand({
      Message: 'testies',
      Subject: 'im a subject',
      TopicArn: arnToSend,
    });
    const response = await client.send(command);
    console.log({ source: event.source, detail: event.detail, response });
  },
});

// Create an EventBridge target associating the event rule with the function.
const lambdaTarget = new aws.cloudwatch.EventTarget('lambda-target', {
  arn: lambda.arn,
  rule: rule.name,
  eventBusName: bus.name,
});

const lambaTargetEmail = new aws.cloudwatch.EventTarget('lambda-email-target', {
  arn: sendEmailLambda.arn,
  rule: rule.name,
  eventBusName: bus.name,
});

// Give EventBridge permission to invoke the function.
const lambdaPermission = new aws.lambda.Permission('lambda-permission', {
  action: 'lambda:InvokeFunction',
  principal: 'events.amazonaws.com',
  function: lambda.arn,
  sourceArn: rule.arn,
});

const lambdaPermissionEmail = new aws.lambda.Permission(
  'lambda-permission-email',
  {
    action: 'lambda:InvokeFunction',
    principal: 'events.amazonaws.com',
    function: sendEmailLambda.arn,
    sourceArn: rule.arn,
  },
);

// Export the API Gateway URL to give us something to POST to.
export const url = pulumi.interpolate`${api.apiEndpoint}/${stage.name}`;
