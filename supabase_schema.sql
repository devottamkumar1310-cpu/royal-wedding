-- ============================================================================
-- Supabase Schema Setup Script
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor to create the missing tables and RLS policies.
-- These schema definitions correspond to the Admin and Client query structures.

-- 1. Create content table
CREATE TABLE IF NOT EXISTS public.content (
    id text PRIMARY KEY,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies for content table
DROP POLICY IF EXISTS "Allow public read content" ON public.content;
CREATE POLICY "Allow public read content" ON public.content 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin manage content" ON public.content;
CREATE POLICY "Allow admin manage content" ON public.content 
    FOR ALL USING (true);


-- 2. Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    storage_path text NOT NULL,
    category text NOT NULL DEFAULT 'Uncategorized',
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies for gallery table
DROP POLICY IF EXISTS "Allow public read gallery" ON public.gallery;
CREATE POLICY "Allow public read gallery" ON public.gallery 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin manage gallery" ON public.gallery;
CREATE POLICY "Allow admin manage gallery" ON public.gallery 
    FOR ALL USING (true);


-- 3. Create blessings table (Verified as already existing, listed here for completeness)
CREATE TABLE IF NOT EXISTS public.blessings (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    guest_name text NOT NULL,
    message text NOT NULL,
    is_approved boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blessings ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies for blessings table
DROP POLICY IF EXISTS "Allow public read blessings" ON public.blessings;
CREATE POLICY "Allow public read blessings" ON public.blessings 
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert blessings" ON public.blessings;
CREATE POLICY "Allow public insert blessings" ON public.blessings 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow admin manage blessings" ON public.blessings;
CREATE POLICY "Allow admin manage blessings" ON public.blessings 
    FOR ALL USING (true);
