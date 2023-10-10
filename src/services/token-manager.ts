import httpStatus from 'http-status';
import config from '../config';
import { GET_ACCESS_TOKEN_URL } from '../constants';
import apiError from '../utils/apiError';

let appAccessToken = '';
let tokenExpireTimestamp = '';

const getAppAccessToken = async () => {
  try {
    const response = await fetch(GET_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: config.appId,
        app_secret: config.appSecret,
      }),
    });

    if (!response.ok) throw new Error();

    const data = await response.json();
    if (data.code !== 0) throw new Error();

    appAccessToken = data.app_access_token;
    tokenExpireTimestamp = data.expire;
  } catch (error) {
    throw new apiError(
      httpStatus.BAD_REQUEST,
      'Failed to get app access token'
    );
  }
};

const isTokenExpired = () => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return currentTimestamp >= Number(tokenExpireTimestamp);
};

const getAccessToken = async () => {
  if (!appAccessToken || isTokenExpired()) await getAppAccessToken();
  return appAccessToken;
};

export default getAccessToken;
