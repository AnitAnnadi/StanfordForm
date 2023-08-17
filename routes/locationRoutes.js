import express from 'express';
const router = express.Router();

import {
  createLocation,
  getLocations,
} from '../controllers/locationController.js';

import authenticateUser from '../middleware/auth.js';

router.route('/').post(authenticateUser, createLocation).get(getLocations);

export default router;
