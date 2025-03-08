import express from 'express';
import { requireAuth } from '@clerk/express';
import { createChat, getChatById, updateChat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/api/chats', createChat);
router.put('/api/chats/:id', updateChat);
router.get('/api/userchats/:id',  getChatById);

export default router;