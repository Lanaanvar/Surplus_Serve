import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/authRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import recipientRoutes from './routes/recipientRoutes.js';

dotenv.config();

const app = express();

// Update CORS settings to allow requests from your server IP
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allow requests from your server IP
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add any methods you need
    credentials: true, // Allow cookies if needed
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log('Connected to MongoDB : ', process.env.CONNECTION_STRING);
}).catch((error) => {
    console.error('MongoDB connection error: ', error);
    process.exit(1);
});

// Define routes
app.use('/api/auth', router);
app.use('/api/donor', donorRoutes);
app.use('/api/recipient', recipientRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// // Start the server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

export default app;
