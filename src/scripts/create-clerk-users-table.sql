-- Create foreign table for Clerk users
CREATE FOREIGN TABLE clerk.users (
  id text,
  external_id text,
  username text,
  first_name text,
  last_name text,
  created_at timestamp,
  updated_at timestamp,
  attrs jsonb
)
SERVER clerk_server
OPTIONS (
  object 'users'
);
