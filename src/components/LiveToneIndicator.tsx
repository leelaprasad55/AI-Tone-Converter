import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

interface LiveToneIndicatorProps {
  text: string;
  className?: string;
}

interface QuickScore {
  label: string;
  score: number;
  color: string;
}

export function LiveToneIndicator({ text, className }: LiveToneIndicatorProps) {
  const [scores, setScores] = useState<QuickScore[]>([]);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!text.trim() || text.length < 10) {
      setScores([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const quickAnalysis = analyzeQuickTone(text);
      setScores(quickAnalysis);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [text]);

  if (scores.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Activity className="h-3 w-3 animate-pulse text-primary" />
        <span>Live:</span>
      </div>
      {scores.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 text-xs"
        >
          <span className="text-muted-foreground">{item.label}</span>
          <span className={cn('font-semibold', item.color)}>
            {item.score}%
          </span>
        </div>
      ))}
    </div>
  );
}

// Quick client-side tone analysis using heuristics
function analyzeQuickTone(text: string): QuickScore[] {
  const lowerText = text.toLowerCase();
  const words = text.split(/\s+/).length;
  
  // Passive-aggressive indicators
  const passiveAggPatterns = [
    /\bfine\b/gi, /\bwhatever\b/gi, /\bif you say so\b/gi,
    /\bI guess\b/gi, /\bno worries\b/gi, /\bsure\.\.\./gi,
    /\bI'm not mad\b/gi, /\bdo what you want\b/gi,
    /\bas per my last\b/gi, /\bper our conversation\b/gi,
    /\bjust saying\b/gi, /\bI mean\.\.\./gi
  ];
  const passiveAggCount = passiveAggPatterns.reduce(
    (count, pattern) => count + (text.match(pattern) || []).length, 0
  );
  const passiveAggScore = Math.min(100, Math.round((passiveAggCount / Math.max(1, words)) * 500 + passiveAggCount * 15));

  // Aggressive indicators
  const aggressivePatterns = [
    /!/g, /\bstop\b/gi, /\bdon't\b/gi, /\bnever\b/gi,
    /\balways\b/gi, /\byou\s+(never|always)\b/gi,
    /\bwrong\b/gi, /\bterrible\b/gi, /\bstupid\b/gi,
    /\bidiot\b/gi, /\bshut up\b/gi
  ];
  const aggressiveCount = aggressivePatterns.reduce(
    (count, pattern) => count + (text.match(pattern) || []).length, 0
  );
  const aggressionScore = Math.min(100, Math.round((aggressiveCount / Math.max(1, words)) * 300 + aggressiveCount * 10));

  // Empathy indicators
  const empathyPatterns = [
    /\bunderstand\b/gi, /\bsorry\b/gi, /\bthank you\b/gi,
    /\bappreciate\b/gi, /\bhelp\b/gi, /\bplease\b/gi,
    /\bhope\b/gi, /\bfeel\b/gi, /\bsupport\b/gi,
    /\bconsider\b/gi
  ];
  const empathyCount = empathyPatterns.reduce(
    (count, pattern) => count + (text.match(pattern) || []).length, 0
  );
  const empathyScore = Math.min(100, Math.round((empathyCount / Math.max(1, words)) * 400 + empathyCount * 12));

  // Formality score
  const informalPatterns = [
    /\blol\b/gi, /\bomg\b/gi, /\bbtw\b/gi, /\bgonna\b/gi,
    /\bwanna\b/gi, /\bcool\b/gi, /\bawesome\b/gi,
    /\bhey\b/gi, /\byeah\b/gi, /\bnope\b/gi
  ];
  const formalPatterns = [
    /\bregards\b/gi, /\bsincerely\b/gi, /\brespectfully\b/gi,
    /\bkindly\b/gi, /\bfurthermore\b/gi, /\bhowever\b/gi,
    /\btherefore\b/gi, /\baccordingly\b/gi
  ];
  const informalCount = informalPatterns.reduce(
    (count, pattern) => count + (text.match(pattern) || []).length, 0
  );
  const formalCount = formalPatterns.reduce(
    (count, pattern) => count + (text.match(pattern) || []).length, 0
  );
  const formalityScore = Math.min(100, Math.max(0, 50 + formalCount * 15 - informalCount * 20));

  const results: QuickScore[] = [];

  if (passiveAggScore > 20) {
    results.push({
      label: 'Passive-Agg',
      score: passiveAggScore,
      color: passiveAggScore > 50 ? 'text-destructive' : 'text-warning'
    });
  }

  if (aggressionScore > 15) {
    results.push({
      label: 'Aggression',
      score: aggressionScore,
      color: aggressionScore > 40 ? 'text-destructive' : 'text-warning'
    });
  }

  if (empathyScore > 10) {
    results.push({
      label: 'Empathy',
      score: empathyScore,
      color: 'text-success'
    });
  }

  results.push({
    label: 'Formality',
    score: formalityScore,
    color: 'text-primary'
  });

  return results.slice(0, 4);
}
