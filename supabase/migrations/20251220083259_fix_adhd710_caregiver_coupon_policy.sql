/*
  # Fix ADHD 7-10 Caregiver Coupon Creation Policy

  ## Problem
  The application is trying to create coupons with assessment_type = 'adhd-710-caregiver'
  but the RLS policy only allows 'adhd-caregiver'. This prevents parents from inviting
  teachers/caregivers after completing the ADHD 7-10 assessment.

  ## Solution
  Update the RLS policies to also allow 'adhd-710-caregiver' assessment type.

  ## Changes
  1. Drop existing restrictive policies
  2. Create new policies that allow both 'adhd-caregiver' and 'adhd-710-caregiver' types
*/

-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Anyone can create adhd-caregiver invitation coupons" ON coupon_codes;
DROP POLICY IF EXISTS "Anyone can view adhd-caregiver coupons" ON coupon_codes;

-- Allow anyone to create ADHD caregiver invitation coupons (both types)
CREATE POLICY "Anyone can create ADHD caregiver invitation coupons"
  ON coupon_codes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (assessment_type IN ('adhd-caregiver', 'adhd-710-caregiver'));

-- Allow anyone to read ADHD caregiver coupons (needed for validation)
CREATE POLICY "Anyone can view ADHD caregiver coupons"
  ON coupon_codes
  FOR SELECT
  TO anon, authenticated
  USING (assessment_type IN ('adhd-caregiver', 'adhd-710-caregiver'));