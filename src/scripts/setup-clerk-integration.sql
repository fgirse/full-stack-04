-- Enable the Wrappers extension
CREATE EXTENSION IF NOT EXISTS wrappers WITH SCHEMA extensions;

-- Enable the Wasm foreign data wrapper
CREATE FOREIGN DATA WRAPPER wasm_wrapper 
  HANDLER wasm_fdw_handler 
  VALIDATOR wasm_fdw_validator;

-- Create server connection to Clerk (replace with your actual API key)
CREATE SERVER clerk_server
  FOREIGN DATA WRAPPER wasm_wrapper
  OPTIONS (
    fdw_package_url 'https://github.com/supabase/wrappers/releases/download/wasm_clerk_fdw_v0.1.0/clerk_fdw.wasm',
    fdw_package_name 'supabase:clerk-fdw',
    fdw_package_version '0.1.0',
    fdw_package_checksum '613be26b59fa4c074e0b93f0db617fcd7b468d4d02edece0b1f85fdb683ebdc4',
    api_url 'https://api.clerk.com/v1',
    api_key 'your_clerk_api_key_here'
  );

-- Create schema for Clerk tables
CREATE SCHEMA IF NOT EXISTS clerk;
