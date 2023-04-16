import express from 'express';
const router = express.Router();

import {
  getStudentResponses
} from '../controllers/studentResponseController.js';

import authenticateUser from '../middleware/auth.js';

router.route('/').get(authenticateUser, getStudentResponses);
export default router;
