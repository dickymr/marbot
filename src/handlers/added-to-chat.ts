import httpStatus from "http-status";
import logger from "../config/logger";
import { Event } from "../types";

export const addedToGroupChat = async (event: Event) => {
  const { group, inviter } = event;

  logger.info(
    `Added to group chat ${group.group_name} invited by ${inviter.employee_code}`
  );

  return {
    status: httpStatus.OK,
    response: {},
  };
};
