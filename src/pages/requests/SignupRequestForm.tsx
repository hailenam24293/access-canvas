import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send } from 'lucide-react';
import { createRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';

export default function SignupRequestForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    requestedRole: 'developer' as 'pm' | 'developer',
    teamName: '',
    justification: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.justification.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a justification for your request.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const request = await createRequest({
        type: 'signup',
        title: `Request ${formData.requestedRole === 'pm' ? 'PM' : 'Developer'} Role`,
        description: formData.justification.slice(0, 100),
        data: {
          requestedRole: formData.requestedRole,
          teamName: formData.teamName,
          justification: formData.justification,
        },
      });

      toast({
        title: 'Request Submitted',
        description: 'Your signup request has been submitted for approval.',
      });

      navigate(`/requests/${request.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/requests/create')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title="Sign-up Request"
        description="Request a role to access platform resources"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>
            This request will be reviewed by a Platform Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Requested Role</Label>
              <RadioGroup
                value={formData.requestedRole}
                onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, requestedRole: value as 'pm' | 'developer' }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="developer" id="developer" />
                  <Label htmlFor="developer" className="font-normal cursor-pointer">
                    Developer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pm" id="pm" />
                  <Label htmlFor="pm" className="font-normal cursor-pointer">
                    Product Manager (PM)
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {formData.requestedRole === 'developer' 
                  ? 'Developers can access systems and contribute to codebases.'
                  : 'PMs can manage systems and approve developer access requests.'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name (Optional)</Label>
              <Input
                id="teamName"
                placeholder="e.g., Payments Squad"
                value={formData.teamName}
                onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification">Justification *</Label>
              <Textarea
                id="justification"
                placeholder="Explain why you need this role and what you plan to work on..."
                rows={4}
                value={formData.justification}
                onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                Provide context to help approvers understand your request
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/requests/my')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
