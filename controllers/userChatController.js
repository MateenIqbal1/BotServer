import UserChat from '../models/userChat.js';

export const getUserChats = async (req, res) => {
    const userId = req.auth.userId;

    try {
        const userChats = await UserChat.find({ userId });

        const chats = userChats.length > 0 ? userChats[0].chats : [];  
        
        res.status(200).json(chats); 
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching chats");
    }
};
