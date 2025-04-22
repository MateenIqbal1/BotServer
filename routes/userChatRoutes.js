import express from 'express';
import { requireAuth } from '@clerk/express';
import { getUserChats } from '../controllers/userChatController.js';
import { authMiddleware } from '../controllers/authController.js';

const router = express.Router();


router.get('/api/userchats', authMiddleware, getUserChats);

export default router;