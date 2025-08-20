const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../controllers/userController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'API routes working!' });
});

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Import practice session controller
const practiceController = require('../controllers/practiceController');

// Practice session routes
router.get('/practice-sessions', practiceController.getPracticeSessions);
router.get('/practice-sessions/:id', practiceController.getPracticeSessionById);
router.post('/practice-sessions', practiceController.createPracticeSession);
router.put('/practice-sessions/:id', practiceController.updatePracticeSession);
router.delete('/practice-sessions/:id', practiceController.deletePracticeSession);

// File upload routes (for audio recordings, sheet music, etc.)
router.post('/upload', (req, res) => {
  res.json({ message: 'File upload endpoint - implement with multer + Supabase storage' });
});

module.exports = router;