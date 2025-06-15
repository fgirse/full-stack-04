-- Basic query to list all users
SELECT * FROM clerk.users;

-- List users with basic information
SELECT 
  id,
  username,
  first_name,
  last_name,
  created_at
FROM clerk.users
ORDER BY created_at DESC;

-- Count total users
SELECT COUNT(*) as total_users FROM clerk.users;

-- List users created in the last 30 days
SELECT 
  id,
  username,
  first_name,
  last_name,
  created_at
FROM clerk.users
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Extract email addresses from user attributes
SELECT 
  u.id,
  u.username,
  u.first_name,
  u.last_name,
  e->>'email_address' as email
FROM clerk.users u
CROSS JOIN json_array_elements((attrs->'email_addresses')::json) e
ORDER BY u.created_at DESC;

-- Get users with phone numbers
SELECT 
  u.id,
  u.username,
  u.first_name,
  u.last_name,
  p->>'phone_number' as phone
FROM clerk.users u
CROSS JOIN json_array_elements((attrs->'phone_numbers')::json) p
WHERE attrs->'phone_numbers' IS NOT NULL
ORDER BY u.created_at DESC;

-- List users with their verification status
SELECT 
  id,
  username,
  first_name,
  last_name,
  attrs->>'email_addresses'->0->>'verification'->>'status' as email_verified,
  created_at
FROM clerk.users
ORDER BY created_at DESC;
