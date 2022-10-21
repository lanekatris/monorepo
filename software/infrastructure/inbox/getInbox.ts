import AWS from "aws-sdk";
import { InboxItem } from "./inboxItem";
import { ApiGatewayResult } from "../rhinofit/rhinofitSyncData";
import {
  DynamoDBDocumentClient,
  BatchExecuteStatementCommand,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import getDynamoClient from "../dynamodb";

// todo: setup indexes to do a query and not a scan
export async function getInbox(): Promise<InboxItem> {
  const input = {
    FilterExpression: "#processed = :processed",
    ExpressionAttributeValues: {
      ":processed": false,
    },
    ExpressionAttributeNames: {
      "#processed": "processed",
    },
    TableName: "inbox-4223ac7",
  };

  const command = new ScanCommand(input);
  const result = await getDynamoClient().send(command);

  // @ts-ignore
  return result.Items || [];
}

// getInbox().then(console.log);

export default async function getInboxLambda(): Promise<ApiGatewayResult> {
  const result = await getInbox();
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}
