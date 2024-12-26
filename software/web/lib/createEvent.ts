import { nanoid } from 'nanoid';
import { getTemporalClient } from './getTemporalClient';

export async function createEvent(
  eventName: string,
  data: string | undefined = undefined
) {
  const client = await getTemporalClient();
  return await client.workflow.start('WorkflowDumper', {
    workflowId: `nextjs-event-dumper-${eventName}-${nanoid()}`,
    taskQueue: 'server',
    args: [eventName, data]
  });
}
