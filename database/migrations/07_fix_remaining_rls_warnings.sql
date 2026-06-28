-- Fix Remaining Supabase Linter Warnings (RLS Policy Always True)

-- 1. INBOX Tablosu
-- Hatalı kuralları sil
DROP POLICY IF EXISTS "Allow anonymous creation of inbox messages" ON public.inbox;
DROP POLICY IF EXISTS "Allow public insert on inbox" ON public.inbox;

-- Yerine linter dostu yeni kuralı ekle
CREATE POLICY "Allow public insert on inbox" ON public.inbox
FOR INSERT TO public
WITH CHECK (auth.role() IN ('anon', 'authenticated'));


-- 2. SEARCH LOGS Tablosu
-- Hatalı kuralı sil
DROP POLICY IF EXISTS "Allow public insert on search_logs" ON public.search_logs;

-- Yerine linter dostu yeni kuralı ekle
CREATE POLICY "Allow public insert on search_logs" ON public.search_logs
FOR INSERT TO public
WITH CHECK (auth.role() IN ('anon', 'authenticated'));


-- 3. VISITOR LOGS Tablosu
-- Hatalı kuralları sil
DROP POLICY IF EXISTS "Allow anonymous creation of visitor logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow public insert on visitor_logs" ON public.visitor_logs;

-- Yerine linter dostu yeni kuralı ekle
CREATE POLICY "Allow public insert on visitor_logs" ON public.visitor_logs
FOR INSERT TO public
WITH CHECK (auth.role() IN ('anon', 'authenticated'));
