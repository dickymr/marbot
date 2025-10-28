// @ts-nocheck

import { parse } from 'date-fns';
import { utcToZonedTime, format } from 'date-fns-tz';
import { sendNotification } from './';
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
        `It's time for the __${translatePrayerName(prayer)}__ prayer in Jakarta and surrounding areas.`,
        `May your prayers bring peace and blessings 🤲`,
        `Source: jadwalsholat.org`,
      ];
      const message = messages.join('\n');

      sendNotification(message);
    }
  }
};

export default checkPrayerTime;
