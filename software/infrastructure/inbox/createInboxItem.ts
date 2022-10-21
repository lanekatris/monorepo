import { v4 as uuidv4 } from "uuid";
import { InboxItem } from "./inboxItem";
import getDynamoClient from "../dynamodb";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export default async function createInboxItem(body: string) {
  const doc: InboxItem = {
    id: uuidv4(),
    eventDate: new Date().toISOString(),
    body,
    version: 1,
    processed: false,
  };

  const command = new PutCommand({
    TableName: "inbox-4223ac7",
    Item: doc,
  });

  await getDynamoClient().send(command);
}

// createInboxItem("my neck feels super stiff");
