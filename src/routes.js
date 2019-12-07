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

// Routes
/**
 * @swagger
 * /loginUser:
 *   post:
 *     tags:
 *       - Users
 *     name: Login
 *     summary: Logs in a user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - username
 *           - password
 *     responses:
 *       200:
 *         description: User found and logged in successfully
 *       401:
 *         description: Bad username, not found in db
 *       403:
 *         description: Username and password don't match
 */
routes.get('/customers', (req, res) => {
  res.status(200).send('Customer results');
});

routes.post('/users', validateUserStore, UserController.store);
routes.post(
  '/sessions',
  //  bruteForce.prevent,
  validateSessionStore,
  SessionController.store
);

routes.use(authMiddleware);

// Autenticado
routes.get('/private', PrivateController.index);
export default routes;
