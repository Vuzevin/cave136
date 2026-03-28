-- Cave136 Database Schema (sans authentification)
-- Run this in your Supabase SQL editor

-- Create beverages table
CREATE TABLE IF NOT EXISTS public.beverages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
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
  bio BOOLEAN DEFAULT FALSE,
  attributes JSONB DEFAULT '{}'::jsonb,
  in_stock BOOLEAN DEFAULT TRUE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS tr_beverages_updated_at ON public.beverages;
CREATE TRIGGER tr_beverages_updated_at
  BEFORE UPDATE ON public.beverages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.beverages ENABLE ROW LEVEL SECURITY;

-- Drop old auth-based policies if they exist
DROP POLICY IF EXISTS "Users can view own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can insert own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can update own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can delete own beverages" ON public.beverages;

-- Owners only policies
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

-- Also allow anon key to bypass RLS entirely (alternative approach)
-- GRANT ALL ON public.beverages TO anon;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_beverages_category ON public.beverages(category);
CREATE INDEX IF NOT EXISTS idx_beverages_country ON public.beverages(country);
CREATE INDEX IF NOT EXISTS idx_beverages_region ON public.beverages(region);
CREATE INDEX IF NOT EXISTS idx_beverages_created_at ON public.beverages(created_at DESC);
