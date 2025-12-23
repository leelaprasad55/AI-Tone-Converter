import { cn } from '@/lib/utils';
import { ToneScores, TONE_LABELS } from '@/types/tone';

interface ToneScoreBarProps {
  label: string;
  score: number;
  color: string;
  icon: string;
  showChange?: number;
}

function ToneScoreBar({ label, score, color, icon, showChange }: ToneScoreBarProps) {
  const getScoreColor = (score: number, isNegative: boolean) => {
    if (isNegative) {
      if (score >= 70) return 'text-destructive';
      if (score >= 40) return 'text-warning';
      return 'text-success';
    }
    if (score >= 70) return 'text-success';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const negativeTones = ['Passive-Aggressive', 'Sarcasm', 'Aggression', 'Defensiveness', 'Condescension', 'Manipulation', 'Dismissiveness'];
  const isNegativeTone = negativeTones.includes(label);
  const scoreColor = getScoreColor(score, isNegativeTone);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-bold', scoreColor)}>{score}%</span>
          {showChange !== undefined && showChange !== 0 && (
            <span className={cn(
              'text-xs font-medium px-1 py-0.5 rounded',
              showChange < 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
            )}>
              {showChange > 0 ? '+' : ''}{showChange}
            </span>
          )}
        </div>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', color)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

interface ToneBreakdownProps {
  scores: ToneScores;
  previousScores?: ToneScores;
  className?: string;
}

export function ToneBreakdown({ scores, previousScores, className }: ToneBreakdownProps) {
  const tones = [
    { key: 'passive_agg_score' as keyof ToneScores, label: 'Passive-Aggressive', color: 'bg-tone-passive-agg', icon: '😤' },
    { key: 'sarcasm_score' as keyof ToneScores, label: 'Sarcasm', color: 'bg-tone-sarcasm', icon: '🙄' },
    { key: 'aggression_score' as keyof ToneScores, label: 'Aggression', color: 'bg-tone-aggression', icon: '🔥' },
    { key: 'defensiveness_score' as keyof ToneScores, label: 'Defensiveness', color: 'bg-warning', icon: '🛡️' },
    { key: 'condescension_score' as keyof ToneScores, label: 'Condescension', color: 'bg-destructive', icon: '👆' },
    { key: 'manipulation_score' as keyof ToneScores, label: 'Manipulation', color: 'bg-destructive', icon: '🎭' },
    { key: 'dismissiveness_score' as keyof ToneScores, label: 'Dismissiveness', color: 'bg-warning', icon: '✋' },
    { key: 'anxiety_score' as keyof ToneScores, label: 'Anxiety', color: 'bg-muted-foreground', icon: '😰' },
    { key: 'empathy_score' as keyof ToneScores, label: 'Empathy', color: 'bg-tone-empathy', icon: '💚' },
    { key: 'formality_score' as keyof ToneScores, label: 'Formality', color: 'bg-tone-formality', icon: '👔' },
  ];

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-3', className)}>
      {tones.map((tone) => (
        <ToneScoreBar
          key={tone.key}
          label={tone.label}
          score={scores[tone.key] ?? 0}
          color={tone.color}
          icon={tone.icon}
          showChange={previousScores ? (scores[tone.key] ?? 0) - (previousScores[tone.key] ?? 0) : undefined}
        />
      ))}
    </div>
  );
}