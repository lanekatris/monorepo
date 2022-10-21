import { Activity, dayFormat, TrackingRecordType } from "./getTrackingRecords";
import { format, isSameDay } from "date-fns";
import _ from "lodash";

export interface IActivityProcessorService {
  evaluate(records: Activity[]): IProcessResult;
  process(records: Activity[]): Promise<void>;
}
export interface IProcessResult {
  totalRecordCount: number;
  dacRecordCount: number;
  problemCount: number;
  problems: Activity[];
}

export class ActivityProcessorOptions {
  public today: Date;

  constructor() {
    this.today = new Date();
  }
}

export class ActivityProcessorService implements IActivityProcessorService {
  public options: ActivityProcessorOptions;

  constructor(
    // private kioskService: IKioskService,
    // private logger: Logger,
    options?: ActivityProcessorOptions
  ) {
    this.options = { ...new ActivityProcessorOptions(), ...options };
  }

  public evaluate(records: Activity[]): IProcessResult {
    if (records.length === 0) {
      return {
        totalRecordCount: 0,
        dacRecordCount: 0,
        problemCount: 0,
        problems: [],
      };
    }

    const { today } = this.options;
    const sortedRecords: Activity[] = _.orderBy(records, "date");
    const firstRecord = _.first(sortedRecords) || { date: "" };
    const lastRecord = _.last(sortedRecords) || { date: "" };

    console.log(
      `Processing ${records.length} records between ${firstRecord.date} and ${lastRecord.date}`
    );
    const dacRecords = _.uniqBy(
      records

        // We need to filter out for just today because that is the only time we can do anything (limitation with RhinoFit Kiosk)
        // .filter(x => x.date.isSame(today, 'day'))
        .filter((x) => isSameDay(x.date, today))

        .filter((x) => x.type === TrackingRecordType.DAC), // Door entries // todo: rename to door entries not dac

      // Don't care if they have multiple DAC entries, so we don't dupe kiosk entries
      (record) => `${record.userId}|${record.type}`
    );

    console.log(
      `Dac records for today: ${format(today, dayFormat)} - ${
        dacRecords.length
      }`
    );

    const problems: Activity[] = [];

    dacRecords.forEach((dacRecord: Activity) => {
      // Find their kiosk entry
      const kioskEntries = records.filter(
        (x) =>
          x.userId === dacRecord.userId &&
          isSameDay(dacRecord.date, x.date) &&
          // dacRecord.date.isSame(x.date, 'day') &&
          x.type === TrackingRecordType.KIOSK
      );

      // They forgot to log into the kiosk!
      if (kioskEntries.length === 0) {
        problems.push(dacRecord);
      }
    });

    console.log(
      `Found ${problems.length} DACs without a Kiosk entry: ${problems.map(
        (x) => x.name
      )}`
    );

    return {
      totalRecordCount: records.length,
      dacRecordCount: dacRecords.length,
      problemCount: problems.length,
      problems,
    };
  }

  // This service is really just meant to figure out if something is wrong
  // The kiosk service knows how to query and create kiosk activity entries
  public async process(records: Activity[]): Promise<void> {
    // const promises = records.map(record =>
    //   this.kioskService.create(record.userId)
    // );
    // await Promise.all(promises);
  }
}
