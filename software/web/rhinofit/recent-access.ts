import { addDays } from 'date-fns';
import { Credentials } from './auth';
import axios from 'axios';
import { parse } from 'node-html-parser';

function onlyUnique(value: string, index: number, array: string[]) {
  return array.indexOf(value) === index;
}

export enum TrackingRecordType {
  KIOSK = 'Kiosk',
  DAC = 'DAC Entry'
}

export interface Member {
  DT_RowId: string;
  al_cal_datetime: string;
  al_cal_type: TrackingRecordType;
  al_cal_loggedby: string;
  al_cal_userlink: string;
  al_cal_viewuser: string;
  al_cal_state: string;
  al_cal_billnum: number;
  al_cal_billtot: string;
  al_cal_memberships: string;
  al_cal_location: string;
  al_cal_handledby: string;
  al_cal_handledwhen: string;
}

export interface MembersResponse {
  aaData: Member[];
}

interface RhinofitAccessRecord {
  id: string;
  date: string;
  name: string;
  time: string;
}

export async function getMembers(
  credentials: Credentials
): Promise<RhinofitAccessRecord[]> {
  const today = new Date().toISOString().split('T')[-1];
  const lastWeek = addDays(new Date(), -11).toISOString().split('T')[0];
  const { data } = await axios.get<MembersResponse>(
    `https://my.rhinofit.ca/datatables.php?method=getaccesstrackingobject&al_event=&start=${lastWeek}&end=${today}`,
    {
      headers: {
        Cookie: credentials.cookies.join('; ')
      }
    }
  );

  return data.aaData
    .filter((x) => x.al_cal_type === 'DAC Entry')
    .reverse()
    .map((x) => ({
      id: `${x.al_cal_datetime.split(' ')[0]} - ${
        parse(x.al_cal_userlink)?.firstChild?.rawText
      }`,
      date: x.al_cal_datetime.split(' ')[0],
      time: x.al_cal_datetime.split(' ')[1],
      name: parse(x.al_cal_userlink)?.firstChild?.rawText ?? ''
    }));
  // .map(
  //   (x) =>
  //     `${x.al_cal_datetime.split(' ')[0]} - ${
  //       parse(x.al_cal_userlink)?.firstChild?.rawText
  //     }`
  // )
  // .filter(onlyUnique);
}
