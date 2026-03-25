-- Re-enable Row Level Security for the beverages table
ALTER TABLE beverages ENABLE ROW LEVEL SECURITY;

-- Allow users to only see their own beverages
DROP POLICY IF EXISTS "Users can see their own beverages" ON beverages;
CREATE POLICY "Users can see their own beverages" 
ON beverages FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own beverages
DROP POLICY IF EXISTS "Users can insert their own beverages" ON beverages;
CREATE POLICY "Users can insert their own beverages" 
ON beverages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own beverages
DROP POLICY IF EXISTS "Users can update their own beverages" ON beverages;
CREATE POLICY "Users can update their own beverages" 
ON beverages FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to delete their own beverages
DROP POLICY IF EXISTS "Users can delete their own beverages" ON beverages;
CREATE POLICY "Users can delete their own beverages" 
ON beverages FOR DELETE 
USING (auth.uid() = user_id);

-- Warning: Ensure you have an index on user_id for performance
CREATE INDEX IF NOT EXISTS beverages_user_id_idx ON beverages (user_id);
