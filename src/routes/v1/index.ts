import express from 'express';
import seatalkRoute from './seatalk.route';

const router = express.Router();

const defaultRoutes = [{ path: '/seatalk', route: seatalkRoute }];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
