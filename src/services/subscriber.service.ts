import prisma from '../client';

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
    where: { notification: true },
  });
};

const setNotification = async (id: string, state: boolean) => {
  return prisma.subscriber.update({
    where: { id },
    data: { notification: state },
  });
};

const getSubscribersWithReminders = async (currentMinuteDifference: number) => {
  return prisma.subscriber.findMany({
    where: { reminder: currentMinuteDifference },
  });
};

const setReminder = async (id: string, minutes: number) => {
  return prisma.subscriber.update({
    where: { id },
    data: { reminder: minutes },
  });
};

const deleteSubscriber = async (id: string) => {
  return prisma.subscriber.delete({
    where: { id }
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
};
