import { NextResponse } from 'next/server';
import fs from 'fs/promises'
import exec from 'child_process'
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';

/**
 * Function to execute exe
 * @param {string} fileName The name of the executable file to run.
 * @param {string[]} params List of string arguments.
 * @param {string} path Current working directory of the child process.
 */
function execute(fileName, params, path) {
  let promise = new Promise((resolve, reject) => {
    exec.execFile(fileName, params, { cwd: path }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });

  });
  return promise;
}

function p(path:string) : Promise<{data:FfprobeData,err:any}>{
return new Promise((resolve, reject) => {

  ffmpeg.ffprobe(path, (err, data)=>{
    return resolve({data,err});
  })
})
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function GET() {
  const videoFolder= 'C:\\temp\\ffmpeg-test'
  const files = await fs.readdir(videoFolder)
  // const idk = files.filter(x => x.includes('mkv')).map(x => )


    // const idk = await  execute('ffprobe.exe', ['-hide_banner', '', '-show_entries', 'format=duration', '-v', 'quiet', '-of', 'csv="p=0"', './2024-08-08_12-04-04.mkv'], 'C:\\temp\\ffmpeg-test')
    // const idk = await execute('ffprobe.exe', ['-hide_banner -show_entries format=duration -v quiet -of csv="p=0" ./2024-08-08_14-32-35.mkv'], 'C:\\temp\\ffmpeg-test')
    // ffmpeg.ffprobe('C:\\temp\\ffmpeg-test\\2024-08-08_14-32-35.mkv')
    // const idk = await p('C:\\temp\\ffmpeg-test\\2024-08-08_14-32-35.mkv');

    // return NextResponse.json({files,idk}, { status: 200 });

  const idk = await Promise.all(files.filter(x => x.includes('mkv')).map(async filename => {

      // const videoLength = await execute('ffprobe.exe', ['-hide_banner', '-show_entries', 'format=duration', '-v', 'quiet', '-of', 'csv="p=0"', `./${filename}`], `C:\\temp\\ffmpeg-test`)
    const stats = await p(`${videoFolder}\\${filename}`);
    const status = stats.err ? 'invalid':'valid';
    const videoLength=  status === 'valid'?stats.data.format.duration : undefined;
      return {
        filename,
        status,
        s: stats.data,
        videoLength // todo: I got n/a for oen of them?
      }

  }))

  return NextResponse.json({files,idk}, { status: 200 });
}
