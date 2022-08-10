import { CommandBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RhinofitConfiguration } from '../configuration';
import request from 'request';
import axios from 'axios';
import FormData from 'form-data';
import { format } from 'date-fns';
import rp from 'request-promise';
import { URL } from 'url';
import { parse } from 'node-html-parser';
import { LoginRhinofitCommand } from '../commands/login-rhinofit.handler';
export const dayFormat = 'yyyy-MM-dd';
export class GetTrackingRecordsQuery {
  constructor(public start: Date, public end: Date) {}
}
export enum TrackingRecordType {
  KIOSK = 'Kiosk',
  DAC = 'DAC Entry',
}
export class RawActivity {
  constructor(
    public DT_RowId: string,
    public al_cal_userlink: string,
    public al_cal_datetime: string,
    public al_cal_type: TrackingRecordType,
  ) {}
}

export class Activity {
  constructor(
    public id: string,
    public date: Date,
    public userId: number,
    public type: TrackingRecordType,
    public name: string,
  ) {}
}
@QueryHandler(GetTrackingRecordsQuery)
export class GetTrackingRecordsHandler
  implements IQueryHandler<GetTrackingRecordsQuery>
{
  private readonly logger = new Logger(GetTrackingRecordsHandler.name);

  constructor(private commandBus: CommandBus) {}

  private parseRawActivity(rawActivity: RawActivity): Activity {
    const {
      DT_RowId: id,
      al_cal_userlink,
      al_cal_datetime,
      al_cal_type: type,
    } = rawActivity;

    const root = parse(al_cal_userlink);
    if (!root.firstChild) {
      console.log('raw error', JSON.stringify(rawActivity));
    }
    const url = new URL(
      // @ts-ignore
      'http://dontcare.com/' + root.firstChild.attributes.href,
    );

    const date = new Date(al_cal_datetime);

    return {
      id,
      date,
      userId: parseInt(url.searchParams.get('userid')!, 10),
      type,
      name: root.firstChild.rawText,
    };
  }

  async execute({ start, end }: GetTrackingRecordsQuery): Promise<any> {
    this.logger.log(`Logging in...`);
    // const cookies = await this.login();
    const cookies = await this.commandBus.execute(new LoginRhinofitCommand());

    const baseUrl =
      'https://my.rhinofit.ca/datatables.php?method=getaccesstrackingobject&al_event=&start=';
    const url = `${baseUrl}${format(start, dayFormat)}&end=${format(
      end,
      dayFormat,
    )}`;

    this.logger.log(`Get tracking data from: ${url}`);

    const body = await rp({
      url,
      headers: {
        Cookie: cookies.join('; '),
      },
    });

    return JSON.parse(body).aaData.map((x) => this.parseRawActivity(x));
  }
}
