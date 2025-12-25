export interface ToneScores {
  passive_agg_score: number;
  sarcasm_score: number;
  empathy_score: number;
  formality_score: number;
  aggression_score: number;
  defensiveness_score: number;
  condescension_score: number;
  manipulation_score: number;
  dismissiveness_score: number;
  anxiety_score: number;
}

export interface ToneAnalysis extends ToneScores {
  severity: 'high' | 'medium' | 'low';
  emotion_flags: string[];
  analysis_summary: string;
  key_phrases: string[];
}

export interface RewriteResult {
  rewritten_text: string;
  changes_summary: string;
  intent_preserved_confidence: number;
  new_scores: ToneScores;
}

export interface Benchmark {
  id: string;
  communicator_name: string;
  description: string;
  formality_score: number;
  empathy_score: number;
  directness_score: number;
  warmth_score: number;
}

export type Language = 'EN' | 'HI' | 'ES' | 'FR' | 'DE' | 'PT' | 'ZH';
export type Audience = 'boss' | 'client' | 'peer' | 'HR' | 'general' | 'investor' | 'team' | 'vendor' | 'partner' | 'customer';
export type ContentMedium = 'email' | 'tweet' | 'formal_doc' | 'chat' | 'social';

export const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: 'EN', label: 'English', flag: '🇺🇸' },
  { value: 'HI', label: 'Hindi', flag: '🇮🇳' },
  { value: 'ES', label: 'Spanish', flag: '🇪🇸' },
  { value: 'FR', label: 'French', flag: '🇫🇷' },
  { value: 'DE', label: 'German', flag: '🇩🇪' },
  { value: 'PT', label: 'Portuguese', flag: '🇧🇷' },
  { value: 'ZH', label: 'Chinese', flag: '🇨🇳' },
];

export const AUDIENCES: { value: Audience; label: string; icon: string }[] = [
  { value: 'boss', label: 'Boss', icon: '👔' },
  { value: 'client', label: 'Client', icon: '🤝' },
  { value: 'peer', label: 'Peer', icon: '👥' },
  { value: 'HR', label: 'HR', icon: '📋' },
  { value: 'general', label: 'General', icon: '🌐' },
  { value: 'investor', label: 'Investor', icon: '💰' },
  { value: 'team', label: 'Team', icon: '👨‍👩‍👧‍👦' },
  { value: 'vendor', label: 'Vendor', icon: '🏪' },
  { value: 'partner', label: 'Partner', icon: '🤲' },
  { value: 'customer', label: 'Customer', icon: '🛒' },
];

export const CONTENT_MEDIUMS: { value: ContentMedium; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'tweet', label: 'Tweet' },
  { value: 'formal_doc', label: 'Formal Document' },
  { value: 'chat', label: 'Chat Message' },
  { value: 'social', label: 'Social Media' },
];

export const TONE_LABELS: Record<keyof ToneScores, { label: string; description: string; color: string }> = {
  passive_agg_score: { label: 'Passive-Aggressive', description: 'Indirect hostility', color: 'destructive' },
  sarcasm_score: { label: 'Sarcasm', description: 'Mocking undertones', color: 'warning' },
  empathy_score: { label: 'Empathy', description: 'Understanding & care', color: 'success' },
  formality_score: { label: 'Formality', description: 'Professional tone', color: 'primary' },
  aggression_score: { label: 'Aggression', description: 'Direct hostility', color: 'destructive' },
  defensiveness_score: { label: 'Defensiveness', description: 'Self-protective tone', color: 'warning' },
  condescension_score: { label: 'Condescension', description: 'Talking down', color: 'destructive' },
  manipulation_score: { label: 'Manipulation', description: 'Subtle control', color: 'destructive' },
  dismissiveness_score: { label: 'Dismissiveness', description: 'Disregarding others', color: 'warning' },
  anxiety_score: { label: 'Anxiety', description: 'Nervous energy', color: 'muted' },
};