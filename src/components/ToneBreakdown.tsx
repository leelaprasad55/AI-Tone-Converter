import { cn } from '@/lib/utils';
import { ToneScores } from '@/types/tone';

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

  const isNegativeTone = ['Passive-Aggressive', 'Sarcasm', 'Aggression'].includes(label);
  const scoreColor = getScoreColor(score, isNegativeTone);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-bold', scoreColor)}>{score}%</span>
          {showChange !== undefined && showChange !== 0 && (
            <span className={cn(
              'text-xs font-medium px-1.5 py-0.5 rounded',
              showChange < 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
            )}>
              {showChange > 0 ? '+' : ''}{showChange}%
            </span>
          )}
        </div>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
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
    { 
      label: 'Passive-Aggressive', 
      key: 'passive_agg_score' as keyof ToneScores, 
      color: 'bg-tone-passive-agg', 
      icon: '😤' 
    },
    { 
      label: 'Sarcasm', 
      key: 'sarcasm_score' as keyof ToneScores, 
      color: 'bg-tone-sarcasm', 
      icon: '🙄' 
    },
    { 
      label: 'Empathy', 
      key: 'empathy_score' as keyof ToneScores, 
      color: 'bg-tone-empathy', 
      icon: '💚' 
    },
    { 
      label: 'Formality', 
      key: 'formality_score' as keyof ToneScores, 
      color: 'bg-tone-formality', 
      icon: '👔' 
    },
    { 
      label: 'Aggression', 
      key: 'aggression_score' as keyof ToneScores, 
      color: 'bg-tone-aggression', 
      icon: '🔥' 
    },
  ];

  return (
    <div className={cn('space-y-4', className)}>
      {tones.map((tone) => (
        <ToneScoreBar
          key={tone.key}
          label={tone.label}
          score={scores[tone.key]}
          color={tone.color}
          icon={tone.icon}
          showChange={previousScores ? scores[tone.key] - previousScores[tone.key] : undefined}
        />
      ))}
    </div>
  );
}
