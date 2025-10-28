import { Event } from '../types';
import { handleCommand } from './command-handler';

export const message = async (event: Event) => {
  const { employee_code, message } = event;
  const messageContent = message.text.content;

  return await handleCommand({
    employee_code,
    messageContent,
    targetId: employee_code,
    messageType: 'personal',
  });
};
