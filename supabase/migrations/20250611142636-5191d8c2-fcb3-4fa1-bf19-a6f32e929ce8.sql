
-- Adicionar campos necessários na tabela user_settings
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS qr_code_link TEXT,
ADD COLUMN IF NOT EXISTS last_checked TIMESTAMP WITH TIME ZONE;

-- Adicionar RLS policies para a tabela user_settings se não existirem
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policy para SELECT
DROP POLICY IF EXISTS "Users can view their own settings" ON public.user_settings;
CREATE POLICY "Users can view their own settings" 
  ON public.user_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy para INSERT
DROP POLICY IF EXISTS "Users can create their own settings" ON public.user_settings;
CREATE POLICY "Users can create their own settings" 
  ON public.user_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy para UPDATE
DROP POLICY IF EXISTS "Users can update their own settings" ON public.user_settings;
CREATE POLICY "Users can update their own settings" 
  ON public.user_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);
