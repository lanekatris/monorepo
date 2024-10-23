import { NextRequest, NextResponse } from 'next/server';
import { Connection, Client } from '@temporalio/client';
import { nanoid } from 'nanoid';
import { createEvent } from '../../../../../lib/createEvent';

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (token !== process.env.WEB_API_TOKEN)
    return NextResponse.json({ error: 'Bad token' }, { status: 401 });

  const data = await request.text();
  const type = request.nextUrl.pathname.split('/').pop();
  if (!type) throw new Error('Type is required');

  const result = createEvent(type, data);

  return NextResponse.json({
    data,
    query: request.nextUrl.pathname,
    type,
    result
  });
}
