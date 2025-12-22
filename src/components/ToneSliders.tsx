import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ToneScores } from '@/types/tone';
import { RotateCcw } from 'lucide-react';

interface ToneSlidersProps {
  scores: ToneScores;
  onChange: (scores: ToneScores) => void;
  onApply: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export function ToneSliders({ scores, onChange, onApply, onReset, isLoading }: ToneSlidersProps) {
  const sliders = [
    { 
      key: 'passive_agg_score' as keyof ToneScores, 
      label: 'Passive-Aggressive', 
      icon: '😤',
      description: 'Lower = more direct and honest',
      invertedLabel: true,
    },
    { 
      key: 'sarcasm_score' as keyof ToneScores, 
      label: 'Sarcasm', 
      icon: '🙄',
      description: 'Lower = more sincere',
      invertedLabel: true,
    },
    { 
      key: 'empathy_score' as keyof ToneScores, 
      label: 'Empathy', 
      icon: '💚',
      description: 'Higher = more understanding',
      invertedLabel: false,
    },
    { 
      key: 'formality_score' as keyof ToneScores, 
      label: 'Formality', 
      icon: '👔',
      description: 'Adjust for audience',
      invertedLabel: false,
    },
    { 
      key: 'aggression_score' as keyof ToneScores, 
      label: 'Aggression', 
      icon: '🔥',
      description: 'Lower = calmer tone',
      invertedLabel: true,
    },
  ];

  const handleSliderChange = (key: keyof ToneScores, value: number[]) => {
    onChange({ ...scores, [key]: value[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Manual Tone Adjustment</h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        {sliders.map((slider) => (
          <div key={slider.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{slider.icon}</span>
                <span className="text-sm font-medium text-foreground">{slider.label}</span>
              </div>
              <span className="text-sm font-bold text-primary">{scores[slider.key]}%</span>
            </div>
            <Slider
              value={[scores[slider.key]]}
              onValueChange={(value) => handleSliderChange(slider.key, value)}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">{slider.description}</p>
          </div>
        ))}
      </div>

      <Button 
        onClick={onApply} 
        className="w-full" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? 'Rewriting...' : 'Apply Changes & Rewrite'}
      </Button>
    </div>
  );
}
