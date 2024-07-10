import express from 'express';
const router = express.Router();
import rateLimiter from 'express-rate-limit';

import {
  getAllUsers
} from '../controllers/userController.js';

import authenticateUser from '../middleware/auth.js';
import testUser from '../middleware/testUser.js';
router.route('/all').post(getAllUsers)

export default router;
