import { type NextRequest, NextResponse } from 'next/server';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (token !== process.env.WEB_API_TOKEN)
    return NextResponse.json({ error: 'Bad token' }, { status: 401 });

  try {
    const { stdout, stderr } = await exec(`docker restart web`);
    return NextResponse.json({ stdout, stderr }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}