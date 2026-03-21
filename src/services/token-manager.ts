import axios from "axios";
import httpStatus from 'http-status';
import config from '../config';
import { GET_ACCESS_TOKEN_URL } from '../constants';
import apiError from '../utils/apiError';

let appAccessToken = '';
let tokenExpireTimestamp = '';
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const getAppAccessToken = async (): Promise<void> => {
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
    // Refresh token 5 minutes before expiry to avoid edge cases
    tokenExpireTimestamp = String(result.expire - 300);
  } catch (error) {
    throw new apiError(
      httpStatus.BAD_REQUEST,
      'Failed to get app access token'
    );
  }
};

const isTokenExpired = (): boolean => {
  if (!tokenExpireTimestamp) return true;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return currentTimestamp >= Number(tokenExpireTimestamp);
};

const getAccessToken = async (): Promise<string> => {
  // If token is valid, return it immediately
  if (appAccessToken && !isTokenExpired()) {
    return appAccessToken;
  }

  // If a refresh is already in progress, wait for it
  if (isRefreshing && refreshPromise) {
    await refreshPromise;
    return appAccessToken;
  }

  // Start a new refresh
  isRefreshing = true;
  refreshPromise = getAppAccessToken();

  try {
    await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }

  return appAccessToken;
};

export default getAccessToken;
