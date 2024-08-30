import { NextResponse } from 'next/server';
import { getFeed } from '../../feed/get-feed';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET() {
  const session = await getServerSession();
  if (!session)
    return NextResponse.json({ message: 'Auth required' }, { status: 401 });
  const data = await getFeed();
  return NextResponse.json(data, { status: 200 });
}
