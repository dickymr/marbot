import logger from "../config/logger";
import { getAccessToken } from "./";
import { GET_SUBSCRIBERS } from "../constants";

const getSubscribers = async () => {
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(GET_SUBSCRIBERS, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      throw new Error(`Failed to get subscribers: ${response.statusText}`);

    const data = await response.json();
    if (data.code !== 0) throw new Error(data.message);

    logger.info("Get subscribers success");

    return data.subscribers.employee_code;
  } catch (error) {
    logger.error(error);
  }
};

export default getSubscribers;
