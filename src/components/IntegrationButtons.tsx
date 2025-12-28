import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Share2, FileDown, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface IntegrationButtonsProps {
  rewrittenText: string;
  originalText?: string;
  className?: string;
}

export function IntegrationButtons({ rewrittenText, originalText, className }: IntegrationButtonsProps) {
  const [gmailOpen, setGmailOpen] = useState(false);
  const [slackOpen, setSlackOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedFormatted, setCopiedFormatted] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rewrittenText);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyFormatted = async () => {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        ${rewrittenText.split('\n').map(p => `<p style="margin: 0 0 10px 0;">${p}</p>`).join('')}
      </div>
    `;
    
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([rewrittenText], { type: 'text/plain' }),
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
        }),
      ]);
      setCopiedFormatted(true);
      toast({ title: 'Copied formatted text for email!' });
      setTimeout(() => setCopiedFormatted(false), 2000);
    } catch {
      await navigator.clipboard.writeText(rewrittenText);
      setCopiedFormatted(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setCopiedFormatted(false), 2000);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Tone Corrector - Diplomatic Rewrite', margin, y);
    y += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
    y += 15;

    if (originalText) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('Original Text:', margin, y);
      y += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80);
      const originalLines = doc.splitTextToSize(originalText, maxWidth);
      doc.text(originalLines, margin, y);
      y += originalLines.length * 6 + 15;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Diplomatic Rewrite:', margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    const rewrittenLines = doc.splitTextToSize(rewrittenText, maxWidth);
    doc.text(rewrittenLines, margin, y);

    doc.save('diplomatic-rewrite.pdf');
    toast({ title: 'PDF exported successfully!' });
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
        <Button variant="outline" size="sm" onClick={handleCopyFormatted} className="gap-2">
          {copiedFormatted ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
          {copiedFormatted ? 'Copied!' : 'Copy for Email'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={() => setGmailOpen(true)} className="gap-2">
          <Mail className="h-4 w-4" />
          Gmail
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSlackOpen(true)} className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Slack
        </Button>
      </div>

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