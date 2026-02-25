import config from '../config';

const BASE_SEATALK_API = config.seatalkApiUrl;

const GET_PROFILE = `${BASE_SEATALK_API}/contacts/v2/profile`;
const GET_GROUP = `${BASE_SEATALK_API}/messaging/v2/group_chat/info`;
const GET_ACCESS_TOKEN_URL = `${BASE_SEATALK_API}/auth/app_access_token`;
const SEND_MESSAGE_PERSONAL_URL = `${BASE_SEATALK_API}/messaging/v2/single_chat`;
const SEND_MESSAGE_GROUP_URL = `${BASE_SEATALK_API}/messaging/v2/group_chat`;

export { GET_PROFILE, GET_GROUP, GET_ACCESS_TOKEN_URL, SEND_MESSAGE_PERSONAL_URL, SEND_MESSAGE_GROUP_URL };
