-- Add new tone columns to tone_analyses table
ALTER TABLE public.tone_analyses 
ADD COLUMN IF NOT EXISTS defensiveness_score integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS condescension_score integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS manipulation_score integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS dismissiveness_score integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS anxiety_score integer NOT NULL DEFAULT 0;