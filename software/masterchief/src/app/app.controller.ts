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
import { MaintenanceCreated } from '../general-events/general-events.controller';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(
    @Inject(UserValidator) private service: UserValidator,
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
  ) {}

  @Get()
  @Render('root')
  root() {
    return {};
  }

  @UseGuards(GuardMe)
  @Get('home')
  @Render('home')
  home() {
    return {};
  }

  // todo: move me out
  private async getAllGeneralEvents(): Promise<AdventureCreatedData[]> {
    const events = this.esdb.readStream<
      | AdventureCreated
      | AdventureDeleted
      | AdventureImportStarted
      | MaintenanceCreated
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
      createAdventureUrl: `/adventure/${EventNames.AdventureCreated}`,
      deleteAdventureUrl: `/adventure/${EventNames.AdventureDeleted}`,
      createMaintenanceUrl: `/general-events/${EventNames.MaintenanceCreated}`,
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
