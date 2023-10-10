import httpStatus from "http-status";
import logger from "../config/logger";
import { Event } from "../types";

export const removedFromGroupChat = async (event: Event) => {
  const { group_id, remover } = event;

  logger.info(
    `Removed from group chat ${group_id} by ${remover.employee_code}`
  );

  return {
    status: httpStatus.OK,
    response: {},
  };
};
