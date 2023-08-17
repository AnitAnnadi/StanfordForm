import express from 'express';
const router = express.Router();

import {
  getStudentResponses,
  getNoCodeStudentResponses
} from '../controllers/studentResponseController.js';

import authenticateUser from '../middleware/auth.js';

router.route('/').get(authenticateUser, getStudentResponses);
router.route('/noCode').get(authenticateUser, getNoCodeStudentResponses);
export default router;
