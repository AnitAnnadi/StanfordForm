import express from 'express';
const router = express.Router();

import rateLimiter from 'express-rate-limit';
const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

import {
  register,
  login,
  updateUser,
  getCurrentUser,
  logout,
  enterCode,
  submitForm,
} from '../controllers/authController.js';

import authenticateUser from '../middleware/auth.js';
import testUser from '../middleware/testUser.js';
router.route('/register').post(apiLimiter, register);
router.route('/login').post( login);
router.get('/logout', logout);
router.route('/enterCode').post( enterCode);
router.route('/submitForm').post(submitForm)

router.route('/updateUser').patch(authenticateUser, testUser, updateUser);
router.route('/getCurrentUser').get(authenticateUser, getCurrentUser);
// router.route('/createLocation').post(authenticateUser, createLocation)
export default router;
