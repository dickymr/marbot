import logger from '../config/logger';
import { sendMessage } from '../services';
import { addNewLog } from '../services/log.service';
import { getSubscribersWithNotifications, setInactive } from '../services/subscriber.service';

const sendNotification = async (message: string) => {
  const subscribersWithNotifications = await getSubscribersWithNotifications();

  if (subscribersWithNotifications.length > 0) {
    logger.info('====================================');
    logger.info(`Sending notifications to ${subscribersWithNotifications.length} subscribers`);
    logger.info('====================================');
  }

  await addNewLog('server | notification', 'success', subscribersWithNotifications.length.toString());

  subscribersWithNotifications.forEach((subscriber) => {
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

export default sendNotification;
