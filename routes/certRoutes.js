import express from 'express';
const router = express.Router();



import {
  createCertificate
} from '../controllers/certificateController.js';

router.route('/createCertificate').post(createCertificate);
// router.route('/createLocation').post(authenticateUser, createLocation)
export default router;
