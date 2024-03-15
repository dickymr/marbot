import axios from "axios";
import httpStatus from 'http-status';
import config from '../config';
import { GET_ACCESS_TOKEN_URL } from '../constants';
import apiError from '../utils/apiError';

let appAccessToken = '';
let tokenExpireTimestamp = '';

const getAppAccessToken = async () => {
  try {
    const response = await axios.post(GET_ACCESS_TOKEN_URL, {
      app_id: config.appId,
      app_secret: config.appSecret,
    }, {
      headers: { 'Content-Type': 'application/json', },
    });

    if (response.status !== 200) throw new Error();
    
    const result = response.data;

    if (result.code !== 0) throw new Error();

    appAccessToken = result.app_access_token;
    tokenExpireTimestamp = result.expire;
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
