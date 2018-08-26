interface RelativeTime {
  count: number
  unit: string
}

const timeSince = (secondsPast: number): RelativeTime => {
  if (secondsPast < 60) {
    return {count: Math.floor(secondsPast), unit: 'second'};
  }
  if (secondsPast < 3600) {
    return {count: Math.floor(secondsPast/60), unit: 'minute'};
  }
  if (secondsPast < 86400) {
    return {count: Math.floor(secondsPast/3600), unit: 'hour'};
  }
};

const monthNames = [
  'January', 'February',
  'March', 'April',
  'May', 'June',
  'July', 'August',
  'September', 'October',
  'November', 'December'
];

const getMonthName = (timeStamp: Date) => (monthNames[timeStamp.getMonth()]);

export const convertTime = (timeStamp: Date, now: Date = new Date()): string => {
  const secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;

  if (secondsPast < 2) {
    return 'just now';
  }

  const timeData = timeSince(secondsPast);

  if (timeData) {
    return `${timeData.count} ${timeData.unit}${timeData.count === 1 ? '' : 's'} ago`;
  } else {
    return `on ${getMonthName(timeStamp)} ${timeStamp.getDate()} ${timeStamp.getFullYear()}`;
  }
};