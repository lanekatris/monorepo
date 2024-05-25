import { NextResponse } from 'next/server';
import { getFeed } from '../../feed/get-feed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET() {
  const data = await getFeed();
  return NextResponse.json(data, { status: 200 });
}
