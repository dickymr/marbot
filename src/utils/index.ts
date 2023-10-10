// @ts-nocheck

import { format, parse } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import config from '../config';

import apiError from './apiError';
import catchAsync from './catchAsync';
import exclude from './exclude';
import pick from './pick';

import { Prayer } from '../types';

const translatePrayerName = (key: keyof Prayer) => {
  const englishName: Prayer = {
    imsyak: 'Imsak',
    shubuh: 'Fajr',
    terbit: 'Sunrise',
    dhuha: 'Duha',
    dzuhur: 'Dhuhr',
    ashr: 'Asr',
    magrib: 'Maghrib',
    isya: 'Isha',
  };

  return englishName[key];
};

const getFormattedDate = () => format(new Date(), 'cccc, MMMM d, yyyy');

const getPrayerTimesString = (prayerTimes: Prayer) => {
  if (!prayerTimes) {
    return null;
  }

  return Object.entries(prayerTimes)
    .map(([key, value]) => `- ${translatePrayerName(key)}: ${value}`)
    .join('\n\n');
};

const getNextPrayerString = (prayerTimes: Prayer) => {
  const currentDate = new Date();
  const zonedDate = utcToZonedTime(currentDate, config.timeZone);
  const formattedTime = format(zonedDate, 'HH:mm');

  const filteredPrayerTimes = {};
  for (const prayer in prayerTimes) {
    if (config.activePrayerTime[prayer]) {
      filteredPrayerTimes[prayer] = prayerTimes[prayer];
    }
  }

  for (const [prayer, time] of Object.entries(filteredPrayerTimes)) {
    if (
      parse(time, 'HH:mm', currentDate) >
      parse(formattedTime, 'HH:mm', currentDate)
    ) {
      return `${translatePrayerName(prayer)}: ${time}`;
    }
  }

  return null;
};

export {
  apiError,
  catchAsync,
  exclude,
  pick,
  translatePrayerName,
  getFormattedDate,
  getPrayerTimesString,
  getNextPrayerString,
};
