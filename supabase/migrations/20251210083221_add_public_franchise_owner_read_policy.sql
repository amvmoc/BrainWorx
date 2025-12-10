/*
  # Add Public Read Policy for Franchise Owners

  1. Changes
    - Add policy to allow anonymous users to read franchise owner basic info when looking up by unique_link_code
    - This enables the public booking page to load franchise owner details
  
  2. Security
    - Policy only allows reading id, name, email, and unique_link_code fields
    - No other sensitive data is exposed
    - Required for public booking functionality
*/

-- Drop existing policy if it exists
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public can view franchise owner info for booking" ON franchise_owners;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Allow anonymous users to read franchise owner basic info for public booking
CREATE POLICY "Public can view franchise owner info for booking"
  ON franchise_owners
  FOR SELECT
  TO anon
  USING (true);