# ADHD Assessment System - Fixes Log

This document tracks all fixes and changes made to the ADHD Assessment system.

## Fix #1: Gender Options (2025-12-19)

**Problem:** Gender dropdown showed "Non-binary" and "Prefer not to say" options which were not needed.

**Solution:**
- Removed "Non-binary" and "Prefer not to say" options from gender dropdown
- Changed default value from 'prefer_not_to_say' to 'male'
- Gender dropdown now only shows: Male, Female

**Files Changed:**
- `src/components/ADHDAssessment.tsx` (line 33, lines 581-583)

---

## Fix #2: Caregiver Invitation Visibility (2025-12-19)

**Problem:** After parent completed assessment, the option to invite caregiver was at the bottom of the page and easy to miss.

**Solution:**
- Moved caregiver invitation prompt to TOP of parent report page
- Created prominent blue banner with clear call-to-action
- Button text: "Send Caregiver Invitation →"

**Files Changed:**
- `src/components/ADHDAssessment.tsx` (lines 302-331)

---

## Fix #3: Caregiver Invitation Form Position (2025-12-19)

**Problem:** When clicking to invite caregiver, the invitation form appeared at the bottom below the parent report.

**Solution:**
- Moved invitation form to TOP of the page
- Parent report now displays below the invitation form
- Makes it clear what action needs to be taken first

**Files Changed:**
- `src/components/ADHDAssessment.tsx` (lines 334-460)

---

## Fix #4: Database Column Name Error (2025-12-19)

**Problem:** Coupon creation was failing with "Could not find the 'valid_until' column" error.

**Solution:**
- Changed `valid_until` to `expires_at` to match actual database schema
- The coupon_codes table uses `expires_at` not `valid_until`

**Files Changed:**
- `src/components/ADHDAssessment.tsx` (line 255)

---

## Fix #5: RLS Policy for Coupon Creation (2025-12-19)

**Problem:** Parents got "new row violates row-level security policy for table 'coupon_codes'" error when trying to create caregiver invitation coupons.

**Root Cause:**
- Original RLS policies only allowed franchise owners (authenticated users with created_by = auth.uid()) to create coupons
- Parents are not franchise owners and don't have franchise_owners records
- When parents try to invite caregivers, they need to create a coupon but don't have permission

**Solution:**
- Created new migration: `fix_adhd_caregiver_coupon_creation`
- Added policy: "Anyone can create adhd-caregiver invitation coupons"
  - Allows anon and authenticated users to create coupons
  - ONLY for assessment_type = 'adhd-caregiver'
  - created_by can be NULL for these system-generated coupons
- Added policy: "Anyone can view adhd-caregiver coupons"
  - Allows validation of these coupons without authentication

**Security Considerations:**
- Restricts creation to only adhd-caregiver type coupons
- Other coupon types still require franchise owner authentication
- Coupons have max_uses=1 and 30-day expiration to prevent abuse
- Each coupon is unique and tied to specific caregiver email

**Database Changes:**
- New migration file: `supabase/migrations/[timestamp]_fix_adhd_caregiver_coupon_creation.sql`
- Two new RLS policies on coupon_codes table

---

## Summary of All Changes

### Code Changes
1. Gender dropdown simplified to Male/Female only
2. Caregiver invitation prominently displayed at top after parent assessment
3. Invitation form appears at top when clicked
4. Fixed database column name from valid_until to expires_at

### Database Changes
1. Added RLS policy for adhd-caregiver coupon creation (anon/authenticated)
2. Added RLS policy for adhd-caregiver coupon viewing (anon/authenticated)

### Impact
- Parents can now complete assessments and invite caregivers without authentication errors
- Clear user flow guides parents through the invitation process
- Security maintained through type-specific policies and coupon constraints
