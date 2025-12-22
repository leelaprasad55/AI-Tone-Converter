import { Button } from '@/components/ui/button';
import { Audience, AUDIENCES } from '@/types/tone';
import { cn } from '@/lib/utils';

interface AudienceSelectorProps {
  selected: Audience;
  onChange: (audience: Audience) => void;
  className?: string;
}

export function AudienceSelector({ selected, onChange, className }: AudienceSelectorProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {AUDIENCES.map((audience) => (
        <Button
          key={audience.value}
          variant={selected === audience.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(audience.value)}
          className="gap-1.5"
        >
          <span>{audience.icon}</span>
          <span>{audience.label}</span>
        </Button>
      ))}
    </div>
  );
}
