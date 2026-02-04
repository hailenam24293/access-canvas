import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send } from 'lucide-react';
import { createRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';

export default function SystemCreationForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    systemRef: '',
    systemName: '',
    systemDescription: '',
    tier: 'tier-2' as 'tier-1' | 'tier-2' | 'tier-3',
    lifecycle: 'development' as 'production' | 'staging' | 'development' | 'deprecated',
    tags: '',
  });

  // Auto-generate ref from name
  useEffect(() => {
    const ref = formData.systemName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 30);
    setFormData(prev => ({ ...prev, systemRef: ref }));
  }, [formData.systemName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.systemName.trim() || !formData.systemDescription.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const request = await createRequest({
        type: 'system-creation',
        title: `Create ${formData.systemName}`,
        description: formData.systemDescription.slice(0, 100),
        data: {
          systemRef: formData.systemRef,
          systemName: formData.systemName,
          systemDescription: formData.systemDescription,
          tier: formData.tier,
          lifecycle: formData.lifecycle,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        },
      });

      toast({
        title: 'Request Submitted',
        description: 'Your system creation request has been submitted for approval.',
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
        title="System Creation Request"
        description="Register a new system in the catalog"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>System Details</CardTitle>
          <CardDescription>
            This request will be reviewed by a Platform Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name *</Label>
                <Input
                  id="systemName"
                  placeholder="e.g., Payment Gateway"
                  value={formData.systemName}
                  onChange={(e) => setFormData(prev => ({ ...prev, systemName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemRef">System Ref (auto-generated)</Label>
                <Input
                  id="systemRef"
                  value={formData.systemRef}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what this system does, its purpose, and main responsibilities..."
                rows={3}
                value={formData.systemDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, systemDescription: e.target.value }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tier</Label>
                <Select
                  value={formData.tier}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tier: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tier-1">Tier 1 (Critical)</SelectItem>
                    <SelectItem value="tier-2">Tier 2 (Important)</SelectItem>
                    <SelectItem value="tier-3">Tier 3 (Standard)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Tier 1 systems require higher approval thresholds
                </p>
              </div>

              <div className="space-y-2">
                <Label>Lifecycle</Label>
                <Select
                  value={formData.lifecycle}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, lifecycle: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                placeholder="e.g., payments, critical, pci"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
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
