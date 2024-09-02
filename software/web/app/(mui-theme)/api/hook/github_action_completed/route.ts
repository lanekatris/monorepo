import { type NextRequest, NextResponse } from 'next/server';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (token !== process.env.WEB_API_TOKEN)
    return NextResponse.json({ error: 'Bad token' }, { status: 401 });

  // console.log('restarting web in 1 second');
  // setTimeout(async () => {
  const { stdout, stderr } = await exec(
    // `docker pull loonison101/web && docker restart web`
    `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --run-once web`
  );
  console.log({ stdout, stderr });
  // }, 1000);

  // try {
  //   const { stdout, stderr } = await exec(`docker restart web`);
  //   return NextResponse.json({ stdout, stderr }, { status: 200 });
  // } catch (e) {
  //   return NextResponse.json({ error: e }, { status: 500 });
  // }
  return NextResponse.json({ status: 200 });
}
