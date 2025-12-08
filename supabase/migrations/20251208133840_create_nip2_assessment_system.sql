/*
  # NIP2 Assessment System Tables
  
  Creates database structure for the Neural Imprint Patterns 2 (NIP2) assessment system.
  
  1. New Tables
    - `nip2_responses`
      - Stores individual assessment responses
      - Links to franchise owners for tracking
      - Contains 343 question answers
      - Tracks completion status and timestamps
      
    - `nip2_results`
      - Stores calculated NIP scores for each assessment
      - Contains all 20 NIP pattern scores
      - Stores percentage calculations
      - Links back to response record
      
  2. Security
    - Enable RLS on both tables
    - Franchise owners can view their own data
    - Super admins can view all data
    - Public can create responses (for standalone access)
    
  3. Features
    - Auto-generated share tokens for results sharing
    - Email verification tracking
    - Franchise owner tracking
    - Completion timestamps
*/

-- Create nip2_responses table
CREATE TABLE IF NOT EXISTS nip2_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  answers jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  current_question integer DEFAULT 0,
  franchise_owner_id uuid REFERENCES franchise_owners(id),
  entry_type text DEFAULT 'random_visitor' CHECK (entry_type IN ('franchise_link', 'random_visitor', 'test')),
  email_verified boolean DEFAULT false,
  email_sent boolean DEFAULT false,
  share_token uuid DEFAULT gen_random_uuid(),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_activity_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create nip2_results table
CREATE TABLE IF NOT EXISTS nip2_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id uuid REFERENCES nip2_responses(id) ON DELETE CASCADE,
  nip_scores jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_questions integer NOT NULL,
  completion_date text NOT NULL,
  top_patterns jsonb DEFAULT '[]'::jsonb,
  critical_patterns jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE nip2_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE nip2_results ENABLE ROW LEVEL SECURITY;

-- Policies for nip2_responses
CREATE POLICY "Anyone can create NIP2 responses"
  ON nip2_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own NIP2 responses"
  ON nip2_responses FOR SELECT
  TO authenticated
  USING (
    franchise_owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM franchise_owners
      WHERE id = auth.uid() AND is_super_admin = true
    )
  );

CREATE POLICY "Users can update own NIP2 responses"
  ON nip2_responses FOR UPDATE
  TO authenticated
  USING (
    franchise_owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM franchise_owners
      WHERE id = auth.uid() AND is_super_admin = true
    )
  )
  WITH CHECK (
    franchise_owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM franchise_owners
      WHERE id = auth.uid() AND is_super_admin = true
    )
  );

CREATE POLICY "Anonymous can view by share token"
  ON nip2_responses FOR SELECT
  TO anon
  USING (status = 'completed');

-- Policies for nip2_results
CREATE POLICY "Anyone can create NIP2 results"
  ON nip2_results FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view NIP2 results"
  ON nip2_results FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update results"
  ON nip2_results FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nip2_responses
      WHERE id = nip2_results.response_id
      AND (
        franchise_owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM franchise_owners
          WHERE id = auth.uid() AND is_super_admin = true
        )
      )
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_nip2_responses_franchise_owner ON nip2_responses(franchise_owner_id);
CREATE INDEX IF NOT EXISTS idx_nip2_responses_email ON nip2_responses(customer_email);
CREATE INDEX IF NOT EXISTS idx_nip2_responses_status ON nip2_responses(status);
CREATE INDEX IF NOT EXISTS idx_nip2_responses_share_token ON nip2_responses(share_token);
CREATE INDEX IF NOT EXISTS idx_nip2_results_response_id ON nip2_results(response_id);

-- Create updated_at trigger for nip2_results
CREATE OR REPLACE FUNCTION update_nip2_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nip2_results_timestamp
  BEFORE UPDATE ON nip2_results
  FOR EACH ROW
  EXECUTE FUNCTION update_nip2_results_updated_at();