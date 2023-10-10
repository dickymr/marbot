import prisma from '../client';

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

export {
  getUserById,
  addNewSubscriber,
  getSubscribersWithNotifications,
  setNotification,
  getSubscribersWithReminders,
};
