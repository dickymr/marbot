import axios from "axios";
import logger from "../config/logger";
import { getAccessToken } from "./";
import { GET_PROFILE } from "../constants";

const getProfile = async (id: string) => {
  const accessToken = await getAccessToken();

  try {
    const response = await axios.get(`${GET_PROFILE}`, {
      params: {
        employee_code: id,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
      
    if (response.status !== 200) throw new Error(`Failed to get profile: ${response.statusText}`);

    const result = response.data;

    return result.employees[0] || { name: "" };
  } catch (error) {
    logger.error(error);
  }
};

export default getProfile;
