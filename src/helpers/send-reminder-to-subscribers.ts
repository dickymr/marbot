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

  console.log('====================================');
  console.log(`Sending reminder to ${subscribers.length} subscribers`);
  console.log('====================================');

  subscribers.forEach((subscriber: string) =>
    sendMessage({
      senderId: subscriber,
      content: message,
      type: 'personal',
    })
  );
};

export default sendReminderToSubscribers;
