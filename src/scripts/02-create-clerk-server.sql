-- Create server connection to Clerk
-- Replace '<your-clerk-api-key>' with your actual Clerk API key
CREATE SERVER clerk_server
  FOREIGN DATA WRAPPER wasm_wrapper
  OPTIONS (
    fdw_package_url 'https://github.com/supabase/wrappers/releases/download/wasm_clerk_fdw_v0.1.0/clerk_fdw.wasm',
    fdw_package_name 'supabase:clerk-fdw',
    fdw_package_version '0.1.0',
    fdw_package_checksum '613be26b59fa4c074e0b93f0db617fcd7b468d4d02edece0b1f85fdb683ebdc4',
    api_url 'https://api.clerk.com/v1',
    api_key '<your-clerk-api-key>'
  );
