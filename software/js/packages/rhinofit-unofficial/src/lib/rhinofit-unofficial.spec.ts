import { Member, MembersResponse, TrackingRecordType } from './recent-access';
// import accessTracking from './access-tracking';
const data: MembersResponse = require('./access-tracking.json');
const reservations: ReservationsResponse = require('./reservations.json');
import cheerio from 'cheerio';
import { isSameDay } from 'date-fns';

describe('rhinofitUnofficial', () => {
  it('should work', () => {
    // expect(rhinofitUnofficial()).toEqual('rhinofit-unofficial');
    // console.log(data.aaData[0]);
    const stuffToDo: string[] = [];

    // for (const access in data.aaData) {
    //   console.log(access);
    // }

    // Create a map of dac entries
    // todo: we only care about today
    // const now = new Date();
    const now = new Date(2024, 1, 23);
    const dacEntries = new Set(
      data.aaData
        .filter(onlyDoorAccessLogs)
        .filter((x) => onlyToday(x, now))
        .map(findUserId)
    );

    const kioskEntries = new Set(
      data.aaData
        .filter(onlyDoorAccessLogs)
        .filter((x) => onlyToday(x, now))
        .map(findUserId)
    );

    // Create a map of kiosk entries
    console.log('dac', dacEntries);
    console.log('kiosk', kioskEntries);

    // for (const access of data.aaData) {
    //
    // }
    kioskEntries.delete('578365');
    console.log('kioskwwww', kioskEntries);
    // reserve kiosk
    for (const dac of dacEntries) {
      if (!kioskEntries.has(dac)) {
        stuffToDo.push('reserve kiosk for ' + dac);
      }
    }
    console.log('final', stuffToDo);

    for (const todo of stuffToDo) {
      // todo: actually register kiosk
      console.log(todo);
    }

    // todo: log into calendar

    // so we know our dac entries, but what about reservations?
    // const hackReservationNow = new Date(2024, 1, 17, 18, 34);
    // const reservationsUserIds = new Set(
    //   reservations.aaData
    //     .filter((x) => reservationIsToday(x, hackReservationNow))
    //     .map(findReservtionUserId)
    // );
    //
    // console.log('reservations', reservationsUserIds);

    // Is there a reservation for their dac entry?
    // We hve a time constraint here, not just user id
    for (const dac of data.aaData
      .filter(onlyDoorAccessLogs)
      .filter((x) => onlyToday(x, now))) {
      // if there are multiple dacs we don't need to make multiple reservations
      // find the closest reservation key to their dac
      // we need to know if this user has a reservation
    }

    // Get public feed of available reservation... we only need to do this if we are missing a reservation for someone...
  });

  describe('date tests', () => {
    it('should be today', () => {
      const isToday = onlyToday(data.aaData[0], new Date(2024, 0, 1, 18, 34));
      expect(isToday).toBe(true);
    });
  });

  describe('findUserId', () => {
    it('should find from a reservation', () => {
      expect(findReservtionUserId(reservations.aaData[0])).toEqual('846282');
    });
  });
});

function onlyToday({ al_cal_datetime }: Member, now: Date) {
  const date = new Date(al_cal_datetime);
  return isSameDay(date, now);
}

function reservationIsToday(reservation: Reservation, now: Date) {
  const date = new Date(reservation.r_key);
  return isSameDay(date, now);
}

// reserve kiosk
// book on calendar

function onlyDoorAccessLogs({ al_cal_type }: Member) {
  return al_cal_type === TrackingRecordType.DAC;
}

function findUserId(member: Member) {
  const $ = cheerio.load(member.al_cal_userlink);

  const href = $('a').attr('href');
  if (!href) throw new Error('No href found in ' + JSON.stringify(member));
  const startIndex = href.indexOf('userid=') + 'userid='.length;
  const endIndex = href.indexOf('&', startIndex);
  const userid =
    endIndex !== -1
      ? href.substring(startIndex, endIndex)
      : href.substring(startIndex);
  return userid;
}

function findReservtionUserId(reservation: Reservation) {
  const $ = cheerio.load(reservation.u_name);

  const href = $('a').attr('href');
  if (!href) throw new Error('No href found in ' + JSON.stringify(reservation));
  const startIndex = href.indexOf('userid=') + 'userid='.length;
  const endIndex = href.indexOf('&', startIndex);
  const userid =
    endIndex !== -1
      ? href.substring(startIndex, endIndex)
      : href.substring(startIndex);
  return userid;
}

export interface ReservationsResponse {
  aaData: Reservation[];
}

export interface Reservation {
  DT_RowId: string;
  u_name: string;
  c_name: string;
  r_key: string;
  r_timestamp: Date;
}
