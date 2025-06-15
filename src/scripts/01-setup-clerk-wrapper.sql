-- Enable the Wrappers extension
CREATE EXTENSION IF NOT EXISTS wrappers WITH SCHEMA extensions;

-- Enable the Wasm foreign data wrapper
CREATE FOREIGN DATA WRAPPER wasm_wrapper  
  HANDLER wasm_fdw_handler  
  VALIDATOR wasm_fdw_validator;

-- Create a schema for Clerk tables
CREATE SCHEMA IF NOT EXISTS clerk;
