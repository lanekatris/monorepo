import { Controller, Get, Res, Req, Post, Body, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { parse } from 'url';
import { nanoid } from 'nanoid';

import { ViewService } from './view.service';
import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventType,
  START,
} from '@eventstore/db-client';
export const ESDB = 'esdb';
type DiscAdded = JSONEventType<
  'disc-added',
  {
    id: string;
    date: Date;
    brand: string;
    model: string;
  }
>;

@Controller('/')
export class ViewController {
  constructor(
    private viewService: ViewService,
    @Inject(ESDB)
    private client: EventStoreDBClient,
  ) {}

  @Get('home')
  public async showHome(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }

  @Post('home')
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

  @Get('_next*')
  public async assets(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }

  @Get('favicon.ico')
  public async favicon(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }
}
