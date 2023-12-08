import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import axios from "axios";

// aws lambda invoke --function-name openObsidianReminderLambda-e383a35 function-output.txt
export function reminderOpenObsidian() {
  const config = new pulumi.Config();
  const apiKey = config.requireSecret("resend_api_key");

  const openObsidianReminderLambda = new aws.lambda.CallbackFunction(
    "openObsidianReminderLambda",
    {
      policies: [
        aws.iam.ManagedPolicies.CloudWatchLogsFullAccess,
        aws.iam.ManagedPolicies.AmazonSNSFullAccess,
      ],
      callback: async () => {
        console.log("api key length: " + apiKey.get().length);

        const { data } = await axios.post(
          "https://api.resend.com/emails",
          {
            from: "onboarding@resend.dev",
            to: ["lanekatris@gmail.com"],
            subject: "Open Obsidian Reminder",
            html: `<p>You can open Obsidian <a href="https://www.lanekatris.com/Obsidian-Links">here</a></p>`,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey.get()}`,
            },
          }
        );
        return data;
      },
    }
  );

  const openObsidianReminderSubscription: aws.cloudwatch.EventRuleEventSubscription =
    aws.cloudwatch.onSchedule(
      "openObsidianReminderSubscription",
      "cron(0 12 * * ? *)",
      openObsidianReminderLambda
    );
}
