export interface ToneScores {
  passive_agg_score: number;
  sarcasm_score: number;
  empathy_score: number;
  formality_score: number;
  aggression_score: number;
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
export type Audience = 'boss' | 'client' | 'peer' | 'HR' | 'general';
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
];

export const CONTENT_MEDIUMS: { value: ContentMedium; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'tweet', label: 'Tweet' },
  { value: 'formal_doc', label: 'Formal Document' },
  { value: 'chat', label: 'Chat Message' },
  { value: 'social', label: 'Social Media' },
];
