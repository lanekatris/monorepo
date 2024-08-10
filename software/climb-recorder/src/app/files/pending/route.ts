import { NextResponse } from 'next/server';
import fs from 'fs/promises'
import exec from 'child_process'
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import {parse,addSeconds} from 'date-fns'
import { db, pendingFile } from '../../../schema';

function p(path:string) : Promise<{data:FfprobeData,err:any}>{
return new Promise((resolve, reject) => {

  ffmpeg.ffprobe(path, (err, data)=>{
    return resolve({data,err});
  })
})
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// function getStatus():'valid'|'invalid'{
//
// }

function getStartDateFromFilename(filename:string){
  const noExt = filename.split('.')[0];
  const parts = noExt.split('_');
  const [year,month,day] = parts[0].split('-');
  const dateTimeString = filename.substring(0, 19).replace('_', ' ')
  const parsedDateTime = parse(dateTimeString, 'yyyy-MM-dd HH-mm-ss', new Date());
  // "2024-06-29_10-03-40.mkv"
  // const d= parse(filename, 'yyyy-MM-dd_HH-mm-ss', new Date())

  return parsedDateTime;
}

export async function GET() {
  const videoFolder= 'C:\\temp\\ffmpeg-test'
  const rawFiles = await fs.readdir(videoFolder)

  const files = await Promise.all(rawFiles.filter(x => x.includes('mkv')).map(async filename => {

    const stats = await p(`${videoFolder}\\${filename}`);
    let status = stats.err ? 'invalid':'valid';
    const videoLength=  status === 'valid'?stats.data.format.duration : undefined;

    // Somehow we get in this state from ffprobe
    // @ts-ignore
    if (videoLength === 'N/A'){
      status = 'invalid'
    }

  // todo: Can I do union types so I know for a fact properties are populated instead of these checks?
    const startDate =  status === 'valid' ? getStartDateFromFilename(filename):undefined;
    const endDate = startDate && videoLength ? addSeconds(startDate,videoLength) : undefined;

      return {
        filename,
        startDate,
        endDate,
        status,
        // s: stats.data,
        videoLength // todo: I got n/a for oen of them?
      }

  }))

  const idk = await db.select().from(pendingFile);

  return NextResponse.json({ files,idk}, { status: 200 });
}
