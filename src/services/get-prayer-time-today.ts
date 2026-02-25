import axios from 'axios';
import { format } from 'date-fns-tz';
import { CookieJar } from 'tough-cookie';
import config from '../config';
import logger from '../config/logger';
import { Prayer, PrayerResponse } from '../types';

let prayerTimes: Prayer | null | undefined = null;
let lastUpdatedDate: string | null = null;

// let prayerTimes = {
//   imsyak: '19:20',
//   shubuh: '19:21',
//   terbit: '19:22',
//   dhuha: '19:23',
//   dzuhur: '19:24',
//   ashr: '19:25',
//   magrib: '19:26',
//   isya: '19:27',
// };
// let lastUpdatedDate = '2023-10-10';

const fetchPrayerTimeTodayJadwalSholat = async () => {
  const { jadwalsholatApiUrl, location } = config;

  const today = format(new Date(), 'yyyy-MM-dd', { timeZone: config.timeZone });
  const year = today.split('-')[0];
  const month = today.split('-')[1];

  if (lastUpdatedDate !== today) {
    lastUpdatedDate = today;
  }

  const endpoint = `${jadwalsholatApiUrl}/${location}/${year}/${month}.json`;

  try {
    const response = await axios.get(endpoint);

    if (response.status !== 200) throw new Error(`Failed to get prayer times: ${response.statusText}`);

    const result: PrayerResponse[] = response.data;

    const resultToday = result.find(({ tanggal }) => tanggal === today);
    delete resultToday?.tanggal;

    prayerTimes = resultToday;

    logger.info(`Get prayer time today (${today}) is success`);
  } catch (error) {
    console.error('Error:', error);
  }
};

const fetchPrayerTimeTodayKemenag = async () => {
  const { kemenagBaseUrl, kemenagPrayerApiUrl, kemenagLocationX, kemenagLocationY } = config;

  const today = format(new Date(), 'yyyy-MM-dd', { timeZone: config.timeZone });
  const year = today.split('-')[0];
  const month = today.split('-')[1];

  if (lastUpdatedDate !== today) {
    lastUpdatedDate = today;
  }

  const headers = {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'x-requested-with': 'XMLHttpRequest',
    Referer: `${kemenagBaseUrl}/`,
  };

  const body = new URLSearchParams({
    x: kemenagLocationX,
    y: kemenagLocationY,
    bln: String(parseInt(month, 10)),
    thn: year,
  }).toString();

  try {
    const { wrapper } = await import('axios-cookiejar-support');
    const client = wrapper(axios.create({ jar: new CookieJar(), timeout: 15000 }));
    await client.get(`${kemenagBaseUrl}/`, { headers });

    const response = await client.post(kemenagPrayerApiUrl, body, { headers });

    if (response.status !== 200) throw new Error(`Failed to get prayer times: ${response.statusText}`);

    const result = response.data?.data;

    const resultToday = result[today];

    prayerTimes = {
      imsyak: resultToday.imsak,
      shubuh: resultToday.subuh,
      terbit: resultToday.terbit,
      dhuha: resultToday.dhuha,
      dzuhur: resultToday.dzuhur,
      ashr: resultToday.ashar,
      magrib: resultToday.maghrib,
      isya: resultToday.isya,
    };
  } catch (error) {
    console.error('Error:', error);
  }
};

const getPrayerTimeToday = async (source: 'kemenag' | 'jadwalsholat' = 'kemenag') => {
  const today = format(new Date(), 'yyyy-MM-dd', { timeZone: config.timeZone });

  if (!prayerTimes || lastUpdatedDate !== today) {
    if (source === 'kemenag') {
      await fetchPrayerTimeTodayKemenag();
    } else {
      await fetchPrayerTimeTodayJadwalSholat();
    }
  }

  return prayerTimes;
};

export default getPrayerTimeToday;
