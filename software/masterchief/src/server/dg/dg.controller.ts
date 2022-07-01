import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { EventStoreDBClient, jsonEvent, START } from '@eventstore/db-client';
import { nanoid } from 'nanoid';
import { ESDB } from '../constants';
import { DiscAdded } from './types/disc-added';
import { DgService } from './dg.service';

@Controller('dg')
export class DgController {
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
    @Inject(DgService)
    private service: DgService,
  ) {}

  @Post('/disc-added')
  public async discAdded(@Body() body): Promise<string> {
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
    return 'worked';
  }

  @Get('discs')
  public getDiscs() {
    return this.service.getDiscs();
  }
}
