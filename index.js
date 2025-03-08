import express from 'express'
import ImageKit from 'imagekit';
import 'dotenv/config';
import cors from 'cors'
import mongoose from 'mongoose';
import UserChat from './models/userChat.js';
import Chat from './models/chat.js';
import {  requireAuth } from '@clerk/express'
import path from 'path';
import url, { fileURLToPath } from 'url'




const PORT = process.env.PORT || 3000 ;
const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
    origin: "http://localhost:5173", // Ensure this matches your frontend's URL exactly
    credentials: true}))

app.use(express.json())


const connect = async ()=>{
    try {
         await mongoose.connect(process.env.MONGODB_URL)
         console.log("connected to mongodb ")
    } catch (error) {
        console.log(error)
    }
}


const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  });

app.get('/api/upload',(req,res)=>{
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
})

app.post('/api/chats', requireAuth(), async (req, res) => {
    const { text } = req.body;
    const userId = req.auth.userId;

    try {
        // Store user message (without AI processing)
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }]
        });

        const savedChat = await newChat.save();

        // Update UserChat collection
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

        res.status(201).send(newChat._id);
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).send("Error creating chat");
    }
});


  


app.get("/api/userchats",requireAuth(),async(req,res)=>{
    const userId = req.auth.userId;
    try {
        const userChats =await UserChat.find({userId})

         res.status(200).send(userChats[0].chats)
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Error fetching chat")
    }
})


app.get("/api/userchats/:id", requireAuth(), async (req, res) => {
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
});

app.put('/api/chats/:id',requireAuth(),async(req,res)=>{
    const userId = req.auth.userId;
    
    const {question ,answer ,img}=req.body;

    const newItems = [
        ...(question ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }] : []),
        { role: "model", parts: [{ text: answer }] }
    ];
    

    try {
        const updatedChat = await Chat.updateOne({_id:req.params.id,userId},{
            $push:{history:{
                $each:newItems,

            }}
        })
        res.status(200).send(updatedChat)
    } catch (error) {
        console.error( error);
        res.status(500).send("Error adding conversation:");
    }

})


app.use((err, req, res, next)=>{
    console.error(err.stack)
    res.status(401).send("Unauthenticated")
})


app.use(express.static(path.join(__dirname,'../client')))

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,"../client",'index.html'))
})




app.listen(PORT,()=>{
    connect()
    console.log("server is running on 3000")
})