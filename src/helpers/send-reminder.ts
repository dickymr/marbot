import logger from '../config/logger';
import { sendMessage } from '../services';
import { addNewLog } from '../services/log.service';
import { getSubscribersWithReminders, setInactive } from '../services/subscriber.service';

const sendReminder = async (message: string, currentMinuteDifference: number) => {
  const subscribersWithReminders = await getSubscribersWithReminders(currentMinuteDifference);

  if (subscribersWithReminders.length === 0) return;

  logger.info('====================================');
  logger.info(`Sending reminder to ${subscribersWithReminders.length} subscribers`);
  logger.info('====================================');

  await addNewLog(
    `server | reminder ${currentMinuteDifference}`,
    'success',
    subscribersWithReminders.length.toString()
  );

  subscribersWithReminders.forEach((subscriber) => {
    sendMessage({
      senderId: subscriber.id,
      content: message,
      type: 'personal',
    }).catch((err) => {
      setInactive(subscriber.id);
      addNewLog('server | set inactive', 'success', subscriber.name);
      console.error(`Failed to send to ${subscriber.id} ${subscriber.name}:`, err);
    });
  });
};

export default sendReminder;
