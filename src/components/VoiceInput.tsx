import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export function VoiceInput({ onTranscript, className }: VoiceInputProps) {
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported } = useSpeechRecognition();
  const lastTranscriptRef = useRef('');

  // Send transcript when it changes during listening (real-time)
  useEffect(() => {
    if (transcript && transcript !== lastTranscriptRef.current) {
      onTranscript(transcript);
      lastTranscriptRef.current = transcript;
    }
  }, [transcript, onTranscript]);

  // Reset when listening stops
  useEffect(() => {
    if (!isListening) {
      lastTranscriptRef.current = '';
      resetTranscript();
    }
  }, [isListening, resetTranscript]);

  if (!isSupported) {
    return (
      <Button variant="outline" size="icon" disabled className={className} title="Voice input not supported in this browser">
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant={isListening ? 'destructive' : 'outline'}
      size="icon"
      onClick={isListening ? stopListening : startListening}
      className={cn(isListening && 'animate-pulse', className)}
      title={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
