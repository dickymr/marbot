import logger from '../config/logger';
import { sendMessage } from '../services';
import { getSubscribersWithReminders } from '../services/subscriber.service';

const sendReminder = async (message: string, currentMinuteDifference: number) => {
  const subscribersWithReminders = await getSubscribersWithReminders(currentMinuteDifference);

  if (subscribersWithReminders.length > 0) {
    logger.info('====================================');
    logger.info(`Sending reminder to ${subscribersWithReminders.length} subscribers`);
    logger.info('====================================');
  }

  subscribersWithReminders.forEach((subscriber) =>
    sendMessage({
      senderId: subscriber.id,
      content: message,
      type: 'personal',
    })
  );
};

export default sendReminder;
