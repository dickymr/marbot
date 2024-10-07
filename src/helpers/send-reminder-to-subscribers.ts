import logger from '../config/logger';
import { getSubscribers, sendMessage } from '../services';
import { getSubscribersWithReminders } from '../services/subscriber.service';

const sendReminderToSubscribers = async (
  message: string,
  currentMinuteDifference: number
) => {
  const botSubscribers = await getSubscribers();
  const subscribersWithReminders = await getSubscribersWithReminders(
    currentMinuteDifference
  );

  const subscribers = botSubscribers.filter((id: string) =>
    subscribersWithReminders.find((sub) => sub.id === id)
  );

  if (subscribers.length > 0) {
    logger.info('====================================');
    logger.info(`Sending reminder to ${subscribers.length} subscribers`);
    logger.info('====================================');
  }

  subscribers.forEach((subscriber: string) =>
    sendMessage({
      senderId: subscriber,
      content: message,
      type: 'personal',
    })
  );
};

export default sendReminderToSubscribers;
