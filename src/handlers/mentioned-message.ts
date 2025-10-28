import { Event } from '../types';
import { handleCommand } from './command-handler';

export const mentionedMessage = async (event: Event) => {
  const { group_id, message } = event;
  const messageContent = message.text.plain_text.replace(/@MarBot\s*/, '').trim();
  const employee_code = message.sender.employee_code;

  return await handleCommand({
    employee_code,
    messageContent,
    targetId: group_id,
    messageType: 'group',
  });
};
