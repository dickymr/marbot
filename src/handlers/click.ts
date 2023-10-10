import httpStatus from "http-status";
import logger from "../config/logger";
import { Event } from "../types";

export const click = async (event: Event) => {
  const { employee_code, message_id, value } = event;

  logger.info(
    `New interactive message from ${employee_code} ${message_id} ${value}`
  );

  return {
    status: httpStatus.OK,
    response: {},
  };
};
