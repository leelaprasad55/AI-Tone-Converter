import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Send, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollaborationPanelProps {
  rewrittenText: string;
  originalText: string;
  className?: string;
}

export function CollaborationPanel({ rewrittenText, originalText, className }: CollaborationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [teamMembers] = useState([
    { id: 1, name: 'Sarah Chen', initials: 'SC', status: 'online' },
    { id: 2, name: 'Mike Johnson', initials: 'MJ', status: 'away' },
    { id: 3, name: 'Lisa Park', initials: 'LP', status: 'online' },
  ]);
  const [comments, setComments] = useState<{ name: string; text: string; time: string }[]>([]);
  const { toast } = useToast();

  const handleShare = () => {
    setComments([
      ...comments,
      { name: 'You', text: comment || 'Please review this rewrite', time: 'Just now' }
    ]);
    setComment('');
    toast({
      title: 'Shared with Team',
      description: 'Your team has been notified about this review request',
    });
  };

  return (
    <div className={className}>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="gap-2">
        <Users className="h-4 w-4" />
        Share with Team
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Collaboration
            </DialogTitle>
            <DialogDescription>
              Share this rewrite with your team for review and feedback
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Team Members */}
            <div className="space-y-2">
              <Label>Team Members</Label>
              <div className="flex gap-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-muted ${
                        member.status === 'online' ? 'bg-success' : 'bg-warning'
                      }`} />
                    </div>
                    <span className="text-sm font-medium text-foreground">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-destructive">Original</Label>
                <div className="p-3 bg-destructive/10 rounded-lg text-sm max-h-24 overflow-y-auto border border-destructive/20">
                  {originalText}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-success">Rewritten</Label>
                <div className="p-3 bg-success/10 rounded-lg text-sm max-h-24 overflow-y-auto border border-success/20">
                  {rewrittenText}
                </div>
              </div>
            </div>

            {/* Comments */}
            {comments.length > 0 && (
              <div className="space-y-2">
                <Label>Comments</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {comments.map((c, i) => (
                    <div key={i} className="flex gap-2 p-2 bg-secondary/50 rounded-lg">
                      <MessageCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{c.name}</span>
                          <span className="text-xs text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">Add a Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ask for feedback or explain your changes..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
            <Button onClick={handleShare} className="gap-2">
              <Send className="h-4 w-4" />
              Share for Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
