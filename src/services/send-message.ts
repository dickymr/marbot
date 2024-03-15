import axios from "axios";
import httpStatus from 'http-status';
import { getAccessToken } from './';
import {
  SEND_MESSAGE_GROUP_URL,
  SEND_MESSAGE_PERSONAL_URL,
} from '../constants';
import logger from '../config/logger';
import apiError from '../utils/apiError';

interface SendMessage {
  senderId: string;
  content: string;
  type: 'personal' | 'group';
}

interface MessageMarkdown {
  tag: 'markdown';
  markdown: { content: string };
}
interface MessageText {
  tag: 'text';
  text: { content: string };
}
interface PersonalPayload {
  employee_code: string;
  message: MessageMarkdown;
}
interface GroupPayload {
  group_id: string;
  message: MessageText;
}

type Payload = PersonalPayload | GroupPayload;

const sendMessage = async ({
  senderId,
  content,
  type = 'personal',
}: SendMessage) => {
  const accessToken = await getAccessToken();

  let URL = '';
  let payload: Payload;

  const payloadPersonal: PersonalPayload = {
    employee_code: senderId,
    message: { tag: 'markdown', markdown: { content } },
  };

  const payloadGroup: GroupPayload = {
    group_id: senderId,
    message: { tag: 'text', text: { content } },
  };

  switch (type) {
    case 'personal':
      URL = SEND_MESSAGE_PERSONAL_URL;
      payload = payloadPersonal;
      break;
    case 'group':
      URL = SEND_MESSAGE_GROUP_URL;
      payload = payloadGroup;
      break;
    default:
      throw new Error(`Invalid message type: ${type}`);
  }

  try {
    const response = await axios.post(URL, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) throw new Error();

    const data = response.data;
    
    if (data.code !== 0) throw new Error(data.message);

    logger.info(`Message sent successfully: ${senderId}`);
  } catch (error) {
    throw new apiError(
      httpStatus.BAD_REQUEST,
      `Failed to send message, ${error}`
    );
  }
};

export default sendMessage;
