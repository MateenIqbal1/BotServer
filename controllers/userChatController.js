import UserChat from '../models/userChat.js';

export const getUserChats = async (req, res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChat.find({ userId });
        res.status(200).send(userChats[0].chats);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching chats");
    }
};