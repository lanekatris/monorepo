import fs from 'fs/promises'
import { getPendingFilesFromDisk } from '@/app/files/pending/route';
import { NextResponse } from 'next/server';
import { db, pendingFile } from '@/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const rawFiles = await getPendingFilesFromDisk()

  for (const file of rawFiles.filter(x => x.status === 'invalid')) {
    console.log(`Deleting ${file.fullPath}`)
    await fs.rm(file.fullPath)
  }

  const dbFiles = await db.delete(pendingFile).where(eq(pendingFile.status, 'invalid'))


  return NextResponse.json({dbResult:dbFiles}, { status: 200 });
}