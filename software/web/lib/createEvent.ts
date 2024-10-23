import { Client, Connection } from '@temporalio/client';
import { nanoid } from 'nanoid';

export async function createEvent(
  eventName: string,
  data: string | undefined = undefined
) {
  const connection = await Connection.connect({
    address: '192.168.86.100:7233'
  });

  const client = new Client({
    connection
  });

  return await client.workflow.start('WorkflowDumper', {
    workflowId: `nextjs-event-dumper-${eventName}-${nanoid()}`,
    taskQueue: 'server',
    args: [eventName, data]
  });
}
