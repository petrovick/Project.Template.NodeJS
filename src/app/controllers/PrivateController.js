import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import Cache from '../../lib/cache';

class PrivateController {
  async index(req, res) {
    const cached = await Cache.get('users');
    if (cached) {
      return res.status(200).json({ data: cached });
    }
    const users = await User.findAll();
    await Cache.set('users', users);
    return res.status(200).json({ data: users });
  }
}
export default new PrivateController();
