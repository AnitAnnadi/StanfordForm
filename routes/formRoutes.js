import express from 'express';
const router = express.Router();
import {createLocation, getLocations, getUserLocations} from "../controllers/schoolController.js";
import {getFormMetrics} from "../controllers/formController.js";

router.route('/:formCode').get(getFormMetrics);

export default router;
