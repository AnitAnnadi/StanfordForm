import express from 'express';
const router = express.Router();
import { getExport } from '../controllers/exportController.js';
router.route('/:formCode/:selectedYear').get(getExport);

export default router;
