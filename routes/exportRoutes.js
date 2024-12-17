import express from 'express';
const router = express.Router();
import { getExport, getExportBulk } from '../controllers/exportController.js';
router.route('/:formCode').get(getExport);
router.route('/bulk').post(getExportBulk);


export default router;
