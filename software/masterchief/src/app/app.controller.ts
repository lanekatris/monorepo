import {
  Controller,
  Get,
  Inject,
  Logger,
  Query,
  Render,
  UseGuards,
} from '@nestjs/common';
import { GuardMe } from '../auth/guard-me.guard';
import { UserValidator } from '../auth/user-validator.service';
import { EventNames } from '../dg/types/disc-added';
import { ESDB, Esdb } from './constants';
import { EventStoreDBClient } from '@eventstore/db-client';
import {
  AdventureCreated,
  AdventureCreatedData,
  AdventureImportStarted,
} from '../adventure/types/adventure-created';
import { AdventureDeleted } from '../adventure/types/adventure-deleted';
import { AdventureActivity } from '../adventure/types/adventure-activity';
import {
  MaintenanceCreated,
  PersonalRecordClimbingCreated,
} from '../general-events/general-events.controller';
import { DgService } from '../dg/dg.service';
import { format } from 'date-fns';

interface FeedItem {
  date: string;
  name: string;
  type: string;
}

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
      | AdventureCreated
      | AdventureDeleted
      | AdventureImportStarted
      | MaintenanceCreated
      | PersonalRecordClimbingCreated
    >(Esdb.StreamEvents);
    let generalEvents = [];
    try {
      for await (const { event } of events) {
        switch (event.type) {
          case EventNames.AdventureCreated:
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
          case EventNames.MaintenanceCreated:
            generalEvents.unshift({
              data: {
                id: event.data.id,
                activities: [],
                name: event.data.name,
                date: event.data.date,
              },
            });
            break;
          case EventNames.PersonalRecordClimbingCreated:
            generalEvents.unshift({
              data: {
                id: event.data.id,
                activities: [],
                name: event.data.name,
                date: event.data.date,
              },
            });
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

  @UseGuards(GuardMe)
  @Get('events')
  @Render('events/events')
  async events(@Query('eventName') eventName: string) {
    const generalEvents = await this.getAllGeneralEvents();
    return {
      eventName,
      showAdventureCreated: eventName === EventNames.AdventureCreated,
      showMaintenanceCreated: eventName === EventNames.MaintenanceCreated,
      showPersonalRecordClimbingCreated:
        eventName === EventNames.PersonalRecordClimbingCreated,
      createAdventureUrl: `/adventure/${EventNames.AdventureCreated}`,
      deleteAdventureUrl: `/adventure/${EventNames.AdventureDeleted}`,
      createMaintenanceUrl: `/general-events/${EventNames.MaintenanceCreated}`,
      createPersonalRecordClimbingUrl: `/general-events/${EventNames.PersonalRecordClimbingCreated}`,
      AdventureActivity: AdventureActivity,
      calendarEvents: JSON.stringify(
        generalEvents.map((e) => {
          const formatted = {
            id: e.id,
            title: `${e.activities.join(', ')} ${e.name}`,
            start: e.date,
            color: 'blue',
            textColor: 'white',
          };
          // return
          if (e.activities.length === 0) {
            formatted.color = 'yellow';
            formatted.textColor = 'black';
          }

          return formatted;
        }),
      ),
    };
  }
}
