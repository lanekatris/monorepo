import {
  Body,
  Controller,
  Inject,
  Logger,
  Post,
  Redirect,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EventNames } from '../dg/types/disc-added';
import { GuardMe } from '../auth/guard-me.guard';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import { Esdb, ESDB } from '../app/constants';
import { AdventureImportStarted } from './types/adventure-created';
import { AdventureDeleted } from './types/adventure-deleted';

import { FileInterceptor } from '@nestjs/platform-express';

const csv = require('csvtojson');

export class DeleteAdventureDto {
  @IsNotEmpty()
  id: string;
}

interface BulkUploadedAdventure {
  Id: string;
  Locationn: string;
  OutdoorActivity: string;
  Date: string;
  'End Date': string;
  ActivityCount: string;
}

@Controller('adventure')
@UseGuards(GuardMe)
export class AdventureController {
  private readonly log = new Logger(AdventureController.name);

  constructor(
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
  ) {}

  @Post(EventNames.AdventureDeleted)
  @Redirect(`/events?eventName=${EventNames.AdventureCreated}`)
  public async deleteAdventure(@Body() body: DeleteAdventureDto) {
    const { id } = body;
    const event = jsonEvent<AdventureDeleted>({
      type: EventNames.AdventureDeleted,
      data: {
        id,
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event);
  }

  // @UseInterceptors(FileInterceptor('file'))
  // @Post('upload')
  // @Redirect(`/events?eventName=${EventNames.AdventureCreated}`)
  // async bulkUpload(@UploadedFile() file: Express.Multer.File) {
  //   const contents = file.buffer.toString();
  //   this.log.log(`Parsing CSV...`);
  //   const entries: BulkUploadedAdventure[] = await csv().fromString(contents);
  //   this.log.log(`CSV has ${entries.length} rows`);
  //
  //   const importId = nanoid();
  //   const events = entries.map((entry) =>
  //     jsonEvent<AdventureCreated>({
  //       type: EventNames.AdventureCreated,
  //       data: {
  //         id: nanoid(),
  //         date: format(new Date(entry.Date), 'yyyy-LL-dd'),
  //         activities: entry.OutdoorActivity.split(',') as AdventureActivity[],
  //         name: entry.Id,
  //       },
  //       metadata: {
  //         importId,
  //         source: 'CSV',
  //       },
  //     }),
  //   );
  //
  //   const resetEvent = jsonEvent<AdventureImportStarted>({
  //     type: EventNames.AdventureImportStarted,
  //     data: {
  //       id: importId,
  //     },
  //   });
  //
  //   this.log.log(`Appending ${events.length} events...`);
  //   await this.esdb.appendToStream(Esdb.StreamEvents, [resetEvent, ...events]);
  // }
}
