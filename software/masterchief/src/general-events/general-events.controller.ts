import {
  Body,
  Controller,
  Inject,
  Post,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { GuardMe } from '../auth/guard-me.guard';
import { EventNames } from '../dg/types/disc-added';
import { IsNotEmpty } from 'class-validator';
import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventType,
} from '@eventstore/db-client';
import { nanoid } from 'nanoid';
import { Esdb, ESDB } from '../app/constants';
import { format } from 'date-fns';

export class CreateMaintenanceDto {
  @IsNotEmpty()
  name: string;

  date: string;
}

export type MaintenanceCreated = JSONEventType<
  EventNames.MaintenanceCreated,
  {
    id: string;
    name: string;
    date: string;
  }
>;

@Controller('general-events')
@UseGuards(GuardMe)
export class GeneralEventsController {
  constructor(
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
  ) {}
  @Post(EventNames.MaintenanceCreated)
  @Redirect(`/events?eventName=${EventNames.MaintenanceCreated}`)
  public async createMaintenance(@Body() body: CreateMaintenanceDto) {
    const { name, date } = body;
    const event = jsonEvent<MaintenanceCreated>({
      type: EventNames.MaintenanceCreated,
      data: {
        id: nanoid(),
        name,
        date: date || format(new Date(), 'yyyy-LL-dd'),
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event);
  }
}
