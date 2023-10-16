import express from 'express';
const router = express.Router();

import {
  createLocation,
  getLocations,
  approveLocation,
  declineLocation
} from '../controllers/locationController.js';

import authenticateUser from '../middleware/auth.js';

router.route('/').post(authenticateUser, createLocation).get(getLocations);
router.route('/approve').post(approveLocation)
router.route('/decline').post(declineLocation)
export default router;
