-- Create user_roles table for role-based access control
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create updated_at trigger
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view any roles (needed for authorization checks)
CREATE POLICY "Users can view all roles"
  ON user_roles
  FOR SELECT
  USING (true);

-- Policy for admins to manage roles
CREATE POLICY "Admins can manage roles"
  ON user_roles
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON user_roles(role); 