import {
  Controller,
  Get,
  Inject,
  Logger,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';

const fs = require('fs');
import { GuardMe } from '../auth/guard-me.guard';
import { UserValidator } from '../auth/user-validator.service';
import { EventNames } from '../dg/types/disc-added';
import { ESDB, Esdb } from './constants';
import { EventStoreDBClient } from '@eventstore/db-client';
import { AdventureImportStarted } from '../adventure/types/adventure-created';
import { AdventureDeleted } from '../adventure/types/adventure-deleted';
import { AdventureCreatedData } from '../schema/schema';
import {
  AdventureCreated,
  EventDeleted,
  MaintenanceCreated,
  PersonalRecordClimbingCreated,
} from '../general-events/general-events.controller';
import { DgService } from '../dg/dg.service';
import { format } from 'date-fns';
import { compile } from 'json-schema-to-typescript';
import schema from '../schema/schema.json';
import { nanoid } from 'nanoid';
interface FeedItem {
  date: string;
  name: string;
  type: string;
}

const uiSchema = {
  eventName: { 'ui:widget': 'hidden' },
  id: { 'ui:widget': 'hidden' },
};

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    @Inject(UserValidator) private service: UserValidator,
    @Inject(ESDB)
    private esdb: EventStoreDBClient,

    @Inject(DgService)
    private dgService: DgService,
  ) {}

  @Get()
  @Render('root')
  root() {
    return {};
  }

  @UseGuards(GuardMe)
  @Get('home')
  @Render('home')
  async home() {
    let events: FeedItem[] = [];

    const generalEvents = await this.getAllGeneralEvents();
    generalEvents.forEach((x) => {
      events.push({ date: x.date, name: x.name, type: 'Adventure' });
    });

    // const events = await this.getAllGeneralEvents();
    const discs = await this.dgService.getDiscs();
    discs.forEach((x) => {
      if (!x.event.date) {
        this.logger.log(
          `Ignoring disc ${x.event.brand}/${x.event.model} because there is no date associated`,
        );
        return;
      }
      events.push({
        date: format(new Date(x.event.date), 'yyyy-LL-dd'),
        name: `#${x.discNumber} ${x.event.brand}/${x.event.model}`,
        type: 'Disc Added',
      });
    });
    this.logger.log(`Home got ${events.length} events`);

    events = events.sort((x, y) => y.date.localeCompare(x.date));

    return { events };
  }

  // todo: move me out
  private async getAllGeneralEvents(): Promise<AdventureCreatedData[]> {
    const events = this.esdb.readStream<
      // | AdventureCreated
      | AdventureCreated
      | AdventureDeleted
      | AdventureImportStarted
      | MaintenanceCreated
      | PersonalRecordClimbingCreated
      | EventDeleted
    >(Esdb.StreamEvents);
    let generalEvents = [];
    try {
      for await (const { event } of events) {
        switch (event.type) {
          case 'adventure-created':
            generalEvents.unshift(event);
            break;
          case EventNames.AdventureDeleted:
            generalEvents = generalEvents.filter(
              (e) => e.data.id !== event.data.id,
            );
            break;
          case EventNames.AdventureImportStarted:
            generalEvents = generalEvents.filter(
              (e) => e.metadata.source !== 'CSV',
            );
            break;
          case 'maintenance-created':
            generalEvents.unshift({
              data: {
                id: event.data.id,
                activities: [],
                name: event.data.name,
                date: event.data.date,
              },
            });
            break;
          case 'personal-record-climbing-created':
            generalEvents.unshift({
              data: {
                id: event.data.id,
                activities: [],
                name: event.data.name,
                date: event.data.date,
              },
            });
            break;
          case 'event-deleted':
            // console.log('event deleted man', )
            generalEvents = generalEvents.filter(
              (e) => e.data.id !== event.data.eventId,
            );
            break;
        }
      }
    } catch (err) {
      if (err.type === 'stream-not-found') {
        return [];
      }
      throw err;
    }
    return generalEvents
      .map((x) => x.data)
      .sort((a, b) => a.date - b.date)
      .reverse();
  }

  // TODO: move this and delte unneeded code
  // todo: hide id,
  //  todo: create a default for date
  @UseGuards(GuardMe)
  @Get('events')
  @Render('events/events')
  async events() {
    const generalEvents = await this.getAllGeneralEvents();
    // const generalEvents = [];
    return {
      // eventName,
      // showAdventureCreated: eventName === EventNames.AdventureCreated,
      // showMaintenanceCreated: eventName === EventNames.MaintenanceCreated,
      // showPersonalRecordClimbingCreated:
      //   eventName === EventNames.PersonalRecordClimbingCreated,
      // createAdventureUrl: `/adventure/${EventNames.AdventureCreated}`,
      // deleteAdventureUrl: `/adventure/${EventNames.AdventureDeleted}`,
      // createMaintenanceUrl: `/general-events/${EventNames.MaintenanceCreated}`,
      // createPersonalRecordClimbingUrl: `/general-events/${EventNames.PersonalRecordClimbingCreated}`,
      // AdventureActivity: AdventureActivity,
      schema: JSON.stringify(schema),
      uiSchema: JSON.stringify(uiSchema),
      formData: JSON.stringify({
        id: nanoid(),
        // date: format(new Date(), 'LL/dd/yyyy'),'2022-07-27'
        date: format(new Date(), 'yyyy-LL-dd'),
      }),
      calendarEvents: JSON.stringify(
        generalEvents.map((e) => {
          const formatted = {
            id: e.id,
            // title: e.activities?.length
            //   ? `${e.activities} ${e.name}`
            //   : `delete me: ${e.id}`,
            title: `${e.activities} ${e.name}`,
            start: e.date,
            color: 'blue',
            textColor: 'white',
          };
          // return
          if (e.activities?.length === 0) {
            formatted.color = 'yellow';
            formatted.textColor = 'black';
          }

          return formatted;
        }),
      ),
    };
  }
}
