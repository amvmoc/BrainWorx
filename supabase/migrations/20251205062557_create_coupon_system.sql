/*
  # Create Coupon Code System

  1. New Tables
    - `coupon_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique) - The coupon code itself
      - `assessment_type` (text) - Which test this code is for
      - `max_uses` (integer) - Maximum number of times this code can be used
      - `current_uses` (integer) - How many times it has been used
      - `expires_at` (timestamptz) - When the code expires
      - `created_by` (uuid) - Which franchise owner created it
      - `is_active` (boolean) - Whether the code is active
      - `created_at` (timestamptz)
      
    - `coupon_redemptions`
      - `id` (uuid, primary key)
      - `coupon_id` (uuid, foreign key to coupon_codes)
      - `user_name` (text) - Name provided by user
      - `user_email` (text) - Email provided by user
      - `response_id` (uuid, nullable) - Link to the assessment response
      - `redeemed_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Super admins can create and view all coupons
    - Franchise owners can create and view their own coupons
    - Anyone can redeem a valid coupon (insert into redemptions)
*/

-- Create coupon_codes table
CREATE TABLE IF NOT EXISTS coupon_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  assessment_type text NOT NULL,
  max_uses integer DEFAULT 1,
  current_uses integer DEFAULT 0,
  expires_at timestamptz,
  created_by uuid REFERENCES franchise_owners(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create coupon_redemptions table
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid REFERENCES coupon_codes(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  response_id uuid,
  redeemed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;

-- Policies for coupon_codes
CREATE POLICY "Franchise owners can view own coupons"
  ON coupon_codes
  FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Franchise owners can create coupons"
  ON coupon_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Franchise owners can update own coupons"
  ON coupon_codes
  FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Policies for coupon_redemptions
CREATE POLICY "Franchise owners can view redemptions of their coupons"
  ON coupon_redemptions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM coupon_codes
      WHERE coupon_codes.id = coupon_redemptions.coupon_id
      AND coupon_codes.created_by = auth.uid()
    )
  );

CREATE POLICY "Anyone can redeem coupons"
  ON coupon_redemptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_coupon_codes_code ON coupon_codes(code);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_coupon_id ON coupon_redemptions(coupon_id);

-- Function to validate and use a coupon
CREATE OR REPLACE FUNCTION validate_and_use_coupon(
  p_code text,
  p_user_name text,
  p_user_email text
) RETURNS json AS $$
DECLARE
  v_coupon coupon_codes%ROWTYPE;
  v_redemption_id uuid;
BEGIN
  -- Get the coupon
  SELECT * INTO v_coupon
  FROM coupon_codes
  WHERE code = p_code
  AND is_active = true
  FOR UPDATE;

  -- Check if coupon exists
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Invalid coupon code');
  END IF;

  -- Check if expired
  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
    RETURN json_build_object('success', false, 'error', 'Coupon has expired');
  END IF;

  -- Check if max uses reached
  IF v_coupon.current_uses >= v_coupon.max_uses THEN
    RETURN json_build_object('success', false, 'error', 'Coupon has reached maximum uses');
  END IF;

  -- Create redemption record
  INSERT INTO coupon_redemptions (coupon_id, user_name, user_email)
  VALUES (v_coupon.id, p_user_name, p_user_email)
  RETURNING id INTO v_redemption_id;

  -- Update coupon uses
  UPDATE coupon_codes
  SET current_uses = current_uses + 1
  WHERE id = v_coupon.id;

  -- Return success with coupon details
  RETURN json_build_object(
    'success', true,
    'coupon_id', v_coupon.id,
    'redemption_id', v_redemption_id,
    'assessment_type', v_coupon.assessment_type,
    'created_by', v_coupon.created_by
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;