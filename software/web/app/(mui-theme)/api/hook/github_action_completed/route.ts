import { type NextRequest, NextResponse } from 'next/server';
import { restartWebserver } from '../../../../../lib/restartWebserver';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (token !== process.env.WEB_API_TOKEN)
    return NextResponse.json({ error: 'Bad token' }, { status: 401 });

  console.log('restarting web in 1 second...');
  setTimeout(async () => {
    console.log('invoking docker...');
    const { stdout, stderr } = await restartWebserver();
    console.log({ stdout, stderr });
  }, 1000);

  return NextResponse.json({ status: 200 });
}
