import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, Server } from 'lucide-react';
import { createRequest, fetchSystems } from '@/lib/api';
import { System } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner, LoadingState } from '@/components/ui/loading';
import { TierBadge, LifecycleBadge } from '@/components/ui/badges';

export default function SystemPermissionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    systemRef: '',
    requestedRole: 'developer' as 'pm' | 'developer',
    justification: '',
  });

  useEffect(() => {
    async function loadSystems() {
      try {
        const data = await fetchSystems();
        setSystems(data.filter(s => s.lifecycle !== 'deprecated'));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load systems.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    loadSystems();
  }, []);

  const selectedSystem = systems.find(s => s.ref === formData.systemRef);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.systemRef || !formData.justification.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please select a system and provide justification.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const request = await createRequest({
        type: 'system-permission',
        title: `${formData.requestedRole === 'pm' ? 'PM' : 'Developer'} Access to ${selectedSystem?.name}`,
        description: formData.justification.slice(0, 100),
        data: {
          systemRef: formData.systemRef,
          systemName: selectedSystem?.name || '',
          requestedRole: formData.requestedRole,
          justification: formData.justification,
        },
      });

      toast({
        title: 'Request Submitted',
        description: 'Your permission request has been submitted for approval.',
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

  if (loading) {
    return (
      <div className="page-container">
        <LoadingState message="Loading systems..." />
      </div>
    );
  }

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
        title="System Permission Request"
        description="Request access to a specific system"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Permission Details</CardTitle>
          <CardDescription>
            This request will be reviewed by the System's PM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Select System *</Label>
              <Select
                value={formData.systemRef}
                onValueChange={(value) => setFormData(prev => ({ ...prev, systemRef: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a system..." />
                </SelectTrigger>
                <SelectContent>
                  {systems.map((system) => (
                    <SelectItem key={system.id} value={system.ref}>
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-muted-foreground" />
                        <span>{system.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedSystem && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedSystem.description}
                  </p>
                  <div className="flex gap-2">
                    <TierBadge tier={selectedSystem.tier} />
                    <LifecycleBadge lifecycle={selectedSystem.lifecycle} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Requested Role *</Label>
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
                  ? 'Developer access allows you to contribute to the system.'
                  : 'PM access allows you to manage the system and approve access requests.'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification">Justification *</Label>
              <Textarea
                id="justification"
                placeholder="Explain why you need access to this system..."
                rows={4}
                value={formData.justification}
                onChange={(e) => setFormData(prev => ({ ...prev, justification: e.target.value }))}
              />
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
