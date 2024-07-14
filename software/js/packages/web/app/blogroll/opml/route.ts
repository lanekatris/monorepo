import { NextResponse } from 'next/server';
import { getRssOpml } from './getRssOpml';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const xml = await getRssOpml();
  const headers = new Headers();
  headers.set('Content-Type', 'text/xml');
  return new NextResponse(xml, { status: 200 });
}
