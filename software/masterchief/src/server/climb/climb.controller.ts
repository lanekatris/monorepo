import {
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Render,
  Response,
} from '@nestjs/common';
import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventType,
} from '@eventstore/db-client';
import { nanoid } from 'nanoid';
import { ESDB } from '../constants';

export enum EventNames {
  ClimbSessionCreated = 'climb-session-created',
}

export type ClimbSessionCreated = JSONEventType<
  EventNames.ClimbSessionCreated,
  {
    id: string;
    date: Date;
  }
>;

@Controller('climb')
export class ClimbController {
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
  ) {}
  @Get()
  @Render('climb/index')
  index() {
    return {};
  }

  @Post(EventNames.ClimbSessionCreated)
  public async climbSessionCreated(@Response() res) {
    const event = jsonEvent<ClimbSessionCreated>({
      type: EventNames.ClimbSessionCreated,
      data: {
        id: nanoid(),
        date: new Date(),
      },
    });
    await this.client.appendToStream('climbs', event);
    return res.redirect(`session/${event.data.id}`);
  }

  @Get('session/:id')
  @Render('climb/session')
  public async viewClimbSession(@Param('id') sessionId: string) {
    console.log('sessionid', sessionId);
    return {};
  }
}
