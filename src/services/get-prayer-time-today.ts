import { format } from 'date-fns-tz';
import config from '../config';
import logger from '../config/logger';
import { GET_PRAYER_SCHEDULE_URL } from '../constants';
import { Prayer, PrayerResponse } from '../types';

let prayerTimes: Prayer | null | undefined = null;
let lastUpdatedDate: string | null = null;

// let prayerTimes = {
//   imsyak: '16:30',
//   shubuh: '16:31',
//   terbit: '16:32',
//   dhuha: '16:33',
//   dzuhur: '16:34',
//   ashr: '16:35',
//   magrib: '16:36',
//   isya: '16:37',
// };
// let lastUpdatedDate = '2023-10-09';

const fetchPrayerTimeToday = async () => {
  const { location } = config;

  const today = format(new Date(), 'yyyy-MM-dd', { timeZone: config.timeZone });
  const year = today.split('-')[0];
  const month = today.split('-')[1];

  if (lastUpdatedDate !== today) {
    lastUpdatedDate = today;
  }

  const endpoint = `${GET_PRAYER_SCHEDULE_URL}/${location}/${year}/${month}.json`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Failed to get prayer times: ${response.statusText}`);
    }

    const result: PrayerResponse[] = await response.json();

    const resultToday = result.find(({ tanggal }) => tanggal === today);
    delete resultToday?.tanggal;

    // @ts-ignore
    prayerTimes = resultToday;

    logger.info(`Get prayer time today (${today}) is success`);
  } catch (error) {
    console.error('Error:', error);
  }
};

const getPrayerTimeToday = async () => {
  const today = format(new Date(), 'yyyy-MM-dd', { timeZone: config.timeZone });

  if (!prayerTimes || lastUpdatedDate !== today) {
    await fetchPrayerTimeToday();
  }

  return prayerTimes;
};

export default getPrayerTimeToday;
