import logger from "../config/logger";
import { getAccessToken } from "./";
import { GET_PROFILE } from "../constants";

const getProfile = async (id: string) => {
  const accessToken = await getAccessToken();

  try {
    const response = await fetch(`${GET_PROFILE}?employee_code=${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      throw new Error(`Failed to get profile: ${response.statusText}`);

    const result = await response.json();

    return result.employees[0] || { name: "" };
  } catch (error) {
    logger.error(error);
  }
};

export default getProfile;
