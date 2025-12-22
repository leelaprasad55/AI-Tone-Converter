import { cn } from '@/lib/utils';
import { ToneAnalysis } from '@/types/tone';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface SeverityBadgeProps {
  severity: ToneAnalysis['severity'];
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = {
    high: {
      icon: AlertTriangle,
      label: 'High Severity',
      className: 'tone-high',
    },
    medium: {
      icon: Info,
      label: 'Medium Severity',
      className: 'tone-medium',
    },
    low: {
      icon: CheckCircle,
      label: 'Low Severity',
      className: 'tone-low',
    },
  };

  const { icon: Icon, label, className: severityClass } = config[severity];

  return (
    <div className={cn('tone-indicator flex items-center gap-1.5', severityClass, className)}>
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}

interface AnalysisSummaryProps {
  analysis: ToneAnalysis;
  className?: string;
}

export function AnalysisSummary({ analysis, className }: AnalysisSummaryProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <SeverityBadge severity={analysis.severity} />
        <span className="text-sm text-muted-foreground">
          {analysis.emotion_flags.length} emotion{analysis.emotion_flags.length !== 1 ? 's' : ''} detected
        </span>
      </div>

      <p className="text-sm text-foreground leading-relaxed">
        {analysis.analysis_summary}
      </p>

      {analysis.emotion_flags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {analysis.emotion_flags.map((flag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
            >
              {flag}
            </span>
          ))}
        </div>
      )}

      {analysis.key_phrases.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Flagged Phrases
          </p>
          <div className="space-y-1">
            {analysis.key_phrases.map((phrase, index) => (
              <p
                key={index}
                className="text-sm text-destructive bg-destructive/10 px-3 py-1.5 rounded-md font-mono"
              >
                "{phrase}"
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
