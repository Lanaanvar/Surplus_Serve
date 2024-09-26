import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connectDB from './config/db.js'; // Note the file extension .js
import mongoose from 'mongoose';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import userRoutes from './routes/userRoutes.js'; // Note the file extension .js

// Connect to the database
connectDB();

const app = express();

// Use JSON parsing middleware
app.use(express.json());

// Use Clerk middleware for authentication on protected routes
app.use('/api', ClerkExpressRequireAuth(), (req, res, next) => {
  console.log('Authenticated route');
  next();
});

// Use user routes
app.use('/api/user', userRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
