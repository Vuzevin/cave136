-- Migration: Remove auth requirement from Cave136
-- Run this in your Supabase SQL editor (Dashboard > SQL Editor)

-- 1. Make user_id nullable (remove NOT NULL constraint)
ALTER TABLE public.beverages ALTER COLUMN user_id DROP NOT NULL;

-- 2. Drop old auth-based RLS policies
DROP POLICY IF EXISTS "Users can view own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can insert own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can update own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can delete own beverages" ON public.beverages;

-- 3. Create new public access policies
CREATE POLICY "Public read access"
  ON public.beverages FOR SELECT
  USING (true);

CREATE POLICY "Public insert access"
  ON public.beverages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update access"
  ON public.beverages FOR UPDATE
  USING (true);

CREATE POLICY "Public delete access"
  ON public.beverages FOR DELETE
  USING (true);
