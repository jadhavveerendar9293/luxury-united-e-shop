-- Add courier_name column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_name TEXT;
