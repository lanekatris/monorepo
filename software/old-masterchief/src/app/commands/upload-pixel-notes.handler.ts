import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { Esdb, ESDB, McStorage } from '../utils/constants';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { NoteUploaded } from '../events/note-uploaded';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import { MinioService } from 'nestjs-minio-client';

export class UploadPixelNotesCommand {
  constructor(public files: Array<{ contents: Buffer; name: string }>) {}
}

@CommandHandler(UploadPixelNotesCommand)
export class UploadPixelNotesHandler
  implements ICommandHandler<UploadPixelNotesCommand>
{
  private readonly log = new Logger(UploadPixelNotesHandler.name);

  constructor(
    @Inject(ESDB) private esdb: EventStoreDBClient,
    private readonly minioClient: MinioService,
  ) {}

  async execute(command: UploadPixelNotesCommand): Promise<any> {
    const { files } = command;

    this.log.log(`Processing ${files.length} files`);

    for (const file of files) {
      this.log.log(`Processing pixel note: ${file.name}`);
      const exists = await this.doesObjectExist(
        McStorage.NotesBucket,
        file.name,
      );
      if (exists) {
        this.log.log(`${file.name} exists, doing nothing`);
        continue;
      }
      await this.minioClient.client.putObject(
        McStorage.NotesBucket,
        file.name,
        file.contents,
      );
      await this.esdb.appendToStream(
        Esdb.StreamEvents,
        jsonEvent<NoteUploaded>({
          type: 'note-uploaded',
          data: {
            id: nanoid(),
            date: format(new Date(), 'yyyy-LL-dd'),
            filePath: `${McStorage.NotesBucket}/${file.name}`,
          },
        }),
      );
      this.log.log(`Created file and event for ${file.name}`);
    }
  }

  private async doesObjectExist(
    bucket: string,
    objectName: string,
  ): Promise<boolean> {
    try {
      await this.minioClient.client.statObject(bucket, objectName);
      return true;
    } catch (err) {
      return false;
    }
  }
}
