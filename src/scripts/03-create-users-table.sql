-- Create foreign table for Clerk users
CREATE FOREIGN TABLE clerk.users (
  id TEXT,
  external_id TEXT,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  attrs JSONB
)
SERVER clerk_server
OPTIONS (
  object 'users'
);
