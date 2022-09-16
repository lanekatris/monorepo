export function isIsoDate(date: string) {
  return date.includes('T');
}

export function getIsoDatePart(date: string): string | undefined {
  if (!isIsoDate(date)) return undefined;
  return date.split('T')[0];
}
