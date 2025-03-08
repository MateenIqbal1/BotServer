import express from 'express';
import { requireAuth } from '@clerk/express';
import { createChat, getChatById, updateChat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/api/chats', requireAuth(), createChat);
router.put('/api/chats/:id', requireAuth(), updateChat);
router.get('/api/userchats/:id', requireAuth(), getChatById);

export default router;