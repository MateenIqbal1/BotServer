import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mongoose from 'mongoose';
import uploadRoutes from './routes/uploadRoute.js';
import chatRoutes from './routes/chatRoutes.js';
import userChatRoutes from './routes/userChatRoutes.js';
import authRoutes from './routes/authRoutes.js'
import 'dotenv/config'; 


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: [ "http://localhost:5173", "https://chat-bot-frontend-zeta.vercel.app" ],
    credentials: true
}));


app.use(uploadRoutes);
app.use(chatRoutes);
app.use(userChatRoutes);
app.use('/api/auth',authRoutes)
app.use('/',(req,res)=>{
    return res.status(200).send("welome to home /");
})


const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
};



app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
});
