import * as aws from "@pulumi/aws";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import * as pulumi from "@pulumi/pulumi";

const topic = new aws.sns.Topic("mytopic");

const config = new pulumi.Config();
const formUrl = config.requireSecret('didYouAdventureForm')

const topicSubscription = new aws.sns.TopicSubscription("my-email-subscription", {
  topic: topic,
  protocol: "email",
  endpoint: 'lanekatris@gmail.com',
});

const didYouAdventureEmailLambda = new aws.lambda.CallbackFunction('didYouAdventureEmailLambda', {

  policies: [
    aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
    aws.iam.ManagedPolicies.AmazonSNSFullAccess,
  ],
  callback: async () => {
    const client = new SNSClient({})
    const message = 'Did you adventure today?'
    const arn = topic.arn.get()
    console.log("arn", arn);
    const command = new PublishCommand({
      TopicArn: arn,
      Subject: message,
      Message: `${message}\n\n${formUrl.get()}`,
    })

    console.log("Sending SNS email....");
    const response = await client.send(command);
    console.log("response", response);

  }
})


// 21 == 9pm EST and EST is +4 hr of UTC
const didYouAdventureSchedule: aws.cloudwatch.EventRuleEventSubscription = aws.cloudwatch.onSchedule(
  'didYouAdventureSchedule', 'cron(0 1 * * ? *)',didYouAdventureEmailLambda)
