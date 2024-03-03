import { differenceInYears } from 'date-fns';

export function getPlayerTimeInYears(udiscDate: Date, now = new Date()) {
  // const [raw] = udiscDate.split(' ');
  const years = differenceInYears(now, udiscDate);
  return years ? `${years} years` : 'Less than a year';
}
