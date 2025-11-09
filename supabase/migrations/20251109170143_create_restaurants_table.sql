/*
  # Create Restaurants Management Schema

  ## Overview
  This migration sets up the database schema for managing restaurants in the Gastro-Serra platform.

  ## New Tables
  
  ### `restaurants`
  - `id` (uuid, primary key) - Unique identifier for each restaurant
  - `name` (text, required) - Restaurant name
  - `description` (text) - Restaurant description
  - `address` (text) - Physical address
  - `phone` (text) - Contact phone number
  - `email` (text) - Contact email
  - `category` (text) - Restaurant category (e.g., "Fondue", "Steak", "Italian")
  - `image_url` (text) - URL to restaurant image
  - `created_by` (uuid, foreign key) - User who created the entry
  - `created_at` (timestamptz) - Timestamp of creation
  - `updated_at` (timestamptz) - Timestamp of last update

  ## Security
  - Enable RLS on `restaurants` table
  - Authenticated users can view all restaurants
  - Only authenticated users can create restaurants
  - Only the creator can update or delete their restaurants
*/

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  address text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  category text DEFAULT 'Restaurant',
  image_url text DEFAULT '',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view restaurants (public access)
CREATE POLICY "Anyone can view restaurants"
  ON restaurants
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can create restaurants
CREATE POLICY "Authenticated users can create restaurants"
  ON restaurants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Policy: Users can update their own restaurants
CREATE POLICY "Users can update own restaurants"
  ON restaurants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Policy: Users can delete their own restaurants
CREATE POLICY "Users can delete own restaurants"
  ON restaurants
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_restaurants_created_by ON restaurants(created_by);
CREATE INDEX IF NOT EXISTS idx_restaurants_category ON restaurants(category);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
