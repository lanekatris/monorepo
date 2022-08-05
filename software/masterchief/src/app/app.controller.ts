import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  UseGuards,
  Response,
} from '@nestjs/common';

import { GuardMe } from '../auth/guard-me.guard';

import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetHomeModelQuery } from './queries/get-home-model.handler';
import { GetEventsModelQuery } from './queries/get-events-model.handler';
import { CreateEventCommand } from './commands/create-event.handler';
import { EventName } from './schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetFeedQuery } from './queries/get-feed.handler';
import schema from './schema.json';

@Controller()
export class AppController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: 'Non authed landing page' })
  @Get()
  @Render('root')
  root() {}

  @ApiOperation({ summary: 'Event timeline and links' })
  @UseGuards(GuardMe)
  @Get('home')
  @Render('home')
  async home() {
    const events = await this.queryBus.execute(new GetFeedQuery());
    const formatted = events.map((x) => ({
      ...x,
      showDiscGolfIcon:
        x.data.activities?.includes('Disc-Golf') ||
        x.data.activities?.includes('disc-golf'),
      showNoteIcon: x.eventName === 'note-taken',
      showFoodIcon: x.eventName === 'food-ate',
      showMaitenance: x.eventName === 'maintenance-created',
      showKid: x.eventName === 'child-event-created',
      showMovie: x.eventName === 'movie-watched',
      showVolleyball: x.data.activities?.includes('Volleyball'),
      showConcert: x.data.activities?.includes('concert'),
      showClimb:
        x.eventName === 'personal-record-climbing-created' ||
        x.data.activities?.includes('Indoor Bouldering'),
      showSnowboarding: x.data.activities?.includes('Snowboarding'),
      showGolf: x.data.activities?.includes('Ball Golf'),
    }));

    return {
      schema: JSON.stringify(schema),
      events: formatted,
    };
  }

  @ApiTags('events')
  @UseGuards(GuardMe)
  @Get('events')
  @Render('events/events')
  async events() {
    return this.queryBus.execute(new GetEventsModelQuery());
  }

  @UseGuards(GuardMe)
  @Get('api/events')
  async apiEvents() {
    const result = await this.queryBus.execute(new GetFeedQuery());

    return result;
  }

  @ApiTags('events')
  @UseGuards(GuardMe)
  @Post('create-event')
  async createEvent(
    @Body() input: { eventName: EventName; redirect?: string },
    @Response() res,
  ) {
    const { eventName, redirect, ...body } = input;
    const result = await this.commandBus.execute(
      new CreateEventCommand(eventName, body),
    );

    if (redirect) {
      return res.redirect(redirect);
    }
    return res.status(200).json(result);
  }

  @ApiTags('wip')
  @UseGuards(GuardMe)
  @Get('workflows')
  @Render('wip/workflows')
  workflows() {
    return {};
  }
}
