import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ToneScores } from '@/types/tone';
import { RotateCcw, Loader2 } from 'lucide-react';

interface ToneSlidersProps {
  scores: ToneScores;
  onChange: (scores: ToneScores) => void;
  onApply: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function ToneSliders({ scores, onChange, onApply, onReset, isLoading }: ToneSlidersProps) {
  const sliders = [
    { key: 'passive_agg_score' as keyof ToneScores, label: 'Passive-Aggressive', icon: '😤', invertedLabel: true },
    { key: 'sarcasm_score' as keyof ToneScores, label: 'Sarcasm', icon: '🙄', invertedLabel: true },
    { key: 'aggression_score' as keyof ToneScores, label: 'Aggression', icon: '🔥', invertedLabel: true },
    { key: 'defensiveness_score' as keyof ToneScores, label: 'Defensiveness', icon: '🛡️', invertedLabel: true },
    { key: 'condescension_score' as keyof ToneScores, label: 'Condescension', icon: '👆', invertedLabel: true },
    { key: 'manipulation_score' as keyof ToneScores, label: 'Manipulation', icon: '🎭', invertedLabel: true },
    { key: 'dismissiveness_score' as keyof ToneScores, label: 'Dismissiveness', icon: '✋', invertedLabel: true },
    { key: 'anxiety_score' as keyof ToneScores, label: 'Anxiety', icon: '😰', invertedLabel: true },
    { key: 'empathy_score' as keyof ToneScores, label: 'Empathy', icon: '💚', invertedLabel: false },
    { key: 'formality_score' as keyof ToneScores, label: 'Formality', icon: '👔', invertedLabel: false },
  ];

  const handleSliderChange = (key: keyof ToneScores, value: number[]) => {
    onChange({ ...scores, [key]: value[0] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Manual Tone Adjustment</h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-2 h-8">
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto pr-2">
        {sliders.map((slider) => (
          <div key={slider.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{slider.icon}</span>
                <span className="text-xs font-medium text-foreground">{slider.label}</span>
              </div>
              <span className="text-xs font-bold text-primary">{scores[slider.key] ?? 0}%</span>
            </div>
            <Slider
              value={[scores[slider.key] ?? 0]}
              onValueChange={(value) => handleSliderChange(slider.key, value)}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <Button 
        onClick={onApply} 
        className="w-full" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Rewriting...
          </>
        ) : (
          'Apply Changes & Rewrite'
        )}
      </Button>
    </div>
  );
}