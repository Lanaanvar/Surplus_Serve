import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import authRoutes from './routes/authRoutes.js';
import router from './routes/authRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import recipientRoutes from './routes/recipientRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log('Connected to MongoDB : ', process.env.CONNECTION_STRING);
}).catch((error) => {
    console.error('MongoDB connection error: ', error);
    process.exit(1);
});

app.use('/api/auth', router);
app.use('/api/donor', donorRoutes);
app.use('/api/recipient', recipientRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});