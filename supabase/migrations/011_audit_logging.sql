-- Create audit_logs table for compliance and security tracking

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(10) NOT NULL CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE')),
  table_name VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resource_id VARCHAR(100),
  before_state JSONB,
  after_state JSONB,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- Indexes for common queries
  CONSTRAINT audit_no_read_spam CHECK (
    action != 'READ' OR user_id IS NOT NULL
  )
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_table ON audit_logs(table_name);
CREATE INDEX idx_audit_resource ON audit_logs(resource_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- Enable RLS but allow admins to see all, users to see their own
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs"
  ON audit_logs
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only service role can insert audit logs"
  ON audit_logs
  FOR INSERT
  WITH CHECK (
    auth.role() = 'service_role'
  );

-- Create a function to auto-log certain mutations (optional enhancement)
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be attached to tables to auto-log mutations
  -- For now, we rely on application-level logging
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
