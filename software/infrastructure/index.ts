import * as aws from "@pulumi/aws";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import * as pulumi from "@pulumi/pulumi";
import { reminderOpenObsidian } from "./emails/reminderOpenObsidian";

const topic = new aws.sns.Topic("mytopic");

export const topicArn = topic.arn;

const config = new pulumi.Config();
const formUrl = config.requireSecret("didYouAdventureForm");

const topicSubscription = new aws.sns.TopicSubscription(
  "my-email-subscription",
  {
    topic: topic,
    protocol: "email",
    endpoint: "lanekatris@gmail.com",
  }
);

const didYouAdventureEmailLambda = new aws.lambda.CallbackFunction(
  "didYouAdventureEmailLambda",
  {
    policies: [
      aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
      aws.iam.ManagedPolicies.AmazonSNSFullAccess,
    ],
    callback: async () => {
      const client = new SNSClient({});
      const message = "Did you adventure today?";
      const arn = topic.arn.get();
      console.log("arn", arn);
      const command = new PublishCommand({
        TopicArn: arn,
        Subject: message,
        Message: `${message}\n\nhttps://www.lanekatris.com/Obsidian-Links`,
      });

      console.log("Sending SNS email....");
      const response = await client.send(command);
      console.log("response", response);
    },
  }
);
export const adventureLambda = didYouAdventureEmailLambda.name;

const didYouAdventureSchedule: aws.cloudwatch.EventRuleEventSubscription =
  aws.cloudwatch.onSchedule(
    "didYouAdventureSchedule",
    "cron(0 1 * * ? *)",
    didYouAdventureEmailLambda
  );

reminderOpenObsidian();

const n8nUser = new aws.iam.User("n8nUser");
const n8nAccessKey = new aws.iam.AccessKey("n8nAccessKey", {
  user: n8nUser.name,
});

export const n8n = n8nAccessKey;

const n8nPolicy = aws.iam.getPolicyDocument({
  statements: [
    {
      effect: "Allow",
      actions: ["sns:Publish", "sns:ListTopics", "s3:*"],
      resources: ["*"],
    },
  ],
});
const n8nUserPolicy = new aws.iam.UserPolicy("n8nUserPolicy", {
  user: n8nUser.name,
  policy: n8nPolicy.then((n8nPolicy) => n8nPolicy.json),
});
