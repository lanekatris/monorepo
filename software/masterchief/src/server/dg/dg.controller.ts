import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Render,
  Response,
} from '@nestjs/common';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { nanoid } from 'nanoid';
import { ESDB } from '../constants';
import {
  DiscAdded,
  DiscRemoved,
  DiscsReset,
  EventNames,
} from './types/disc-added';
import { DgService } from './dg.service';
import { IsNotEmpty } from 'class-validator';

const csv = require('csvtojson');

const CONTROLLER_NAME = 'dg';

function prefixController(route: string) {
  return `${CONTROLLER_NAME}/${route}`;
}

export class DiscRemovedDto {
  @IsNotEmpty()
  id: string;
}

export class BulkUploadDto {
  @IsNotEmpty()
  data: string;
}

interface BulkUploadItem {
  Id: string;
  Brand: string;
  Model: string;
}

@Controller(CONTROLLER_NAME)
export class DgController {
  private readonly logger = new Logger(DgController.name);
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
    @Inject(DgService)
    private service: DgService,
  ) {}

  @Get()
  @Render('index')
  async index() {
    const discs = await this.service.getDiscs();
    return {
      discs,
      postUrl: prefixController(EventNames.DiscAdded),
      deleteUrl: prefixController(EventNames.DiscRemoved),
      resetUrl: prefixController(EventNames.DiscsReset),
      uploadUrl: prefixController('bulk-upload'),
    };
  }

  @Post(EventNames.DiscAdded)
  public async discAdded(@Response() res, @Body() body) {
    const event = jsonEvent<DiscAdded>({
      type: EventNames.DiscAdded,
      data: {
        id: nanoid(),
        date: body.date || new Date(),
        brand: body.brand,
        model: body.model,
      },
    });
    await this.client.appendToStream('testies', event);
    return res.redirect(`/${CONTROLLER_NAME}`);
  }

  @Post(EventNames.DiscRemoved)
  public async discRemoved(@Response() res, @Body() body: DiscRemovedDto) {
    const { id } = body;
    const event = jsonEvent<DiscRemoved>({
      type: EventNames.DiscRemoved,
      data: {
        id,
        date: new Date(),
      },
    });
    await this.client.appendToStream('testies', event);
    return res.redirect(`/${CONTROLLER_NAME}`);
  }

  @Post(EventNames.DiscsReset)
  public async discsReset(@Response() res) {
    const event = jsonEvent<DiscsReset>({
      type: EventNames.DiscsReset,
      data: {},
    });
    await this.client.appendToStream('testies', event);
    return res.redirect(`/${CONTROLLER_NAME}`);
  }

  @Post('bulk-upload')
  public async bulkUpload(@Body() body: BulkUploadDto, @Response() res) {
    const { data } = body;

    this.logger.log(`Parsing csv upload`);
    const entries: BulkUploadItem[] = await csv().fromString(data);
    this.logger.log(`Parsed, uploading to db`);

    const events = entries.map(({ Model, Brand }) =>
      jsonEvent<DiscAdded>({
        type: EventNames.DiscAdded,
        data: {
          id: nanoid(),
          date: new Date(),
          brand: Brand,
          model: Model,
        },
      }),
    );

    await this.client.appendToStream('testies', events);
    this.logger.log(`Sent to db`);
    return res.redirect(`/${CONTROLLER_NAME}`);
  }

  @Get('discs')
  public getDiscs() {
    return this.service.getDiscs();
  }
}
