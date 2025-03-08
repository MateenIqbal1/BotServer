import express from 'express';
import { requireAuth } from '@clerk/express';
import { getUserChats } from '../controllers/userChatController.js';

const router = express.Router();

router.get('/api/userchats',  getUserChats);

export default router;