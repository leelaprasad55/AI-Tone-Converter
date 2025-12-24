import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

type AuthView = 'login' | 'signup' | 'forgot-password' | 'reset-sent';

export default function Auth() {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: 'Validation Error', description: err.errors[0].message, variant: 'destructive' });
        setLoading(false);
        return;
      }
    }

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Welcome back!' });
      } else if (view === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` }
        });
        if (error) {
          if (error.message.includes('already registered')) {
            toast({ title: 'Account exists', description: 'Please login instead', variant: 'destructive' });
          } else {
            throw error;
          }
        } else {
          toast({ title: 'Account created!', description: 'You can now use the app.' });
        }
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      emailSchema.parse(email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: 'Validation Error', description: err.errors[0].message, variant: 'destructive' });
        setLoading(false);
        return;
      }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      if (error) throw error;
      setView('reset-sent');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (view === 'reset-sent') {
      return (
        <div className="space-y-4 text-center">
          <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Check your email</h3>
            <p className="text-sm text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => setView('login')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Button>
        </div>
      );
    }

    if (view === 'forgot-password') {
      return (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Send Reset Link
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full gap-2"
            onClick={() => setView('login')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Button>
        </form>
      );
    }

    return (
      <>
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {view === 'login' && (
                <button
                  type="button"
                  onClick={() => setView('forgot-password')}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {view === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {view === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
            className="text-primary hover:underline font-medium"
          >
            {view === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </>
    );
  };

  const getTitle = () => {
    switch (view) {
      case 'forgot-password': return 'Reset Password';
      case 'reset-sent': return 'Email Sent';
      case 'signup': return 'Create Account';
      default: return 'Welcome Back';
    }
  };

  const getDescription = () => {
    switch (view) {
      case 'forgot-password': return 'Enter your email to receive a reset link';
      case 'reset-sent': return '';
      case 'signup': return 'Create an account to get started';
      default: return 'Sign in to access your account';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl gradient-text">{getTitle()}</CardTitle>
          {getDescription() && (
            <CardDescription>{getDescription()}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
