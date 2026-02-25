import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    APP_ID: Joi.string().required(),
    APP_SECRET: Joi.string().required(),
    MY_EMPLOYEE_ID: Joi.string().required(),
    GROUP_FEEDBACK_ID: Joi.string().required(),
    SEATALK_API_URL: Joi.string().required(),
    PRAYER_API_URL: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
    KEMENAG_LOCATION_X: Joi.string().optional(),
    KEMENAG_LOCATION_Y: Joi.string().optional(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  // General
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  timeZone: 'Asia/Bangkok', // GMT+7

  // Seatalk / App
  appId: envVars.APP_ID,
  appSecret: envVars.APP_SECRET,
  myEmployeeId: envVars.MY_EMPLOYEE_ID,
  groupFeedbackId: envVars.GROUP_FEEDBACK_ID,
  seatalkApiUrl: envVars.SEATALK_API_URL,

  // Database
  databaseUrl: envVars.DATABASE_URL,

  // Jadwalsholat API
  jadwalsholatApiUrl: envVars.JADWAL_SHOLAT_API_URL,
  location: 'jakartaselatan',

  // Kemenag API
  kemenagBaseUrl: envVars.KEMENAG_BASE_URL,
  kemenagPrayerApiUrl: envVars.KEMENAG_PRAYER_API_URL,
  kemenagLocationX: envVars.KEMENAG_LOCATION_X,
  kemenagLocationY: envVars.KEMENAG_LOCATION_Y,

  // Active Prayer Time
  activePrayerTime: {
    imsyak: false,
    shubuh: true,
    terbit: false,
    dhuha: false,
    dzuhur: true,
    ashr: true,
    magrib: true,
    isya: true,
  },
};
