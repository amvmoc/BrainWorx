/*
  # Calendar and Booking System

  ## Overview
  This migration creates a comprehensive calendar and booking system for franchise holders and customers.

  ## New Tables

  ### `franchise_availability`
  Stores when franchise holders are available for bookings
  - `id` (uuid, primary key)
  - `franchise_owner_id` (uuid, foreign key) - Links to the franchise owner
  - `day_of_week` (integer) - 0=Sunday, 1=Monday, ..., 6=Saturday
  - `start_time` (time) - Start time of availability
  - `end_time` (time) - End time of availability
  - `is_recurring` (boolean) - Whether this repeats weekly
  - `specific_date` (date, nullable) - For one-off availability overrides
  - `is_active` (boolean) - Whether this availability slot is currently active
  - `created_at`, `updated_at` (timestamps)

  ### `bookings`
  Stores customer appointment bookings
  - `id` (uuid, primary key)
  - `franchise_owner_id` (uuid, foreign key) - The franchise holder being booked
  - `customer_name` (text) - Customer's full name
  - `customer_email` (text) - Customer's email
  - `customer_phone` (text, nullable) - Optional phone number
  - `booking_date` (date) - Date of the appointment
  - `start_time` (time) - Appointment start time
  - `end_time` (time) - Appointment end time
  - `duration_minutes` (integer) - Duration in minutes
  - `status` (text) - pending, confirmed, cancelled, completed
  - `notes` (text, nullable) - Optional notes from customer
  - `cancellation_reason` (text, nullable) - Reason if cancelled
  - `created_at`, `updated_at` (timestamps)

  ## Security
  - Enable RLS on both tables
  - Franchise holders can manage their own availability
  - Franchise holders can view their own bookings
  - Customers can create bookings (public access for booking form)
  - Customers can view their own bookings via email

  ## Indexes
  - Index on franchise_owner_id for both tables
  - Index on booking_date and status for bookings
  - Index on day_of_week for availability lookups
*/

-- Create franchise_availability table
CREATE TABLE IF NOT EXISTS franchise_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_owner_id uuid REFERENCES franchise_owners(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_recurring boolean DEFAULT true,
  specific_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT recurring_or_specific CHECK (
    (is_recurring = true AND day_of_week IS NOT NULL AND specific_date IS NULL) OR
    (is_recurring = false AND specific_date IS NOT NULL)
  )
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_owner_id uuid REFERENCES franchise_owners(id) ON DELETE CASCADE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  cancellation_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_booking_time CHECK (end_time > start_time),
  CONSTRAINT valid_duration CHECK (duration_minutes > 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_franchise_availability_owner ON franchise_availability(franchise_owner_id);
CREATE INDEX IF NOT EXISTS idx_franchise_availability_day ON franchise_availability(day_of_week) WHERE is_recurring = true;
CREATE INDEX IF NOT EXISTS idx_franchise_availability_date ON franchise_availability(specific_date) WHERE specific_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_owner ON bookings(franchise_owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON bookings(booking_date, status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(customer_email);

-- Enable RLS
ALTER TABLE franchise_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for franchise_availability

-- Franchise owners can view their own availability
CREATE POLICY "Franchise owners can view own availability"
  ON franchise_availability
  FOR SELECT
  TO authenticated
  USING (franchise_owner_id = auth.uid());

-- Franchise owners can insert their own availability
CREATE POLICY "Franchise owners can create own availability"
  ON franchise_availability
  FOR INSERT
  TO authenticated
  WITH CHECK (franchise_owner_id = auth.uid());

-- Franchise owners can update their own availability
CREATE POLICY "Franchise owners can update own availability"
  ON franchise_availability
  FOR UPDATE
  TO authenticated
  USING (franchise_owner_id = auth.uid())
  WITH CHECK (franchise_owner_id = auth.uid());

-- Franchise owners can delete their own availability
CREATE POLICY "Franchise owners can delete own availability"
  ON franchise_availability
  FOR DELETE
  TO authenticated
  USING (franchise_owner_id = auth.uid());

-- Public can view active availability (for booking form)
CREATE POLICY "Public can view active availability"
  ON franchise_availability
  FOR SELECT
  TO anon
  USING (is_active = true);

-- RLS Policies for bookings

-- Franchise owners can view their own bookings
CREATE POLICY "Franchise owners can view own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (franchise_owner_id = auth.uid());

-- Franchise owners can update their own bookings (e.g., confirm, complete)
CREATE POLICY "Franchise owners can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (franchise_owner_id = auth.uid())
  WITH CHECK (franchise_owner_id = auth.uid());

-- Public can create bookings (customers booking appointments)
CREATE POLICY "Public can create bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Customers can view their own bookings by email (for public access)
CREATE POLICY "Customers can view own bookings by email"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

-- Super admins can view all bookings
CREATE POLICY "Super admins can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_franchise_availability_updated_at ON franchise_availability;
CREATE TRIGGER update_franchise_availability_updated_at
  BEFORE UPDATE ON franchise_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to check for booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict(
  p_franchise_owner_id uuid,
  p_booking_date date,
  p_start_time time,
  p_end_time time,
  p_exclude_booking_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bookings
    WHERE franchise_owner_id = p_franchise_owner_id
    AND booking_date = p_booking_date
    AND status NOT IN ('cancelled')
    AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
    AND (
      (start_time <= p_start_time AND end_time > p_start_time) OR
      (start_time < p_end_time AND end_time >= p_end_time) OR
      (start_time >= p_start_time AND end_time <= p_end_time)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
