const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/apiRoutes.js');
const serverless = require('serverless-http');

dotenv.config();

const app = express();

// Update CORS settings to allow requests from your frontend URL
app.use(
  cors({
    origin: 'https://surplus-serve-client.vercel.app/', // Replace with your frontend's deployed URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Add any methods you need
    credentials: true, // Allow cookies if needed
  })
);

app.use(express.json());

app.use('/api', apiRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Default route to verify backend is running
app.get('/', (req, res) => {
    res.send('Backend is running!');
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Export the app and wrap it for serverless deployment
module.exports = app;
module.exports.handler = serverless(app); // Important for Vercel