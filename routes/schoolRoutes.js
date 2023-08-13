import express from 'express';
const router = express.Router();

import {
  getUserSchools,
  createSchool,
  getSchools,
} from '../controllers/schoolController.js';

import authenticateUser from '../middleware/auth.js';

router.route('/').get(authenticateUser, getSchools);
router.route('/user').post(authenticateUser, createSchool).get(authenticateUser, getUserSchools);
export default router;
