-- Cave136 Database Schema Update (Bio, Quantity, RLS)
-- Run this script in the Supabase SQL Editor

-- 1. Ensure the 'beverages' table exists with the right columns
-- If it already exists, this won't recreate it but we will add potentially missing columns safely

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beverages' AND column_name='bio') THEN
        ALTER TABLE public.beverages ADD COLUMN bio BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beverages' AND column_name='in_stock') THEN
        ALTER TABLE public.beverages ADD COLUMN in_stock BOOLEAN DEFAULT TRUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='beverages' AND column_name='quantity') THEN
        ALTER TABLE public.beverages ADD COLUMN quantity INTEGER DEFAULT 1;
    END IF;
END $$;

-- 2. Reinforce Row Level Security (RLS)
ALTER TABLE public.beverages ENABLE ROW LEVEL SECURITY;

-- Drop old policies to replace them with strict ones
DROP POLICY IF EXISTS "Users can view own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can insert own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can update own beverages" ON public.beverages;
DROP POLICY IF EXISTS "Users can delete own beverages" ON public.beverages;

-- Create strict policies using auth.uid()
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

-- Optional: Create an index on `bio` for fast filtering
CREATE INDEX IF NOT EXISTS idx_beverages_bio ON public.beverages(bio);

-- End of migration
