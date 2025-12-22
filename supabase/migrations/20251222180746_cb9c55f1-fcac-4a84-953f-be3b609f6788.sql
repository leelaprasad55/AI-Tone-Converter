-- Create tone_analyses table for storing analysis history
CREATE TABLE public.tone_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  input_text TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'EN',
  audience TEXT NOT NULL DEFAULT 'general',
  content_medium TEXT NOT NULL DEFAULT 'email',
  passive_agg_score INTEGER NOT NULL DEFAULT 0,
  sarcasm_score INTEGER NOT NULL DEFAULT 0,
  empathy_score INTEGER NOT NULL DEFAULT 0,
  formality_score INTEGER NOT NULL DEFAULT 0,
  aggression_score INTEGER NOT NULL DEFAULT 0,
  severity TEXT NOT NULL DEFAULT 'low',
  rewritten_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_tone_profiles table for personalization
CREATE TABLE public.user_tone_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sample_emails TEXT[] DEFAULT '{}',
  brand_voice_summary TEXT,
  preferred_formality INTEGER DEFAULT 50,
  preferred_empathy INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create benchmarks table for famous communicators
CREATE TABLE public.benchmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  communicator_name TEXT NOT NULL,
  description TEXT,
  formality_score INTEGER NOT NULL,
  empathy_score INTEGER NOT NULL,
  directness_score INTEGER NOT NULL,
  warmth_score INTEGER NOT NULL
);

-- Insert famous communicator benchmarks
INSERT INTO public.benchmarks (communicator_name, description, formality_score, empathy_score, directness_score, warmth_score) VALUES
('Oprah Winfrey', 'Warm, empathetic, inspiring communicator', 60, 95, 70, 95),
('Steve Jobs', 'Direct, visionary, persuasive speaker', 65, 50, 95, 40),
('Warren Buffett', 'Folksy, humble, clear business communicator', 55, 75, 85, 80),
('Michelle Obama', 'Graceful, relatable, inspiring leader', 70, 90, 75, 90),
('Elon Musk', 'Direct, technical, unconventional communicator', 40, 30, 95, 25);

-- Enable RLS but allow public access for demo purposes
ALTER TABLE public.tone_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tone_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmarks ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for demo (no auth required)
CREATE POLICY "Allow public read on tone_analyses" ON public.tone_analyses FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tone_analyses" ON public.tone_analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on tone_analyses" ON public.tone_analyses FOR UPDATE USING (true);

CREATE POLICY "Allow public read on user_tone_profiles" ON public.user_tone_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on user_tone_profiles" ON public.user_tone_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on user_tone_profiles" ON public.user_tone_profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public read on benchmarks" ON public.benchmarks FOR SELECT USING (true);