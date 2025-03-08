import express from 'express';
import { requireAuth } from '@clerk/express';
import { getUserChats } from '../controllers/userChatController.js';

const router = express.Router();

router.get('/api/userchats', requireAuth(), getUserChats);

export default router;