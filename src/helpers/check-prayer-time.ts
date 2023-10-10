// @ts-nocheck

import { parse } from 'date-fns';
import { utcToZonedTime, format } from 'date-fns-tz';
import { sendNotificationToSubscribers } from './';
import config from '../config';
import { getPrayerTimeToday } from '../services';
import { translatePrayerName } from '../utils';

const checkPrayerTime = async () => {
  const prayerTimes = await getPrayerTimeToday();

  const now = new Date();
  const localTime = utcToZonedTime(now, config.timeZone);
  const currentDate = format(localTime, 'yyyy-MM-dd');

  const activePrayerTime = Object.entries(config.activePrayerTime)
    .filter(([, isActive]) => isActive)
    .map(([key]) => key);

  for (const prayer of activePrayerTime) {
    const time = prayerTimes[prayer];

    // prettier-ignore
    const prayerTime = parse(`${currentDate} ${time}`, 'yyyy-MM-dd HH:mm', new Date(), { timeZone: config.timeZone });

    if (format(localTime, 'HH:mm') === format(prayerTime, 'HH:mm')) {
      // prettier-ignore
      const messages = [
        `__${time}__`,
        `It's now the time for __${translatePrayerName(prayer)}__ prayer in Jakarta and surrounding areas.`,
        '‍',
        'May your prayers be blessed 🤲'
      ];
      const message = messages.join('\n\n');

      sendNotificationToSubscribers(message);
    }
  }
};

export default checkPrayerTime;
