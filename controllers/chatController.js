import mongoose from 'mongoose';
import Chat from '../models/chat.js';
import UserChat from '../models/userChat.js';

export const createChat = async (req, res) => {
    const { text } = req.body;
    const userId = req.auth.userId;

    try {
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }]
        });

        const savedChat = await newChat.save();

        const userChats = await UserChat.findOne({ userId });

        if (!userChats) {
            const newUserChats = new UserChat({
                userId: userId,
                chats: [{ _id: savedChat.id, title: text.substring(0, 40) }]
            });
            await newUserChats.save();
        } else {
            await UserChat.updateOne(
                { userId: userId },
                { $push: { chats: { _id: savedChat._id, title: text.substring(0, 40) } } }
            );
        }

        res.status(201).send(savedChat._id);
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).send("Error creating chat");
    }
};

export const updateChat = async (req, res) => {
    const userId = req.auth.userId;
    const { question, answer, img } = req.body;

    const newItems = [
        ...(question ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }] : []),
        { role: "model", parts: [{ text: answer }] }
    ];

    try {
        const updatedChat = await Chat.updateOne(
            { _id: req.params.id, userId },
            { $push: { history: { $each: newItems } } }
        );
        res.status(200).send(updatedChat);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating chat");
    }
};

export const getChatById = async (req, res) => {
    const userId = req.auth.userId;
    const chatId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).send("Invalid chat ID");
    }

    try {
        const chat = await Chat.findOne({ _id: chatId, userId });

        if (!chat) {
            return res.status(404).send("Chat not found");
        }

        res.status(200).send(chat);
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).send("Internal server error");
    }
};