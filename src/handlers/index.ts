import { verification } from './verification';
import { message } from './message';
import { click } from './click';
import { addedToGroupChat } from './added-to-chat';
import { removedFromGroupChat } from './removed-from-chat';
import { mentionedMessage } from './mentioned-message';
import { broadcast } from './broadcast';

export const handlers = {
  event_verification: verification,
  message_from_bot_subscriber: message,
  interactive_message_click: click,
  bot_added_to_group_chat: addedToGroupChat,
  bot_removed_from_group_chat: removedFromGroupChat,
  new_mentioned_message_received_from_group_chat: mentionedMessage,
  broadcast_message: broadcast,
};
