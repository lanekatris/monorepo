import { NextResponse } from 'next/server';
import { getFeed } from '../../feed/get-feed';

export async function GET() {
  const data = await getFeed();
  return NextResponse.json(data, { status: 200 });
}
