import { supabase } from '@/integrations/supabase/client';
import type { ToneAnalysis, RewriteResult, ToneScores, Language, Audience, ContentMedium, Benchmark } from '@/types/tone';

interface AnalyzeParams {
  text: string;
  language: Language;
  audience: Audience;
  contentMedium: ContentMedium;
}

interface RewriteParams extends AnalyzeParams {
  toneAdjustments?: ToneScores;
}

export async function analyzeTone(params: AnalyzeParams): Promise<ToneAnalysis> {
  const { data, error } = await supabase.functions.invoke('analyze-tone', {
    body: {
      text: params.text,
      language: params.language,
      audience: params.audience,
      contentMedium: params.contentMedium,
      action: 'analyze',
    },
  });

  if (error) {
    console.error('Analyze tone error:', error);
    throw new Error(error.message || 'Failed to analyze tone');
  }

  return data as ToneAnalysis;
}

export async function rewriteText(params: RewriteParams): Promise<RewriteResult> {
  const { data, error } = await supabase.functions.invoke('analyze-tone', {
    body: {
      text: params.text,
      language: params.language,
      audience: params.audience,
      contentMedium: params.contentMedium,
      action: 'rewrite',
      toneAdjustments: params.toneAdjustments,
    },
  });

  if (error) {
    console.error('Rewrite error:', error);
    throw new Error(error.message || 'Failed to rewrite text');
  }

  return data as RewriteResult;
}

export async function saveToneAnalysis(
  inputText: string,
  analysis: ToneAnalysis,
  language: Language,
  audience: Audience,
  contentMedium: ContentMedium,
  rewrittenText?: string
) {
  const { error } = await supabase.from('tone_analyses').insert({
    input_text: inputText,
    language,
    audience,
    content_medium: contentMedium,
    passive_agg_score: analysis.passive_agg_score,
    sarcasm_score: analysis.sarcasm_score,
    empathy_score: analysis.empathy_score,
    formality_score: analysis.formality_score,
    aggression_score: analysis.aggression_score,
    severity: analysis.severity,
    rewritten_text: rewrittenText,
  });

  if (error) {
    console.error('Save analysis error:', error);
  }
}

export async function getRecentAnalyses(limit = 5) {
  const { data, error } = await supabase
    .from('tone_analyses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Get recent analyses error:', error);
    return [];
  }

  return data;
}

export async function getBenchmarks(): Promise<Benchmark[]> {
  const { data, error } = await supabase
    .from('benchmarks')
    .select('*');

  if (error) {
    console.error('Get benchmarks error:', error);
    return [];
  }

  return data as Benchmark[];
}

export function compareToBenchmark(userScores: ToneScores, benchmark: Benchmark): number {
  const empathyMatch = 100 - Math.abs(userScores.empathy_score - benchmark.empathy_score);
  const formalityMatch = 100 - Math.abs(userScores.formality_score - benchmark.formality_score);
  const directnessMatch = 100 - Math.abs((100 - userScores.passive_agg_score) - benchmark.directness_score);
  const warmthMatch = 100 - Math.abs(userScores.empathy_score - benchmark.warmth_score);

  return Math.round((empathyMatch + formalityMatch + directnessMatch + warmthMatch) / 4);
}
