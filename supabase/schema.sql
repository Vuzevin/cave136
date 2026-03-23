-- Cave136 Database Schema
-- Run this in your Supabase SQL editor

-- Create beverages table
CREATE TABLE IF NOT EXISTS public.beverages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('wine', 'whisky', 'beer', 'coffee', 'tea')),
  name TEXT NOT NULL,
  image_url TEXT,
  rating_general INTEGER DEFAULT 0 CHECK (rating_general >= 0 AND rating_general <= 5),
  rating_secondary INTEGER DEFAULT 0 CHECK (rating_secondary >= 0 AND rating_secondary <= 5),
  feeling_1 TEXT,
  feeling_2 TEXT,
  food_pairing TEXT,
  country TEXT,
  region TEXT,
  price DECIMAL(10, 2),
  notes TEXT,
  attributes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.beverages ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own data
CREATE POLICY "Users can view own beverages"
  ON public.beverages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own beverages"
  ON public.beverages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own beverages"
  ON public.beverages FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own beverages"
  ON public.beverages FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_beverages_user_id ON public.beverages(user_id);
CREATE INDEX IF NOT EXISTS idx_beverages_category ON public.beverages(category);
CREATE INDEX IF NOT EXISTS idx_beverages_country ON public.beverages(country);
CREATE INDEX IF NOT EXISTS idx_beverages_region ON public.beverages(region);
CREATE INDEX IF NOT EXISTS idx_beverages_created_at ON public.beverages(created_at DESC);

-- Note: Create the test user via Supabase Auth dashboard or CLI:
-- Email: funfact1806@gmail.com
-- Password: Usertest1234!
