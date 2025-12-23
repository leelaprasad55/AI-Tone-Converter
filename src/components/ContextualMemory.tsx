import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecentAnalyses } from '@/lib/tone-service';
import { Clock, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextualMemoryProps {
  className?: string;
  onRefresh?: () => void;
}

export function ContextualMemory({ className, onRefresh }: ContextualMemoryProps) {
  const [patterns, setPatterns] = useState<{
    avgPassiveAgg: number;
    avgEmpathy: number;
    trend: 'improving' | 'declining' | 'stable';
    totalAnalyses: number;
  } | null>(null);

  useEffect(() => {
    loadAnalyses();
  }, [onRefresh]);

  async function loadAnalyses() {
    const data = await getRecentAnalyses(10);

    if (data.length >= 2) {
      const avgPassiveAgg = Math.round(
        data.reduce((sum: number, a: any) => sum + a.passive_agg_score, 0) / data.length
      );
      const avgEmpathy = Math.round(
        data.reduce((sum: number, a: any) => sum + a.empathy_score, 0) / data.length
      );

      const recentAvg = (data[0].passive_agg_score + data[0].aggression_score) / 2;
      const olderAvg = (data[data.length - 1].passive_agg_score + data[data.length - 1].aggression_score) / 2;

      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      if (recentAvg < olderAvg - 10) trend = 'improving';
      else if (recentAvg > olderAvg + 10) trend = 'declining';

      setPatterns({ avgPassiveAgg, avgEmpathy, trend, totalAnalyses: data.length });
    } else if (data.length === 1) {
      setPatterns({
        avgPassiveAgg: data[0].passive_agg_score,
        avgEmpathy: data[0].empathy_score,
        trend: 'stable',
        totalAnalyses: 1
      });
    }
  }

  if (!patterns) {
    return (
      <Card className={cn('glass-card', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Your Tone Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Analyze some text to build your tone profile
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('glass-card', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-primary" />
          Your Tone Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Avg. Passive-Agg</p>
            <p className="text-xl font-bold text-foreground">{patterns.avgPassiveAgg}%</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Avg. Empathy</p>
            <p className="text-xl font-bold text-foreground">{patterns.avgEmpathy}%</p>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Trend</p>
            <div className="flex items-center justify-center gap-1">
              {patterns.trend === 'improving' ? (
                <>
                  <TrendingDown className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Better</span>
                </>
              ) : patterns.trend === 'declining' ? (
                <>
                  <TrendingUp className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Watch</span>
                </>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">Stable</span>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Based on {patterns.totalAnalyses} recent {patterns.totalAnalyses === 1 ? 'analysis' : 'analyses'}
        </p>
      </CardContent>
    </Card>
  );
}