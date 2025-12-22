import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Share2, FileText, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IntegrationButtonsProps {
  rewrittenText: string;
  className?: string;
}

export function IntegrationButtons({ rewrittenText, className }: IntegrationButtonsProps) {
  const [gmailOpen, setGmailOpen] = useState(false);
  const [slackOpen, setSlackOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rewrittenText);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGmailSend = () => {
    toast({ 
      title: 'Email Draft Created', 
      description: 'Your diplomatic email has been saved as a draft (demo mode)' 
    });
    setGmailOpen(false);
  };

  const handleSlackSend = () => {
    toast({ 
      title: 'Posted to Slack', 
      description: 'Your message has been shared with your team (demo mode)' 
    });
    setSlackOpen(false);
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setGmailOpen(true)} className="gap-2">
          <Mail className="h-4 w-4" />
          Gmail Draft
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSlackOpen(true)} className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Slack
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Gmail Dialog */}
      <Dialog open={gmailOpen} onOpenChange={setGmailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Create Gmail Draft
            </DialogTitle>
            <DialogDescription>
              Your diplomatic rewrite will be saved as an email draft
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input id="to" placeholder="recipient@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter subject" />
            </div>
            <div className="space-y-2">
              <Label>Message Preview</Label>
              <div className="p-3 bg-muted rounded-lg text-sm max-h-32 overflow-y-auto">
                {rewrittenText}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGmailOpen(false)}>Cancel</Button>
            <Button onClick={handleGmailSend} className="gap-2">
              <Mail className="h-4 w-4" />
              Save Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Slack Dialog */}
      <Dialog open={slackOpen} onOpenChange={setSlackOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Share to Slack
            </DialogTitle>
            <DialogDescription>
              Post your diplomatic message to a Slack channel
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Input id="channel" placeholder="#general" defaultValue="#team-communications" />
            </div>
            <div className="space-y-2">
              <Label>Message Preview</Label>
              <div className="p-3 bg-muted rounded-lg text-sm max-h-32 overflow-y-auto">
                {rewrittenText}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSlackOpen(false)}>Cancel</Button>
            <Button onClick={handleSlackSend} className="gap-2">
              <Share2 className="h-4 w-4" />
              Post to Slack
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
