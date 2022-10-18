import { CommandBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';
import { RhinofitConfiguration } from '../configuration';
import { Logger } from '@nestjs/common';
import { LoginRhinofitCommand } from '../commands/login-rhinofit.handler';
import rp from 'request-promise';
import { dayFormat } from './get-tracking-records.handler';
import { parse } from 'node-html-parser';

export class GetReservationsQuery {
  constructor(public start: Date, public end: Date) {}
}

export interface Reservation {
  id: string;
  userId: number;
  userName: string;
  slotTime: Date;
  timestamp: Date;
}

export interface RawReservationResponse {
  aaData: RawReservation[];
}

export interface RawReservation {
  DT_RowId: string;
  u_name: string;
  c_name: string;
  r_key: string;
  r_timestamp: Date;
}

@QueryHandler(GetReservationsQuery)
export class GetReservationsHandler
  implements IQueryHandler<GetReservationsQuery>
{
  private readonly logger = new Logger(GetReservationsHandler.name);
  constructor(private commandBus: CommandBus) {}

  private parseRawReservation(rawReservation: RawReservation): Reservation {
    const { DT_RowId: id, u_name, r_key, r_timestamp } = rawReservation;

    const root = parse(u_name);
    if (!root.firstChild) {
      this.logger.error(
        `Failed to parse raw reservation: ${JSON.stringify(rawReservation)}`,
      );
    }

    const url = new URL(
      // @ts-ignore
      `http://dontcare.com/${root.firstChild.attributes.href}`,
    );

    return {
      id,
      userId: parseInt(url.searchParams.get('userid')!, 10),
      userName: root.firstChild.rawText,
      slotTime: new Date(r_key),
      timestamp: new Date(r_timestamp),
    };
  }

  private buildUrl(start: Date, end: Date): string {
    const url = new URL('https://my.rhinofit.ca/datatables.php');
    url.searchParams.append('method', 'getreservationsobject');
    url.searchParams.append('start', format(start, dayFormat));
    url.searchParams.append('end', format(end, dayFormat));
    return url.toString();
  }

  async execute({ start, end }: GetReservationsQuery): Promise<any> {
    const cookies = await this.commandBus.execute(new LoginRhinofitCommand());
    const url = this.buildUrl(start, end);

    const body = await rp({
      url,
      headers: {
        Cookie: cookies.join('; '),
      },
    });

    const parsed: RawReservationResponse = JSON.parse(body);
    return parsed.aaData.map((x) => this.parseRawReservation(x));
  }
}
