import httpStatus from 'http-status';
import config from '../config';
import logger from '../config/logger';
import { getPrayerTimeToday, getProfile, getGroup, sendMessage } from '../services';
import { setNotification, setReminder } from '../services/subscriber.service';
import { getFormattedDate, getNextPrayerString, getPrayerTimesString } from '../utils';
import { addNewLog } from '../services/log.service';

interface CommandHandlerParams {
  employee_code: string;
  messageContent: string;
  targetId: string;
  messageType: 'personal' | 'group';
}

export const handleCommand = async ({
  employee_code,
  messageContent,
  targetId,
  messageType,
}: CommandHandlerParams) => {
  const group = messageType === 'group' ? await getGroup(targetId) : null;
  const profile = await getProfile(employee_code);

  logger.info('====================================');
  logger.info(
    `(${messageType}) Command from ${messageType === 'group' ? `${group.group_name} | ` : ''}${
      profile.name
    } : ${messageContent}`
  );
  logger.info('====================================');

  // /today
  if (messageContent === '/today') {
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
      nextPrayerString ? `__Next prayer time:__\n- __${nextPrayerString}__\n` : '',
      `Source: jadwalsholat.org`,
    ];

    const response = message.join('\n');

    await sendMessage({
      senderId: targetId,
      content: response,
      type: messageType,
    });

    await addNewLog(profile.name, 'success', messageContent);

    return { status: httpStatus.OK, response: {} };
  }

  // /reminder
  if (messageContent.includes('/reminder')) {
    const reminderParam = {
      code: messageType === 'group' ? targetId : employee_code,
      name: messageType === 'group' ? group.group_name : profile.name,
    };

    let response = '';

    const textMatch = messageContent.match(/\/reminder ([0-9]|10)\b/);

    if (textMatch) {
      const minutes = parseInt(textMatch[1]);

      await setReminder(reminderParam.code, reminderParam.name, minutes);

      // prettier-ignore
      response = minutes === 0
      ? '🔕 Reminder deactivated. You will no longer receive reminders.'
      : `🔔 Reminder set to __${minutes} minute${minutes !== 1 ? 's' : ''}__ before prayer time.`;
    } else {
      response = '⚠️ Reminder should be between 0 and 10 minutes.';
    }

    await sendMessage({
      senderId: targetId,
      content: response,
      type: messageType,
    });

    await addNewLog(reminderParam.name, 'success', messageContent);

    return { status: httpStatus.OK, response: {} };
  }

  // /start
  if (messageContent === '/start') {
    const notifParam = {
      code: messageType === 'group' ? targetId : employee_code,
      name: messageType === 'group' ? group.group_name : profile.name,
    };

    await setNotification(notifParam.code, notifParam.name, true);

    const response = '🔔 Prayer time __notifications__ activated.';
    await sendMessage({
      senderId: targetId,
      content: response,
      type: messageType,
    });

    await addNewLog(notifParam.name, 'success', messageContent);

    return { status: httpStatus.OK, response: {} };
  }

  // /stop
  if (messageContent === '/stop') {
    const notifParam = {
      code: messageType === 'group' ? targetId : employee_code,
      name: messageType === 'group' ? group.group_name : profile.name,
    };

    await setNotification(notifParam.code, notifParam.name, false);

    const response = '🔕 Prayer time __notifications__ deactivated.';
    await sendMessage({
      senderId: targetId,
      content: response,
      type: messageType,
    });

    await addNewLog(notifParam.name, 'success', messageContent);

    return { status: httpStatus.OK, response: {} };
  }

  // /feedback
  if (messageContent.includes('/feedback')) {
    const response = `Thank you for your feedback!\nHave a great day 🌟`;
    const responseToFeedbackGroup = `${messageContent}\n\nFrom: ${
      messageType === 'group' ? `${group.group_name} | ` : ''
    }${profile.name}`;

    await sendMessage({
      senderId: targetId,
      content: response,
      type: messageType,
    });

    await sendMessage({
      senderId: config.groupFeedbackId,
      content: responseToFeedbackGroup,
      type: 'group',
    });

    await addNewLog(profile.name, 'success', messageContent);

    return { status: httpStatus.OK, response: {} };
  }

  // /help
  if (messageContent === '/help') {
    const message = [
      `__Commands__:`,
      `- __/today__: View today's prayer times.`,
      `- __/reminder [0-10]__ minutes: Set a reminder before prayer time.`,
      `- __/start__: Activate prayer time notifications.`,
      `- __/stop__: Deactivate prayer time notifications and reminders.`,
      `- __/feedback [message]__: Send feedback or report any issues.`,
      `- __/help__: List of commands.`,
    ];
    const response = message.join('\n\n');

    await sendMessage({
      senderId: targetId,
      content: response,
      type: messageType,
    });

    await addNewLog(profile.name, 'success', messageContent);

    return { status: httpStatus.OK, response: {} };
  }

  const invalidMessage = [
    `__❌ Invalid command.__`,
    '‍',
    `__Commands__:`,
    `- __/today__: View today's prayer times.`,
    `- __/reminder [0-10]__ minutes: Set a reminder before prayer time.`,
    `- __/start__: Activate prayer time notifications.`,
    `- __/stop__: Deactivate prayer time notifications and reminders.`,
    `- __/feedback [message]__: Send feedback or report any issues.`,
    `- __/help__: List of commands.`,
  ];
  const response = invalidMessage.join('\n\n');

  await sendMessage({
    senderId: targetId,
    content: response,
    type: messageType,
  });

  await addNewLog(profile.name, 'error', messageContent);

  return { status: httpStatus.NOT_FOUND, response: {} };
};
