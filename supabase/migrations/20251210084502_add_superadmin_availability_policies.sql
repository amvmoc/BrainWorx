/*
  # Add Super Admin Policies for Availability Management

  ## Changes
  - Add policies allowing super admins to manage all franchise availability
  - Super admins can view, insert, update, and delete any availability record
  - This allows super admins to set their own availability and manage others' availability

  ## Security
  - Only users with is_super_admin = true can use these policies
  - Uses existing is_super_admin() function for checking permissions
*/

-- Super admins can view all availability
CREATE POLICY "Super admins can view all availability"
  ON franchise_availability
  FOR SELECT
  TO authenticated
  USING (is_super_admin());

-- Super admins can insert any availability
CREATE POLICY "Super admins can create any availability"
  ON franchise_availability
  FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin());

-- Super admins can update any availability
CREATE POLICY "Super admins can update any availability"
  ON franchise_availability
  FOR UPDATE
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- Super admins can delete any availability
CREATE POLICY "Super admins can delete any availability"
  ON franchise_availability
  FOR DELETE
  TO authenticated
  USING (is_super_admin());
