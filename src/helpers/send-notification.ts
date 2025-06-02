import logger from '../config/logger';
import { sendMessage } from '../services';
import { getSubscribersWithNotifications } from '../services/subscriber.service';

const sendNotification = async (message: string) => {
  const subscribersWithNotifications = await getSubscribersWithNotifications();

  if (subscribersWithNotifications.length > 0) {
    logger.info('====================================');
    logger.info(`Sending notifications to ${subscribersWithNotifications.length} subscribers`);
    logger.info('====================================');
  }

  subscribersWithNotifications.forEach((subscriber) =>
    sendMessage({
      senderId: subscriber.id,
      content: message,
      type: 'personal',
    })
  );
};

export default sendNotification;
