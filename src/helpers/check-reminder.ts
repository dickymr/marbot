import { parse, differenceInMinutes } from 'date-fns';
import { utcToZonedTime, format } from 'date-fns-tz';
import { sendReminder } from './';
import config from '../config';
import { getPrayerTimeToday } from '../services';
import { getNextPrayerString } from '../utils';

const checkReminder = async () => {
  const prayerTimes = await getPrayerTimeToday();

  if (!prayerTimes) return null;

  const now = new Date();
  const localTime = format(utcToZonedTime(now, config.timeZone), 'HH:mm');

  const nextPrayerString = getNextPrayerString(prayerTimes);
  const nextPrayerName = nextPrayerString?.split(': ')[0] || '';
  const nextPrayerTime = nextPrayerString?.split(': ')[1] || '';

  const difference = differenceInMinutes(
    parse(nextPrayerTime, 'HH:mm', new Date()),
    parse(localTime, 'HH:mm', new Date())
  );

  if (!difference || difference > 10) return;

  // prettier-ignore
  const message = `In __${difference} ${difference > 1 ? 'minutes' : 'minute'} (${nextPrayerTime})__, it will be time for the __${nextPrayerName}__ prayer in Jakarta and the surrounding areas.`;

  sendReminder(message, difference);
};

export default checkReminder;
