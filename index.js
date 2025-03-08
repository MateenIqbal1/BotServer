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
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());

// Serve static files from the React app

// API routes
app.use(uploadRoutes);
app.use(chatRoutes);
app.use(userChatRoutes);

// Handle React routing, return all requests to React app


// Connect to MongoDB
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