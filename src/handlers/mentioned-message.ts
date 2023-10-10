import httpStatus from "http-status";
import logger from "../config/logger";
import { Event } from "../types";

export const mentionedMessage = async (event: Event) => {
  const { group_id, message } = event;

  logger.info(
    `Mentioned from group chat ${group_id} ${JSON.stringify(message.text)}`
  );

  return {
    status: httpStatus.OK,
    response: {},
  };
};
