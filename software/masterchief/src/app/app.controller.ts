import { Body, Controller, Get, Post, Render, UseGuards } from '@nestjs/common';

import { GuardMe } from '../auth/guard-me.guard';

import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetHomeModelQuery } from './queries/get-home-model.handler';
import { GetEventsModelQuery } from './queries/get-events-model.handler';
import { CreateEventCommand } from './commands/create-event.handler';
import { EventName } from '../schema/schema';

@Controller()
export class AppController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @Render('root')
  root() {}

  @UseGuards(GuardMe)
  @Get('home')
  @Render('home')
  async home() {
    return this.queryBus.execute(new GetHomeModelQuery());
  }

  @UseGuards(GuardMe)
  @Get('events')
  @Render('events/events')
  async events() {
    return this.queryBus.execute(new GetEventsModelQuery());
  }

  @UseGuards(GuardMe)
  @Post('create-event')
  async createEvent(@Body() input: { eventName: EventName }) {
    const { eventName, ...body } = input;
    return this.commandBus.execute(new CreateEventCommand(eventName, body));
  }
}
