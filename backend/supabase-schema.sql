-- Guitar Practice App Database Schema for Supabase
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    skill_level VARCHAR(20) DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    practice_goals TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practice sessions table
CREATE TABLE IF NOT EXISTS practice_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    exercises_practiced TEXT[] DEFAULT '{}',
    notes TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    goals_achieved TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table (for predefined exercises)
CREATE TABLE IF NOT EXISTS exercises (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR(100), -- e.g., 'scales', 'chords', 'fingerpicking', 'rhythm'
    instructions TEXT,
    video_url VARCHAR(500),
    sheet_music_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    exercise_id BIGINT REFERENCES exercises(id) ON DELETE CASCADE,
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
    last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, exercise_id)
);

-- Practice recordings table (for audio/video files)
CREATE TABLE IF NOT EXISTS practice_recordings (
    id BIGSERIAL PRIMARY KEY,
    practice_session_id BIGINT REFERENCES practice_sessions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'audio' or 'video'
    file_size BIGINT,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_created_at ON practice_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_exercise_id ON user_progress(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty_level);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_sessions_updated_at BEFORE UPDATE ON practice_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample exercises
INSERT INTO exercises (name, description, difficulty_level, category, instructions) VALUES
('C Major Scale', 'Basic C major scale in first position', 'beginner', 'scales', 'Play C-D-E-F-G-A-B-C using fingers 1-2-4 on each string'),
('G Major Chord', 'Open G major chord', 'beginner', 'chords', 'Place finger 2 on 3rd fret low E, finger 1 on 2nd fret A, finger 3 on 3rd fret high E'),
('Basic Strumming Pattern', 'Down-down-up-up-down-up pattern', 'beginner', 'rhythm', 'Strum down on beats 1 and 2, up on the and of 2, up on the and of 3, down on 4, up on the and of 4'),
('Barre Chords - F Major', 'F major barre chord', 'intermediate', 'chords', 'Barre all strings on 1st fret with index finger, add fingers for F major shape'),
('Pentatonic Scale Patterns', 'All 5 pentatonic scale patterns', 'intermediate', 'scales', 'Learn all 5 positions of the pentatonic scale across the fretboard'),
('Fingerpicking Pattern', 'Travis picking pattern', 'advanced', 'fingerpicking', 'Thumb plays bass notes on beats 1 and 3, fingers play melody on beats 2 and 4');

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_recordings ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Practice sessions policies
CREATE POLICY "Users can view own practice sessions" ON practice_sessions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own practice sessions" ON practice_sessions FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own practice sessions" ON practice_sessions FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete own practice sessions" ON practice_sessions FOR DELETE USING (auth.uid()::text = user_id::text);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update own progress" ON user_progress FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Practice recordings policies
CREATE POLICY "Users can view own recordings" ON practice_recordings 
FOR SELECT USING (
    auth.uid()::text = (
        SELECT user_id::text FROM practice_sessions 
        WHERE practice_sessions.id = practice_recordings.practice_session_id
    )
);

-- Exercises are public (everyone can read)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view exercises" ON exercises FOR SELECT USING (true);

-- Create storage buckets (run these in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('practice-recordings', 'practice-recordings', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('sheet-music', 'sheet-music', true);

-- Storage policies for practice recordings
-- CREATE POLICY "Users can upload own recordings" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'practice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can view own recordings" ON storage.objects FOR SELECT USING (bucket_id = 'practice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can delete own recordings" ON storage.objects FOR DELETE USING (bucket_id = 'practice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);