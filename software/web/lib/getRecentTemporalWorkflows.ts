import { getTemporalClient } from './getTemporalClient';

export async function getRecentTemporalWorkflows() {
  const client = await getTemporalClient();
  const workflowIterator = client.workflow.list();

  // Their api doesn't respect page size, so I only get the first 5 results
  let i = 0;
  const workflows = [];
  for await (const workflow of workflowIterator) {
    if (i === 4) break;
    workflows.push(workflow);
    i++;
  }

  return workflows;
}
