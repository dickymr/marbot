import httpStatus from 'http-status';
import logger from '../config/logger';
import { getProfile, sendMessage } from '../services';
import { Event } from '../types';

export const newSubscriber = async (event: Event) => {
  const { employee_code } = event;

  const messages = [
    `Assalamualaikum Wr. Wb.`,
    '‍',
    `Welcome to __MarBot__, your Prayer Times Reminder.`,
    '‍',
    `__Commands__:`,
    `- __/today__: View today's prayer times.`,
    `- __/reminder [1-10 minutes]__: Set a reminder before prayer time.`,
    `- __/start__: Activate prayer time notifications.`,
    `- __/stop__: Deactivate prayer time notifications and reminders.`,
    `- __/feedback message__: Send feedback or report any issues.`,
    `- __/help__: List of commands.`,
    '‍',
    `May Allah bless you 🤲`,
  ];

  const message = messages.join('\n\n');

  await sendMessage({
    senderId: employee_code,
    content: message,
    type: 'personal',
  });

  const profile = await getProfile(employee_code);

  logger.info(`New bot subscriber ${employee_code} ${profile.name}`);

  return {
    status: httpStatus.OK,
    response: { employee_code },
  };
};
