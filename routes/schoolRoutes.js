import express from 'express';
const router = express.Router();

import {
  getLocations,
  createLocation} from '../controllers/schoolController.js';

import authenticateUser from '../middleware/auth.js';

router.route('/').post(authenticateUser, createLocation).get(authenticateUser, getLocations);
export default router;
