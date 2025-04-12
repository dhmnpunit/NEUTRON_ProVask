-- Create chat_messages table for storing user-assistant conversations
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  sender TEXT CHECK (sender IN ('user', 'assistant')) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER update_chat_messages_updated_at
BEFORE UPDATE ON chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own chat messages
CREATE POLICY "Users can view their own chat messages"
  ON chat_messages
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own chat messages
CREATE POLICY "Users can create their own chat messages"
  ON chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own chat messages
CREATE POLICY "Users can delete their own chat messages"
  ON chat_messages
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS chat_messages_created_at_idx ON chat_messages(created_at); 