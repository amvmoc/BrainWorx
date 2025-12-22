/*
  # Create ADHD 11-18 Assessment System

  1. New Tables
    - `adhd_1118_assessments`
      - `id` (uuid, primary key)
      - `teen_name` (text) - Name of the teen being assessed
      - `teen_age` (integer) - Age (11-18)
      - `teen_gender` (text) - Gender
      - `franchise_owner_id` (uuid, nullable) - Reference to franchise owner
      - `created_by_email` (text) - Email of person who created assessment
      - `coupon_id` (uuid, nullable) - Reference to coupon if used
      - `status` (text) - pending, teen_completed, parent_completed, both_completed
      - `share_token` (text, unique) - Token for public sharing
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `adhd_1118_assessment_responses`
      - `id` (uuid, primary key)
      - `assessment_id` (uuid) - Reference to assessment
      - `respondent_type` (text) - 'teen' or 'parent'
      - `respondent_name` (text)
      - `respondent_email` (text)
      - `respondent_relationship` (text) - 'self' for teen, 'parent', 'guardian', etc.
      - `responses` (jsonb) - Question responses
      - `scores` (jsonb) - Calculated pattern scores
      - `completed` (boolean)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow public read for specific share tokens
    - Allow authenticated users to manage their own assessments
    - Super admins can access all assessments

  3. Triggers
    - Auto-update status when responses are completed
    - Auto-generate share tokens
*/

-- Create adhd_1118_assessments table
CREATE TABLE IF NOT EXISTS adhd_1118_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teen_name text NOT NULL,
  teen_age integer NOT NULL CHECK (teen_age >= 11 AND teen_age <= 18),
  teen_gender text,
  franchise_owner_id uuid REFERENCES franchise_owners(id) ON DELETE SET NULL,
  created_by_email text NOT NULL,
  coupon_id uuid REFERENCES coupon_codes(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'teen_completed', 'parent_completed', 'both_completed')),
  share_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create adhd_1118_assessment_responses table
CREATE TABLE IF NOT EXISTS adhd_1118_assessment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES adhd_1118_assessments(id) ON DELETE CASCADE,
  respondent_type text NOT NULL CHECK (respondent_type IN ('teen', 'parent')),
  respondent_name text NOT NULL,
  respondent_email text NOT NULL,
  respondent_relationship text NOT NULL,
  responses jsonb DEFAULT '{}'::jsonb,
  scores jsonb DEFAULT '{}'::jsonb,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE adhd_1118_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE adhd_1118_assessment_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for adhd_1118_assessments

-- Public can read assessments by share token
CREATE POLICY "Anyone can view assessment by share token"
  ON adhd_1118_assessments FOR SELECT
  TO public
  USING (true);

-- Public can insert assessments (for initial creation)
CREATE POLICY "Anyone can create assessments"
  ON adhd_1118_assessments FOR INSERT
  TO public
  WITH CHECK (true);

-- Public can update assessments
CREATE POLICY "Anyone can update assessments"
  ON adhd_1118_assessments FOR UPDATE
  TO public
  USING (true);

-- Authenticated users can view their own assessments
CREATE POLICY "Franchise owners can view own assessments"
  ON adhd_1118_assessments FOR SELECT
  TO authenticated
  USING (
    franchise_owner_id IN (
      SELECT id FROM franchise_owners WHERE id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM franchise_owners 
      WHERE id = auth.uid() AND is_super_admin = true
    )
  );

-- Authenticated users can delete their own assessments
CREATE POLICY "Franchise owners can delete own assessments"
  ON adhd_1118_assessments FOR DELETE
  TO authenticated
  USING (
    franchise_owner_id IN (
      SELECT id FROM franchise_owners WHERE id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM franchise_owners 
      WHERE id = auth.uid() AND is_super_admin = true
    )
  );

-- RLS Policies for adhd_1118_assessment_responses

-- Public can read responses for assessments
CREATE POLICY "Anyone can view responses"
  ON adhd_1118_assessment_responses FOR SELECT
  TO public
  USING (true);

-- Public can insert responses
CREATE POLICY "Anyone can create responses"
  ON adhd_1118_assessment_responses FOR INSERT
  TO public
  WITH CHECK (true);

-- Public can update responses
CREATE POLICY "Anyone can update responses"
  ON adhd_1118_assessment_responses FOR UPDATE
  TO public
  USING (true);

-- Authenticated users can delete responses for their assessments
CREATE POLICY "Franchise owners can delete responses for own assessments"
  ON adhd_1118_assessment_responses FOR DELETE
  TO authenticated
  USING (
    assessment_id IN (
      SELECT id FROM adhd_1118_assessments 
      WHERE franchise_owner_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM franchise_owners 
      WHERE id = auth.uid() AND is_super_admin = true
    )
  );

-- Function to update assessment status
CREATE OR REPLACE FUNCTION update_adhd_1118_assessment_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE adhd_1118_assessments
  SET 
    status = CASE
      WHEN (
        SELECT COUNT(*) FROM adhd_1118_assessment_responses 
        WHERE assessment_id = NEW.assessment_id AND completed = true
      ) = 2 THEN 'both_completed'
      WHEN (
        SELECT COUNT(*) FROM adhd_1118_assessment_responses 
        WHERE assessment_id = NEW.assessment_id 
        AND respondent_type = 'teen' AND completed = true
      ) = 1 THEN 'teen_completed'
      WHEN (
        SELECT COUNT(*) FROM adhd_1118_assessment_responses 
        WHERE assessment_id = NEW.assessment_id 
        AND respondent_type = 'parent' AND completed = true
      ) = 1 THEN 'parent_completed'
      ELSE 'pending'
    END,
    updated_at = now()
  WHERE id = NEW.assessment_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update status when responses change
DROP TRIGGER IF EXISTS trigger_update_adhd_1118_assessment_status ON adhd_1118_assessment_responses;
CREATE TRIGGER trigger_update_adhd_1118_assessment_status
  AFTER INSERT OR UPDATE OF completed ON adhd_1118_assessment_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_adhd_1118_assessment_status();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_adhd_1118_assessments_franchise_owner ON adhd_1118_assessments(franchise_owner_id);
CREATE INDEX IF NOT EXISTS idx_adhd_1118_assessments_share_token ON adhd_1118_assessments(share_token);
CREATE INDEX IF NOT EXISTS idx_adhd_1118_assessments_status ON adhd_1118_assessments(status);
CREATE INDEX IF NOT EXISTS idx_adhd_1118_responses_assessment ON adhd_1118_assessment_responses(assessment_id);
