import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Render,
  Response,
} from '@nestjs/common';
import { EventStoreDBClient, jsonEvent, START } from '@eventstore/db-client';
import { nanoid } from 'nanoid';
import { ESDB } from '../constants';
import { DiscAdded } from './types/disc-added';
import { DgService } from './dg.service';

export enum DgEvents {
  DiscAdded = 'disc-added',
}

@Controller('dg')
export class DgController {
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
    @Inject(DgService)
    private service: DgService,
  ) {}

  @Post(DgEvents.DiscAdded)
  public async discAdded(@Response() res, @Body() body): Promise<string> {
    const event = jsonEvent<DiscAdded>({
      type: 'disc-added',
      data: {
        id: nanoid(),
        date: body.date || new Date(),
        brand: body.brand,
        model: body.model,
      },
    });
    await this.client.appendToStream('testies', event);
    return res.redirect('/dg');
  }

  @Get('discs')
  public getDiscs() {
    return this.service.getDiscs();
  }

  @Get()
  @Render('index')
  async testies() {
    const discs = await this.service.getDiscs();
    return {
      discs: discs.map((x) => `${x.event.brand} - ${x.event.model}`),
      postUrl: `dg/${DgEvents.DiscAdded}`,
    };
  }
}
