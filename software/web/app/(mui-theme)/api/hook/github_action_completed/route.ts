import { type NextRequest, NextResponse } from 'next/server';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (token !== process.env.WEB_API_TOKEN)
    return NextResponse.json({ error: 'Bad token' }, { status: 401 });

  console.log('restarting web in 1 second...');
  setTimeout(async () => {
    console.log('invoking docker...');
    const { stdout, stderr } = await exec(
      `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --run-once web`
    );
    console.log({ stdout, stderr });
  }, 1000);

  return NextResponse.json({ status: 200 });
}
