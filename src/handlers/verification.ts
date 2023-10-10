import httpStatus from 'http-status';
import logger from '../config/logger';
import { Event } from '../types';

export const verification = async (event: Event) => {
  const { seatalk_challenge } = event;

  logger.info('Verification success', seatalk_challenge);

  return {
    status: httpStatus.OK,
    response: { seatalk_challenge },
  };
};
