import { NextRequest, NextResponse } from 'next/server';
import { Connection, Client } from '@temporalio/client';

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (token !== process.env.WEB_API_TOKEN)
    return NextResponse.json({ error: 'Bad token' }, { status: 401 });

  const data = await request.text();
  const type = request.nextUrl.pathname.split('/').pop();

  const connection = await Connection.connect({
    address: '192.168.86.100:7233'
  });

  const client = new Client({
    connection
  });

  const result = await client.workflow.start('WorkflowDumper', {
    workflowId: 'nextjs-event-dumper',
    taskQueue: 'server',
    args: [type, data]
  });

  return NextResponse.json({
    data,
    query: request.nextUrl.pathname,
    type,
    result
  });
}
