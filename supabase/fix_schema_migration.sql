-- MIGRATION SCRIPT FOR CAVE136
-- Copy and run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Add missing columns safely
ALTER TABLE public.beverages ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;
ALTER TABLE public.beverages ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE public.beverages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Update existing rows if user_id is missing (optional but recommended)
-- UPDATE public.beverages SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;

-- 3. Set triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_beverages_updated_at ON public.beverages;
CREATE TRIGGER tr_beverages_updated_at
  BEFORE UPDATE ON public.beverages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable and Tighten Row Level Security (RLS)
ALTER TABLE public.beverages ENABLE ROW LEVEL SECURITY;

-- Drop any legacy/broad policies
DROP POLICY IF EXISTS "Public read access" ON public.beverages;
DROP POLICY IF EXISTS "Public insert access" ON public.beverages;
DROP POLICY IF EXISTS "Public update access" ON public.beverages;
DROP POLICY IF EXISTS "Public delete access" ON public.beverages;
DROP POLICY IF EXISTS "Users can view own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can insert own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can update own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can delete own beverages" ON public.beverages;

-- Create strict ownership policies
CREATE POLICY "Users can view own beverages" ON public.beverages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own beverages" ON public.beverages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own beverages" ON public.beverages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own beverages" ON public.beverages FOR DELETE USING (auth.uid() = user_id);

-- 5. Final check on performance indexes
CREATE INDEX IF NOT EXISTS idx_beverages_user_id ON public.beverages(user_id);
CREATE INDEX IF NOT EXISTS idx_beverages_category ON public.beverages(category);
