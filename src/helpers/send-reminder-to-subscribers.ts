import config from '../config';
import { getSubscribers, sendMessage } from '../services';

const sendReminderToSubscribers = async (message: string) => {
  const subscribers = await getSubscribers();

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
