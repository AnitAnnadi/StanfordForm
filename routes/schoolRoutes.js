import express from 'express';
const router = express.Router();

import {
  getUserLocations,
  createLocation,
  getLocations,
} from '../controllers/schoolController.js';

import authenticateUser from '../middleware/auth.js';

router.route('/').get(authenticateUser, getLocations);
router.route('/user').post(authenticateUser, createLocation).get(authenticateUser, getUserLocations);
export default router;
