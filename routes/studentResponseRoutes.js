import express from 'express';
const router = express.Router();

import {
  getStudentResponses,
  getNoCodeStudentResponses,
  getHealthyFutures
} from '../controllers/studentResponseController.js';

import authenticateUser from '../middleware/auth.js';

router.route('/').get(authenticateUser, getStudentResponses);
router.route('/noCode').get(authenticateUser, getNoCodeStudentResponses);
router.route('/healthyFutures').get(authenticateUser, getHealthyFutures);

export default router;
