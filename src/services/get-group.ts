import axios from 'axios';
import logger from '../config/logger';
import { getAccessToken } from '.';
import { GET_GROUP } from '../constants';

const getGroup = async (id: string) => {
  const accessToken = await getAccessToken();

  try {
    const response = await axios.get(`${GET_GROUP}`, {
      params: {
        group_id: id,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) throw new Error(`Failed to get group: ${response.statusText}`);

    const result = response.data;

    return result.group || { group_name: '' };
  } catch (error) {
    logger.error(error);
  }
};

export default getGroup;
