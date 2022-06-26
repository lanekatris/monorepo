import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { EventStoreDBClient, jsonEvent, START } from '@eventstore/db-client';
import { nanoid } from 'nanoid';
import { ESDB } from '../constants';
import { DiscAdded } from './types/disc-added';

@Controller('dg')
export class DgController {
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
  ) {}

  @Post('disc-added')
  public async discAdded(
    @Req() req: Request,
    @Body() body,
    @Res() res: Response,
  ) {
    console.log('from body', body);
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
    return true;
  }

  @Get('discs')
  public async getDiscs() {
    const events = this.client.readStream<DiscAdded>('testies');
    const discs = [];

    let discNumber = 1;
    for await (const { event } of events) {
      switch (event.type) {
        case 'disc-added':
          discs.push({
            event: event.data,
            discNumber,
          });
          discNumber++;
          break;
      }
    }
    return discs;
  }
}
