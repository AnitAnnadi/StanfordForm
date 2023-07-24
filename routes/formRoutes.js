import express from 'express';
const router = express.Router();
import { createLocation, getLocations, getUserLocations } from "../controllers/schoolController.js";
import { getFormMetrics, getTotal } from "../controllers/formController.js";

router.route('/:formCode').get(getFormMetrics);
router.route('/responses').post(getTotal);


export default router;
