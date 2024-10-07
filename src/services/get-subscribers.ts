import axios from "axios";
import logger from "../config/logger";
import { getAccessToken } from "./";
import { GET_SUBSCRIBERS } from "../constants";

const getSubscribers = async () => {
  const accessToken = await getAccessToken();

  try {
    const response = await axios.get(GET_SUBSCRIBERS, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) throw new Error(`Failed to get subscribers: ${response.statusText}`);
    
    const result = response.data;

    if (result.code !== 0) throw new Error(result.message);

    return result.subscribers.employee_code;
  } catch (error) {
    logger.error(error);
  }
};

export default getSubscribers;
