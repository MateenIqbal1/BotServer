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



app.use(uploadRoutes);
app.use(chatRoutes);
app.use(userChatRoutes);
app.use('/api/auth',authRoutes)
app.use('/',(req,res)=>{
    return res.status(200).send("welome to home /");
})


mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Mongodb connected'))
    .catch(error => console.log(error));
    app.use(cors({
        origin: ['https://chat-bot-frontend-zeta.vercel.app','http://localhost:5173'] ,
        credentials: true,
    }));




app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
});
