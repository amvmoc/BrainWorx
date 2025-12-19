/*
  # Fix ADHD Caregiver Coupon Creation

  ## Problem
  Parents completing ADHD assessments need to create coupon codes to invite caregivers,
  but they don't have permission due to RLS policies requiring franchise owner authentication.

  ## Solution
  Add a policy that allows anyone (anon or authenticated) to create coupon codes specifically
  for ADHD caregiver invitations (assessment_type = 'adhd-caregiver').

  ## Changes
  1. Add new INSERT policy for coupon_codes allowing creation of adhd-caregiver coupons
  2. Add SELECT policy for adhd-caregiver coupons to allow anyone to read them (for validation)

  ## Security Considerations
  - Only allows creation of coupons with assessment_type = 'adhd-caregiver'
  - created_by can be NULL for these system-generated coupons
  - Coupons still have max_uses and expires_at constraints to prevent abuse
*/

-- Allow anyone to create adhd-caregiver invitation coupons
CREATE POLICY "Anyone can create adhd-caregiver invitation coupons"
  ON coupon_codes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (assessment_type = 'adhd-caregiver');

-- Allow anyone to read adhd-caregiver coupons (needed for validation)
CREATE POLICY "Anyone can view adhd-caregiver coupons"
  ON coupon_codes
  FOR SELECT
  TO anon, authenticated
  USING (assessment_type = 'adhd-caregiver');