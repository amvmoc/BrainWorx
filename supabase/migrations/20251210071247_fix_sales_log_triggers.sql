/*
  # Fix Sales Log Triggers for Missing franchise_codes Table

  1. Changes
    - Update create_sales_log_from_response to handle missing franchise_codes gracefully
    - Update create_sales_log_from_self_assessment to handle missing franchise_codes gracefully
    - Use franchise_owners.unique_link_code instead of franchise_codes table
*/

-- Fix create_sales_log_from_response function
DROP FUNCTION IF EXISTS create_sales_log_from_response() CASCADE;
CREATE OR REPLACE FUNCTION create_sales_log_from_response()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  franchise_code text;
  owner_id uuid;
BEGIN
  -- Get franchise owner ID
  owner_id := NEW.franchise_owner_id;

  -- Only create sales log if franchise owner exists
  IF owner_id IS NOT NULL THEN
    -- Get franchise code from franchise_owners table
    SELECT fo.unique_link_code INTO franchise_code
    FROM franchise_owners fo
    WHERE fo.id = owner_id
    LIMIT 1;

    -- Create sales log entry
    INSERT INTO sales_log (
      franchise_code,
      assessment_type,
      client_name,
      client_email,
      submission_date,
      franchise_owner_id
    )
    VALUES (
      franchise_code,
      'questionnaire',
      NEW.customer_name,
      NEW.customer_email,
      NEW.completed_at,
      owner_id
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS create_sales_log_on_response ON responses;
CREATE TRIGGER create_sales_log_on_response
  AFTER INSERT ON responses
  FOR EACH ROW
  WHEN (NEW.completed_at IS NOT NULL)
  EXECUTE FUNCTION create_sales_log_from_response();

-- Fix create_sales_log_from_self_assessment function
DROP FUNCTION IF EXISTS create_sales_log_from_self_assessment() CASCADE;
CREATE OR REPLACE FUNCTION create_sales_log_from_self_assessment()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  franchise_code text;
  owner_id uuid;
BEGIN
  -- Get franchise owner ID from the self assessment response
  owner_id := NEW.franchise_owner_id;

  -- Only create sales log if franchise owner exists
  IF owner_id IS NOT NULL THEN
    -- Get franchise code from franchise_owners table
    SELECT fo.unique_link_code INTO franchise_code
    FROM franchise_owners fo
    WHERE fo.id = owner_id
    LIMIT 1;

    -- Create sales log entry
    INSERT INTO sales_log (
      franchise_code,
      assessment_type,
      client_name,
      client_email,
      submission_date,
      franchise_owner_id
    )
    VALUES (
      franchise_code,
      'self_assessment',
      NEW.customer_name,
      NEW.customer_email,
      NEW.completed_at,
      owner_id
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS create_sales_log_on_self_assessment ON self_assessment_responses;
CREATE TRIGGER create_sales_log_on_self_assessment
  AFTER INSERT ON self_assessment_responses
  FOR EACH ROW
  WHEN (NEW.completed_at IS NOT NULL)
  EXECUTE FUNCTION create_sales_log_from_self_assessment();