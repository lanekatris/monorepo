import { differenceInYears } from 'date-fns';

export function getPlayerTimeInYears(udiscDate: string, now = new Date()) {
  const [raw] = udiscDate.split(' ');
  const years = differenceInYears(now, new Date(raw));
  return years ? `${years} years` : 'Less than a year';
}
