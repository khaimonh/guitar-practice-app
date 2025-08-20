// User Controller with Supabase integration
const { db } = require('../config/database');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await db.getUsers();
    
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid user ID is required'
      });
    }
    
    const user = await db.getUserById(parseInt(id));
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { name, email, skill_level, practice_goals } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }
    
    // Check if user already exists
    try {
      const existingUser = await db.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User with this email already exists'
        });
      }
    } catch (error) {
      // User doesn't exist, continue
    }
    
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      skill_level: skill_level || 'beginner',
      practice_goals: practice_goals || []
    };
    
    const newUser = await db.createUser(userData);
    
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    console.error('Create user error:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, skill_level, practice_goals } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid user ID is required'
      });
    }
    
    // Build update object with only provided fields
    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase().trim();
    if (skill_level) updates.skill_level = skill_level;
    if (practice_goals !== undefined) updates.practice_goals = practice_goals;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }
    
    const updatedUser = await db.updateUser(parseInt(id), updates);
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid user ID is required'
      });
    }
    
    const deletedUser = await db.deleteUser(parseInt(id));
    
    res.json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};