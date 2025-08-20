// Practice Session Controller with Supabase integration
const { db } = require('../config/database');

// Get all practice sessions (optionally filtered by user)
const getPracticeSessions = async (req, res) => {
  try {
    const { user_id } = req.query;
    const sessions = await db.getPracticeSessions(user_id ? parseInt(user_id) : null);
    
    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Get practice sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch practice sessions'
    });
  }
};

// Get practice session by ID
const getPracticeSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid session ID is required'
      });
    }
    
    const { data, error } = await db.supabase
      .from('practice_sessions')
      .select('*')
      .eq('id', parseInt(id))
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Practice session not found'
        });
      }
      throw error;
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Get practice session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch practice session'
    });
  }
};

// Create new practice session
const createPracticeSession = async (req, res) => {
  try {
    const { 
      user_id, 
      title, 
      description, 
      duration_minutes, 
      exercises_practiced,
      notes,
      difficulty_level,
      goals_achieved
    } = req.body;
    
    // Validation
    if (!user_id || !title || !duration_minutes) {
      return res.status(400).json({
        success: false,
        error: 'User ID, title, and duration are required'
      });
    }
    
    if (duration_minutes <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Duration must be greater than 0'
      });
    }
    
    const sessionData = {
      user_id: parseInt(user_id),
      title: title.trim(),
      description: description?.trim() || null,
      duration_minutes: parseInt(duration_minutes),
      exercises_practiced: exercises_practiced || [],
      notes: notes?.trim() || null,
      difficulty_level: difficulty_level || 'beginner',
      goals_achieved: goals_achieved || []
    };
    
    const newSession = await db.createPracticeSession(sessionData);
    
    res.status(201).json({
      success: true,
      data: newSession
    });
  } catch (error) {
    console.error('Create practice session error:', error);
    
    if (error.code === '23503') { // Foreign key constraint violation
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create practice session'
    });
  }
};

// Update practice session
const updatePracticeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      duration_minutes, 
      exercises_practiced,
      notes,
      difficulty_level,
      goals_achieved
    } = req.body;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid session ID is required'
      });
    }
    
    // Build update object with only provided fields
    const updates = {};
    if (title) updates.title = title.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (duration_minutes) {
      if (duration_minutes <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Duration must be greater than 0'
        });
      }
      updates.duration_minutes = parseInt(duration_minutes);
    }
    if (exercises_practiced !== undefined) updates.exercises_practiced = exercises_practiced;
    if (notes !== undefined) updates.notes = notes?.trim() || null;
    if (difficulty_level) updates.difficulty_level = difficulty_level;
    if (goals_achieved !== undefined) updates.goals_achieved = goals_achieved;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }
    
    const { data, error } = await db.supabase
      .from('practice_sessions')
      .update(updates)
      .eq('id', parseInt(id))
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Practice session not found'
        });
      }
      throw error;
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Update practice session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update practice session'
    });
  }
};

// Delete practice session
const deletePracticeSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Valid session ID is required'
      });
    }
    
    const { data, error } = await db.supabase
      .from('practice_sessions')
      .delete()
      .eq('id', parseInt(id))
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Practice session not found'
        });
      }
      throw error;
    }
    
    res.json({
      success: true,
      data: data,
      message: 'Practice session deleted successfully'
    });
  } catch (error) {
    console.error('Delete practice session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete practice session'
    });
  }
};

module.exports = {
  getPracticeSessions,
  getPracticeSessionById,
  createPracticeSession,
  updatePracticeSession,
  deletePracticeSession
};