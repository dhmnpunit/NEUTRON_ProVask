-- Create app_settings table for storing application configuration
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_name TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON app_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO app_settings (setting_name, setting_value, is_encrypted)
VALUES 
  ('openai_api_key', NULL, true),
  ('app_version', '1.0.0', false),
  ('message_retention_days', '30', false)
ON CONFLICT (setting_name) DO NOTHING;

-- Only allow superadmin access to this table
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage settings
CREATE POLICY "Admins can manage app settings"
  ON app_settings
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

-- Create index on setting_name for faster lookups
CREATE INDEX IF NOT EXISTS app_settings_name_idx ON app_settings(setting_name); 