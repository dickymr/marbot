import httpStatus from 'http-status';
import config from '../config';
import logger from '../config/logger';
import { getPrayerTimeToday, getProfile, sendMessage } from '../services';
import { setNotification } from '../services/subscriber.service';
import {
  getFormattedDate,
  getNextPrayerString,
  getPrayerTimesString,
} from '../utils';
import { Event } from '../types';

export const message = async (event: Event) => {
  const { employee_code, message } = event;

  const profile = await getProfile(employee_code);

  // /today
  if (message.text.content === '/today') {
    const formattedDate = getFormattedDate();
    const prayerTimes = await getPrayerTimeToday();

    if (!prayerTimes) return null;

    const prayerTimesString = getPrayerTimesString(prayerTimes);
    const nextPrayerString = getNextPrayerString(prayerTimes);

    const message = [
      `__🕌 PRAYER TIMES TODAY__`,
      `🗓️ ${formattedDate}`,
      `🌍 Jakarta, GMT+07:00 (WIB)`,
      '‍',
      `${prayerTimesString}`,
      '‍',
      nextPrayerString
        ? `__Next prayer time:__\n\n- __${nextPrayerString}__\n\n‍\n\n`
        : '',
    ];

    const response = message.join('\n\n');

    await sendMessage({
      senderId: employee_code,
      content: response,
      type: 'personal',
    });

    return { status: httpStatus.OK, response: {} };
  }

  // /reminder
  if (message.text.content.includes('/reminder')) {
    const response = 'Feature still in development.';

    await sendMessage({
      senderId: employee_code,
      content: response,
      type: 'personal',
    });

    return { status: httpStatus.OK, response: {} };
  }

  // /start
  if (message.text.content === '/start') {
    await setNotification(employee_code, true);

    const response = '🌟 Prayer time __notifications__ activated.';
    await sendMessage({
      senderId: employee_code,
      content: response,
      type: 'personal',
    });

    return { status: httpStatus.OK, response: {} };
  }

  // /stop
  if (message.text.content === '/stop') {
    await setNotification(employee_code, false);

    const response =
      '🚫 Prayer time __notifications__ and __reminders__ deactivated.';
    await sendMessage({
      senderId: employee_code,
      content: response,
      type: 'personal',
    });

    return { status: httpStatus.OK, response: {} };
  }

  // /feedback
  if (message.text.content.includes('/feedback')) {
    const response = `Thank you for your feedback!\n\nHave a great day 🌟`;
    const responseToFeedbackGroup = `${message.text.content}\n\n‍\n\nFrom: ${employee_code} | ${profile.name}`;

    await sendMessage({
      senderId: employee_code,
      content: response,
      type: 'personal',
    });

    await sendMessage({
      senderId: config.groupFeedbackId,
      content: responseToFeedbackGroup,
      type: 'group',
    });

    return { status: httpStatus.OK, response: {} };
  }

  // /help
  if (message.text.content === '/help') {
    const message = [
      `__Commands__:`,
      `- __/today__: View today's prayer times.`,
      `- __/reminder [1-10 minutes]__: Set a reminder before prayer time.`,
      `- __/start__: Activate prayer time notifications.`,
      `- __/stop__: Deactivate prayer time notifications and reminders.`,
      `- __/feedback message__: Send feedback or report any issues.`,
      `- __/help__: List of commands.`,
    ];
    const response = message.join('\n\n');

    await sendMessage({
      senderId: employee_code,
      content: response,
      type: 'personal',
    });

    return { status: httpStatus.OK, response: {} };
  }

  await sendMessage({
    senderId: employee_code,
    content: 'Invalid command.',
    type: 'personal',
  });

  logger.info(
    `New message from ${employee_code} ${profile.name} ${message.text.content}`
  );

  return { status: httpStatus.NOT_FOUND, response: {} };
};
