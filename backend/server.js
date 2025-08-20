const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Guitar Practice API',
    version: '1.0.0',
    status: 'running',
    database: 'Supabase'
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await connectDB();
    res.json({
      status: 'healthy',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Import routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🎸 Guitar Practice API server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: Supabase`);
      console.log(`CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();