const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Formats an ISO date as the compact month/day label used in site chrome.
 */
export function formatShortDate(iso: string): string {
  const dateOnly = iso.split('T')[0];
  const [, monthStr, dayStr] = dateOnly.split('-');
  const monthIndex = Number(monthStr) - 1;
  const day = Number(dayStr);
  return `${SHORT_MONTHS[monthIndex] ?? ''} ${day}`;
}
