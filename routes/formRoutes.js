import express from 'express';
const router = express.Router();
import { createSchool, getSchools, getUserSchools } from "../controllers/schoolController.js";
import { getFormMetrics, getTotal } from "../controllers/formController.js";

router.route('/:formCode').get(getFormMetrics);
router.route('/responses').post(getTotal);


export default router;
