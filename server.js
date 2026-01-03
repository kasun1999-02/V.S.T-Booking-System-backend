const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const postRoutes = require('./routes/post');
const contactRoutes= require('./routes/contactRoute');
const userRoutes = require('./routes/userRoute');
// const userRoute = require('./routes/userRoute'); // Commented out userRoute for now
const mongoose = require('mongoose');// Import the database configuration

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());


// Define the route for posts
app.use( postRoutes);
app.use( contactRoutes);
app.use( userRoutes);

// Define the route for users (if needed)
// app.use('/api/user', userRoute);

const PORT = process.env.PORT || 5000; // Use process.env.PORT for dynamic port allocation


const DB_URL = 'mongodb+srv://rhmkmrajakaruna:Kasun199902@vehiclecluster.5lx9m.mongodb.net/?retryWrites=true&w=majority&appName=Vehiclecluster';

// MongoDB connection event listeners for detailed logging
mongoose.connection.on('connecting', () => {
  console.log('\n[DB CONNECTION] Attempting to connect to MongoDB...');
  console.log('[DB CONNECTION] Connection URL:', DB_URL.replace(/:[^:@]+@/, ':****@')); // Hide password
});

mongoose.connection.on('connected', () => {
  console.log('[DB CONNECTION] ✓ MongoDB connected successfully!');
  console.log('[DB CONNECTION] Ready to accept database operations');
  console.log('[DB CONNECTION] Connected at:', new Date().toISOString());
});

mongoose.connection.on('error', (err) => {
  console.error('[DB CONNECTION] ✗ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('[DB CONNECTION] ⚠ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('[DB CONNECTION] ✓ MongoDB reconnected');
});

// Connect to MongoDB
console.log('\n[DB CONNECTION] Initializing MongoDB connection...');
mongoose.connect(DB_URL)
  .then(() => {
    console.log('[DB CONNECTION] ✓ Initial connection successful');
  })
  .catch((err) => {
    console.error('[DB CONNECTION] ✗ Initial connection failed:', err.message);
  });

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`); 
});
