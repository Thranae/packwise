import express from 'express';
import { getDestinationImage, getMoodboardImages } from '../controllers/image.controller.js';

const router = express.Router();

// Get an image for a specific destination/query
router.get('/search', getDestinationImage);

// Get multiple portrait images for the outfit moodboard
router.get('/moodboard', getMoodboardImages);

export default router;
