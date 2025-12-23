import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Wand2, SlidersHorizontal, Loader2, LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { ToneBreakdown } from '@/components/ToneBreakdown';
import { ToneSliders } from '@/components/ToneSliders';
import { AnalysisSummary } from '@/components/SeverityBadge';
import { TextComparison } from '@/components/TextComparison';
import { BenchmarkComparison } from '@/components/BenchmarkComparison';
import { ContextualMemory } from '@/components/ContextualMemory';
import { LanguageSelector } from '@/components/LanguageSelector';
import { AudienceSelector } from '@/components/AudienceSelector';
import { VoiceInput } from '@/components/VoiceInput';
import { IntegrationButtons } from '@/components/IntegrationButtons';
import { CollaborationPanel } from '@/components/CollaborationPanel';

import { analyzeTone, rewriteText, saveToneAnalysis } from '@/lib/tone-service';
import type { ToneAnalysis, RewriteResult, ToneScores, Language, Audience, ContentMedium } from '@/types/tone';

const Index = () => {
  const [inputText, setInputText] = useState('');
  const [analysis, setAnalysis] = useState<ToneAnalysis | null>(null);
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [language, setLanguage] = useState<Language>('EN');
  const [audience, setAudience] = useState<Audience>('general');
  const [contentMedium] = useState<ContentMedium>('email');
  const [manualScores, setManualScores] = useState<ToneScores | null>(null);
  const [refreshMemory, setRefreshMemory] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate('/auth');
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) {
        navigate('/auth');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Logged out' });
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast({ title: 'Please enter some text to analyze', variant: 'destructive' });
      return;
    }
    setIsAnalyzing(true);
    setAnalysis(null);
    setRewriteResult(null);
    try {
      const result = await analyzeTone({ text: inputText, language, audience, contentMedium });
      setAnalysis(result);
      setManualScores(result);
      await saveToneAnalysis(inputText, result, language, audience, contentMedium);
      setRefreshMemory(prev => prev + 1);
      toast({ title: 'Analysis complete!' });
    } catch (error) {
      toast({ title: 'Analysis failed', description: error instanceof Error ? error.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAutoRewrite = async () => {
    if (!analysis) return;
    setIsRewriting(true);
    try {
      const result = await rewriteText({ text: inputText, language, audience, contentMedium });
      setRewriteResult(result);
      toast({ title: 'Rewrite complete!' });
    } catch (error) {
      toast({ title: 'Rewrite failed', description: error instanceof Error ? error.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setIsRewriting(false);
    }
  };

  const handleManualRewrite = async () => {
    if (!manualScores) return;
    setIsRewriting(true);
    try {
      const result = await rewriteText({ text: inputText, language, audience, contentMedium, toneAdjustments: manualScores });
      setRewriteResult(result);
      toast({ title: 'Manual rewrite complete!' });
    } catch (error) {
      toast({ title: 'Rewrite failed', variant: 'destructive' });
    } finally {
      setIsRewriting(false);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInputText(prev => prev + (prev ? ' ' : '') + text);
    toast({ title: 'Voice input captured!' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">AI Tone Corrector</h1>
                <p className="text-xs text-muted-foreground">Diplomatic Email Rewrite Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector selected={language} onChange={setLanguage} />
              {user ? (
                <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate('/auth')} className="gap-2">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Card */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Enter Your Text</span>
                  <VoiceInput onTranscript={handleVoiceTranscript} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your email, message, or text here... (e.g., 'Fine, whatever you say.')"
                  className="min-h-[120px] resize-none"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <AudienceSelector selected={audience} onChange={setAudience} className="flex-1" />
                  <Button onClick={handleAnalyze} disabled={isAnalyzing} className="gap-2" size="lg">
                    {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Analyze Tone
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysis && (
              <Card className="glass-card animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle>Tone Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AnalysisSummary analysis={analysis} />
                  <Tabs value={mode} onValueChange={(v) => setMode(v as 'auto' | 'manual')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="auto" className="gap-2"><Wand2 className="h-4 w-4" />Auto Fix</TabsTrigger>
                      <TabsTrigger value="manual" className="gap-2"><SlidersHorizontal className="h-4 w-4" />Manual</TabsTrigger>
                    </TabsList>
                    <TabsContent value="auto" className="space-y-4 pt-4">
                      <ToneBreakdown scores={analysis} previousScores={rewriteResult?.new_scores} />
                      <Button onClick={handleAutoRewrite} disabled={isRewriting} className="w-full gap-2" size="lg">
                        {isRewriting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        Fix My Tone Automatically
                      </Button>
                    </TabsContent>
                    <TabsContent value="manual" className="pt-4">
                      {manualScores && (
                        <ToneSliders
                          scores={manualScores}
                          onChange={setManualScores}
                          onApply={handleManualRewrite}
                          onReset={() => setManualScores(analysis)}
                          isLoading={isRewriting}
                        />
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Rewrite Results */}
            {rewriteResult && (
              <Card className="glass-card animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle>Diplomatic Rewrite</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TextComparison
                    original={inputText}
                    rewritten={rewriteResult.rewritten_text}
                    changesSummary={rewriteResult.changes_summary}
                    confidence={rewriteResult.intent_preserved_confidence}
                  />
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    <IntegrationButtons rewrittenText={rewriteResult.rewritten_text} />
                    <CollaborationPanel rewrittenText={rewriteResult.rewritten_text} originalText={inputText} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ContextualMemory onRefresh={() => refreshMemory} />
            {rewriteResult && <BenchmarkComparison userScores={rewriteResult.new_scores} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
