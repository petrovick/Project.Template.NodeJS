import { Router } from 'express';


import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import PrivateController from './app/controllers/PrivateController';

import authMiddleware from './app/middleware/auth';

import validateUserStore from './app/validators/UserStore';
import validateSessionStore from './app/validators/SessionStore';


const bruteStore = new BruteRedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);

const routes = new Router();

// Nao antenticado
routes.post('/users', validateUserStore, UserController.store);
routes.post(
  '/sessions',
  bruteForce.prevent,
  validateSessionStore,
  SessionController.store
);

routes.use(authMiddleware);

// Autenticado
routes.get('/private', PrivateController.index)
export default routes;
