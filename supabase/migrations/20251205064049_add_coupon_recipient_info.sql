/*
  # Add Recipient Information to Coupon Codes
  
  1. Changes
    - Add `recipient_name` column to `coupon_codes`
    - Add `recipient_email` column to `coupon_codes`
    - Add `email_sent` boolean to track if coupon email was sent
    
  2. Notes
    - These fields store who the coupon was intended for
    - Helps with tracking and communication
*/

-- Add recipient information columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coupon_codes' AND column_name = 'recipient_name'
  ) THEN
    ALTER TABLE coupon_codes ADD COLUMN recipient_name text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coupon_codes' AND column_name = 'recipient_email'
  ) THEN
    ALTER TABLE coupon_codes ADD COLUMN recipient_email text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'coupon_codes' AND column_name = 'email_sent'
  ) THEN
    ALTER TABLE coupon_codes ADD COLUMN email_sent boolean DEFAULT false;
  END IF;
END $$;