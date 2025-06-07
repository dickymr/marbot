import prisma from '../client';
import { addNewLog } from './log.service';

const getSubscribers = async () => {
  return prisma.subscriber.findMany();
};

const getUserById = async (id: string) => {
  return prisma.subscriber.findUnique({
    where: { id },
  });
};

const addNewSubscriber = async (id: string, name: string) => {
  if (await getUserById(id)) {
    return prisma.subscriber.update({
      where: { id },
      data: { name, notification: true, reminder: 0 },
    });
  }

  return prisma.subscriber.create({
    data: { id, name },
  });
};

const getSubscribersWithNotifications = async () => {
  return prisma.subscriber.findMany({
    where: { isActive: true, notification: true },
  });
};

const setNotification = async (id: string, name: string, state: boolean) => {
  const subscriber = await getUserById(id);

  if (!subscriber) await addNewSubscriber(id, name);
  await addNewLog('server | new subscriber', 'success', `${id} | ${name}`);

  return prisma.subscriber.update({
    where: { id },
    data: { notification: state },
  });
};

const getSubscribersWithReminders = async (currentMinuteDifference: number) => {
  return prisma.subscriber.findMany({
    where: { isActive: true, reminder: currentMinuteDifference },
  });
};

const setReminder = async (id: string, name: string, minutes: number) => {
  const subscriber = await getUserById(id);

  if (!subscriber) await addNewSubscriber(id, name);
  await addNewLog('server | new subscriber', 'success', `${id} | ${name}`);

  return prisma.subscriber.update({
    where: { id },
    data: { reminder: minutes },
  });
};

const deleteSubscriber = async (id: string) => {
  return prisma.subscriber.delete({
    where: { id },
  });
};

const setInactive = async (id: string) => {
  return prisma.subscriber.update({
    where: { id },
    data: { isActive: false },
  });
};

export {
  getSubscribers,
  getUserById,
  addNewSubscriber,
  getSubscribersWithNotifications,
  setNotification,
  getSubscribersWithReminders,
  setReminder,
  deleteSubscriber,
  setInactive,
};
