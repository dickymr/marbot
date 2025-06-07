import prisma from '../client';

const addNewLog = async (source: string, status: 'success' | 'error', value: string) => {
  return prisma.log.create({
    data: { source, status, value },
  });
};

export { addNewLog };
