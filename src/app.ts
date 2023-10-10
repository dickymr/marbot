import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import config from './config';
import morgan from './config/morgan';
import { checkPrayerTime, checkReminder } from './helpers';
import xss from './middlewares/xss';
import { errorConverter, errorHandler } from './middlewares/error';
import routes from './routes/v1';
import apiError from './utils/apiError';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new apiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to apiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

const runPrayerTimeChecks = () => {
  const interval = 60000; // 1 MINUTE
  setInterval(() => {
    checkPrayerTime();
    checkReminder();
  }, interval);
};

runPrayerTimeChecks();

export default app;
