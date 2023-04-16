import express from 'express';
const router = express.Router();

import {
  getUserLocations,
  createLocation} from '../controllers/schoolController.js';

import authenticateUser from '../middleware/auth.js';

router.route('/').post(authenticateUser, createLocation).get(authenticateUser, getLocations);
router.route('/user').get(authenticateUser, getUserLocations);
export default router;
