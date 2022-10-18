import { format, parseISO } from 'date-fns';

export function isIsoDate(date: string) {
  return date.includes('T');
}

export function getIsoDatePart(date: string): string | undefined {
  if (!isIsoDate(date)) return undefined;
  return format(parseISO(date), 'yyyy-LL-dd');
}
