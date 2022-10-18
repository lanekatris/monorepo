import { URL } from "url";
import { parse } from "node-html-parser";
import { login } from "./login";
export const dayFormat = "yyyy-MM-dd";
import { format } from "date-fns";
import rp from "request-promise";
export class GetTrackingRecordsQuery {
  constructor(public start: Date, public end: Date) {}
}
export enum TrackingRecordType {
  KIOSK = "Kiosk",
  DAC = "DAC Entry",
}
export class RawActivity {
  constructor(
    public DT_RowId: string,
    public al_cal_userlink: string,
    public al_cal_datetime: string,
    public al_cal_type: TrackingRecordType
  ) {}
}

export class Activity {
  constructor(
    public id: string,
    public date: Date,
    public userId: number,
    public type: TrackingRecordType,
    public name: string
  ) {}
}

export interface RawActivityResponse {
  aaData: RawActivity[];
}

function parseRawActivity(rawActivity: RawActivity): Activity {
  const {
    DT_RowId: id,
    al_cal_userlink,
    al_cal_datetime,
    al_cal_type: type,
  } = rawActivity;

  const root = parse(al_cal_userlink);
  if (!root.firstChild) {
    console.log("raw error", JSON.stringify(rawActivity));
  }
  const url = new URL(
    // @ts-ignore
    "http://dontcare.com/" + root.firstChild.attributes.href
  );

  const date = new Date(al_cal_datetime);

  return {
    id,
    date,
    userId: parseInt(url.searchParams.get("userid")!, 10),
    type,
    name: root.firstChild.rawText,
  };
}

export async function getTrackingRecords(input: GetTrackingRecordsQuery) {
  const { start, end } = input;
  // console.log("args", { start, end, input });
  const cookies = await login();

  const baseUrl =
    "https://my.rhinofit.ca/datatables.php?method=getaccesstrackingobject&al_event=&start=";
  const url = `${baseUrl}${format(start, dayFormat)}&end=${format(
    end,
    dayFormat
  )}`;

  console.log("url", url);
  const body = await rp({
    url,
    headers: {
      Cookie: cookies.join("; "),
    },
  });

  // console.log("body", body);
  const parsed: RawActivityResponse = JSON.parse(body);
  return parsed.aaData.map((x) => parseRawActivity(x));
}
