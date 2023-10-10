import config from '../config';
import { getSubscribers, sendMessage } from '../services';
import { getSubscribersWithNotifications } from '../services/subscriber.service';

const sendReminderToSubscribers = async (message: string) => {
  const botSubscribers = await getSubscribers();
  const subscribersWithNotifications = await getSubscribersWithNotifications();

  const subscribers = botSubscribers.filter((id: string) =>
    subscribersWithNotifications.find((sub) => sub.id === id)
  );

  if (config.env === 'production') {
    subscribers.forEach((subscriber: string) =>
      sendMessage({
        senderId: subscriber,
        content: message,
        type: 'personal',
      })
    );

    return;
  }

  sendMessage({
    senderId: config.myEmployeeId,
    content: message,
    type: 'personal',
  });
};

export default sendReminderToSubscribers;
