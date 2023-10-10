import prisma from '../client';
import logger from '../config/logger';

const getUserById = async (id: string) => {
  return prisma.subscriber.findUnique({ where: { id } });
};

const addNewSubscriber = async (id: string, name: string) => {
  if (await getUserById(id)) {
    logger.error(`ID ${id} already registered`);
    return;
  }

  return prisma.subscriber.create({ data: { id, name } });
};

export { getUserById, addNewSubscriber };
