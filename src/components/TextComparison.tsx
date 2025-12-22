import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface TextComparisonProps {
  original: string;
  rewritten: string;
  changesSummary?: string;
  confidence?: number;
  className?: string;
}

export function TextComparison({ 
  original, 
  rewritten, 
  changesSummary, 
  confidence,
  className 
}: TextComparisonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-sm font-medium text-foreground">Original</span>
          </div>
          <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg min-h-[120px]">
            <p className="text-sm text-foreground whitespace-pre-wrap">{original}</p>
          </div>
        </div>

        {/* Arrow for desktop */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="p-2 bg-primary rounded-full text-primary-foreground">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>

        {/* Rewritten */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm font-medium text-foreground">Diplomatic Rewrite</span>
            {confidence && (
              <span className="ml-auto text-xs text-muted-foreground">
                {confidence}% intent preserved
              </span>
            )}
          </div>
          <div className="p-4 bg-success/5 border border-success/20 rounded-lg min-h-[120px]">
            <p className="text-sm text-foreground whitespace-pre-wrap">{rewritten}</p>
          </div>
        </div>
      </div>

      {changesSummary && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Changes Made
          </p>
          <p className="text-sm text-foreground">{changesSummary}</p>
        </div>
      )}
    </div>
  );
}
