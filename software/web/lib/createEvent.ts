import { nanoid } from 'nanoid';
import { getTemporalClient } from './getTemporalClient';

type TASK_QUEUE = 'server' | 'GREETING_TASK_QUEUE';

export async function createEvent(
  eventName: string,
  data: string | undefined = undefined
) {
  const client = await getTemporalClient();

  const taskQueue: TASK_QUEUE =
    eventName === 'neotrellis_v1' ? 'GREETING_TASK_QUEUE' : 'server';

  return await client.workflow.start('WorkflowDumper', {
    workflowId: `nextjs-event-dumper-${eventName}-${nanoid()}`,
    taskQueue,
    args: [eventName, data]
  });
}
