import { Event } from '../types';
import { sendMessage } from '../services';
import { getSubscribers } from '../services/subscriber.service';

export const broadcast = async (event: Event) => {
  const { message } = event;
  const { receiver = '27849' } = message;
  const messageContent = message.text.content;

  if (receiver === 'all') {
    const subscribers = await getSubscribers();

    subscribers.forEach(async (subscriber) => {
      await sendMessage({
        senderId: subscriber.id,
        content: messageContent,
        type: /^\d+$/.test(subscriber.id) ? 'personal' : 'group',
      });
    });

    return { status: 200, response: { message: `Broadcast sent to all (${subscribers.length} subscribers)` } };
  }

  await sendMessage({
    senderId: receiver,
    content: messageContent,
    type: /^\d+$/.test(receiver) ? 'personal' : 'group',
  });

  return { status: 200, response: { message: `Message sent to ${receiver}` } };
};
