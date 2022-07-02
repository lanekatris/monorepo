import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Render,
  Response,
} from '@nestjs/common';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { nanoid } from 'nanoid';
import { ESDB } from '../constants';
import { DiscAdded, DiscRemoved, EventNames } from './types/disc-added';
import { DgService } from './dg.service';
import { IsNotEmpty } from 'class-validator';

const CONTROLLER_NAME = 'dg';

function prefixController(route: string) {
  return `${CONTROLLER_NAME}/${route}`;
}

export class DiscRemovedDto {
  @IsNotEmpty()
  id: string;
}

@Controller(CONTROLLER_NAME)
export class DgController {
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

  @Get('discs')
  public getDiscs() {
    return this.service.getDiscs();
  }
}
