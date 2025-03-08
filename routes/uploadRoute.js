import express from 'express';
import { getUploadAuth } from '../controllers/uploadController.js';

const router = express.Router();

router.get('/api/upload', getUploadAuth);

export default router;