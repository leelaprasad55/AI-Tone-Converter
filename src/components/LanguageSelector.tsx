import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Language, LANGUAGES } from '@/types/tone';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  selected: Language;
  onChange: (language: Language) => void;
  className?: string;
}

export function LanguageSelector({ selected, onChange, className }: LanguageSelectorProps) {
  const selectedLang = LANGUAGES.find(l => l.value === selected);

  return (
    <Select value={selected} onValueChange={(value) => onChange(value as Language)}>
      <SelectTrigger className={cn('w-[180px]', className)}>
        <SelectValue>
          {selectedLang && (
            <span className="flex items-center gap-2">
              <span>{selectedLang.flag}</span>
              <span>{selectedLang.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
