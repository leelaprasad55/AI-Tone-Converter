import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getBenchmarks, compareToBenchmark } from '@/lib/tone-service';
import { ToneScores, Benchmark } from '@/types/tone';
import { Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BenchmarkComparisonProps {
  userScores: ToneScores;
  className?: string;
}

export function BenchmarkComparison({ userScores, className }: BenchmarkComparisonProps) {
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [comparisons, setComparisons] = useState<{ benchmark: Benchmark; score: number }[]>([]);

  useEffect(() => {
    async function loadBenchmarks() {
      const data = await getBenchmarks();
      setBenchmarks(data);
    }
    loadBenchmarks();
  }, []);

  useEffect(() => {
    if (benchmarks.length > 0) {
      const results = benchmarks.map((benchmark) => ({
        benchmark,
        score: compareToBenchmark(userScores, benchmark),
      }));
      results.sort((a, b) => b.score - a.score);
      setComparisons(results);
    }
  }, [benchmarks, userScores]);

  if (comparisons.length === 0) {
    return null;
  }

  const topMatch = comparisons[0];

  return (
    <Card className={cn('glass-card', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-5 w-5 text-primary" />
          Tone Benchmarking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-3xl">🏆</div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Best Match</p>
            <p className="font-semibold text-foreground">{topMatch.benchmark.communicator_name}</p>
            <p className="text-xs text-muted-foreground">{topMatch.benchmark.description}</p>
          </div>
          <div className="text-2xl font-bold text-primary">{topMatch.score}%</div>
        </div>

        <div className="space-y-3">
          {comparisons.slice(1).map(({ benchmark, score }) => (
            <div key={benchmark.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{benchmark.communicator_name}</span>
                <span className="text-muted-foreground">{score}% match</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Comparison based on empathy, formality, directness, and warmth</span>
        </div>
      </CardContent>
    </Card>
  );
}
