import { getPendingFilesFromDisk } from '@/app/files/pending/route';
import { db, pendingFile } from '@/schema';
import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(){
  var pendingDiskFiles = await getPendingFilesFromDisk()

  for (const rawFile of pendingDiskFiles) {

    const records = await db.select().from(pendingFile).where(eq(pendingFile.filename, rawFile.filename));

    // if (records.length) return NextResponse.json('Nothing to be done, ', { status: 200 });

    if (!records.length){
      console.log(`Creating ${rawFile.filename}`)
      await db.insert(pendingFile).values([{
        id: nanoid(),
        filename: rawFile.filename,
        status: rawFile.status,
        startDate: rawFile.startDate?.getTime(),
        endDate: rawFile.endDate?.getTime(),
        videoLength: rawFile.videoLength
      }])
    } else {
      console.log(`Skipping ${rawFile.filename}, already exists`)
    }

  }


  return NextResponse.json('Success', { status: 200 });
}