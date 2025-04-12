-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  streak INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL DEFAULT 0,
  health_coins INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  mood TEXT CHECK (mood IN ('terrible', 'bad', 'neutral', 'good', 'great')),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  symptoms TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Store health metrics within journal entries
CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  mental_clarity INTEGER CHECK (mental_clarity BETWEEN 1 AND 10),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  exercise_minutes INTEGER DEFAULT 0,
  water_glasses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for journal entries
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to CRUD their own journal entries
CREATE POLICY "Users can CRUD own journal entries" 
  ON journal_entries FOR ALL 
  USING (auth.uid() = user_id);

-- Enable RLS for health metrics
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

-- Policy for health metrics based on journal entries ownership
CREATE POLICY "Users can CRUD own health metrics" 
  ON health_metrics FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM journal_entries 
      WHERE journal_entries.id = health_metrics.journal_entry_id 
      AND journal_entries.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column(); 