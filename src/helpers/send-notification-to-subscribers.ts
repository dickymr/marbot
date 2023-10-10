import { getSubscribers, sendMessage } from '../services';
import { getSubscribersWithNotifications } from '../services/subscriber.service';

const sendNotificationToSubscribers = async (message: string) => {
  const botSubscribers = await getSubscribers();
  const subscribersWithNotifications = await getSubscribersWithNotifications();

  const subscribers = botSubscribers.filter((id: string) =>
    subscribersWithNotifications.find((sub) => sub.id === id)
  );

  subscribers.forEach((subscriber: string) =>
    sendMessage({
      senderId: subscriber,
      content: message,
      type: 'personal',
    })
  );
};

export default sendNotificationToSubscribers;
