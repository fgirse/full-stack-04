-- Query all users from Clerk
SELECT * FROM clerk.users;

-- Query users with email addresses extracted from JSON attributes
SELECT 
  u.id,
  u.username,
  u.first_name,
  u.last_name,
  e->>'email_address' as email,
  u.created_at
FROM clerk.users u
CROSS JOIN json_array_elements((attrs->'email_addresses')::json) e;

-- Query users created in the last 30 days
SELECT 
  id,
  username,
  first_name,
  last_name,
  created_at
FROM clerk.users 
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
