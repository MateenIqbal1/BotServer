import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import mongoose from 'mongoose';
import uploadRoutes from './routes/uploadRoute.js';
import chatRoutes from './routes/chatRoutes.js';
import userChatRoutes from './routes/userChatRoutes.js';
import 'dotenv/config'; // Load environment variables from .env filedotenv.config();


const app = express();
const PORT = process.env.PORT ;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());


// API routes
app.use(uploadRoutes);
app.use(chatRoutes);
app.use(userChatRoutes);



// Connect to MongoDB
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
};
app.get("/", (req, res) => {
    // Debug: Send req.auth in the response
    res.json({
        message: "Hello from Vercel and server.js!",
        auth: req.auth, // Include the req.auth object
        userId: req.auth?.userId // Include the userId specifically
    });
});

app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
});