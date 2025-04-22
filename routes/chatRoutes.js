import express from 'express';
import { createChat, getChatById, updateChat } from '../controllers/chatController.js';
import { authMiddleware } from '../controllers/authController.js';

const router = express.Router();

router.post('/api/chats', authMiddleware, createChat);
router.put('/api/chats/:id', authMiddleware, updateChat);
router.get('/api/userchats/:id', authMiddleware, getChatById);

export default router;