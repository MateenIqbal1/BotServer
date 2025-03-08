import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';
import { requireAuth } from '@clerk/express';
import path from 'path';
import url, { fileURLToPath } from 'url';
import uploadRoutes from './routes/uploadRoute.js';
import chatRoutes from './routes/chatRoutes.js';
import userChatRoutes from './routes/userChatRoutes.js';

const PORT = process.env.PORT;
const app = express();



app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
};

// Routes
app.use(uploadRoutes);
app.use(chatRoutes);
app.use(userChatRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(401).send("Unauthenticated");
});




app.listen(PORT, () => {
    connect();
    console.log("Server is running on port 3000");
});