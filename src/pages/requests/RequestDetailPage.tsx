import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingState } from '@/components/ui/loading';
import { ErrorState } from '@/components/ui/empty-states';
import { StatusBadge, RoleBadge, TierBadge, LifecycleBadge } from '@/components/ui/badges';
import { fetchRequest, approveRequest, rejectRequest, canApproveRequest } from '@/lib/api';
import { Request, SignupRequestData, SystemCreationRequestData, SystemPermissionRequestData } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Check, X, User, Clock, Shield, Server, Info } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { getUserById } from '@/lib/mock-data';

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    loadRequest();
  }, [id]);

  async function loadRequest() {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRequest(id);
      if (!data) {
        setError('Request not found');
      } else {
        setRequest(data);
      }
    } catch (err) {
      setError('Failed to load request');
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async () => {
    if (!request) return;
    setIsApproving(true);
    try {
      const updated = await approveRequest(request.id);
      setRequest(updated);
      toast({
        title: 'Request Approved',
        description: 'The request has been approved and role bindings have been created.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to approve request.',
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!request || !rejectReason.trim()) return;
    setIsRejecting(true);
    try {
      const updated = await rejectRequest(request.id, rejectReason);
      setRequest(updated);
      setShowRejectDialog(false);
      toast({
        title: 'Request Rejected',
        description: 'The request has been rejected.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to reject request.',
        variant: 'destructive',
      });
    } finally {
      setIsRejecting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingState message="Loading request details..." />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="page-container">
        <ErrorState message={error || 'Request not found'} onRetry={loadRequest} />
      </div>
    );
  }

  const requester = getUserById(request.requesterId);
  const approver = request.approverId ? getUserById(request.approverId) : null;
  const canApprove = user && request.status === 'pending' && canApproveRequest(request, user);

  return (
    <div className="page-container max-w-3xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <PageHeader
        title={request.title}
        actions={
          canApprove ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={handleApprove} disabled={isApproving}>
                <Check className="mr-2 h-4 w-4" />
                {isApproving ? 'Approving...' : 'Approve'}
              </Button>
            </div>
          ) : null
        }
      />

      {/* Status Banner */}
      <div className="flex items-center gap-4 mt-4 mb-6">
        <StatusBadge status={request.status} />
        <span className="text-sm text-muted-foreground">
          Submitted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Request Details */}
      <div className="space-y-4">
        {/* Requester Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Requester</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{requester?.name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">{requester?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Type-specific Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Request Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {request.type === 'signup' && <SignupDetails data={request.data as SignupRequestData} />}
            {request.type === 'system-creation' && <SystemCreationDetails data={request.data as SystemCreationRequestData} />}
            {request.type === 'system-permission' && <SystemPermissionDetails data={request.data as SystemPermissionRequestData} />}
          </CardContent>
        </Card>

        {/* Approval Info (if resolved) */}
        {(request.status === 'approved' || request.status === 'rejected') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {request.status === 'approved' ? 'Approval' : 'Rejection'} Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approver && (
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">{approver.name}</span>
                      {request.status === 'approved' ? ' approved' : ' rejected'} this request
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(request.approvedAt || request.rejectedAt || ''), 'PPpp')}
                  </span>
                </div>
                {request.rejectionReason && (
                  <div className="mt-3 p-3 bg-destructive/10 rounded-md">
                    <p className="text-sm font-medium text-destructive mb-1">Rejection Reason:</p>
                    <p className="text-sm">{request.rejectionReason}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* What happens on approval */}
        {request.status === 'pending' && (
          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4" />
                What happens on approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                {request.type === 'signup' && (
                  <>
                    <li>• User will be assigned the requested platform role</li>
                    <li>• User can then request access to specific systems</li>
                  </>
                )}
                {request.type === 'system-creation' && (
                  <>
                    <li>• New system will be added to the catalog</li>
                    <li>• Requester becomes the system owner</li>
                  </>
                )}
                {request.type === 'system-permission' && (
                  <>
                    <li>• Role binding will be created for the user/system</li>
                    <li>• CMDB relationship will be established</li>
                    <li>• User will gain access to system resources</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectReason.trim() || isRejecting}
            >
              {isRejecting ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SignupDetails({ data }: { data: SignupRequestData }) {
  return (
    <>
      <div>
        <p className="text-sm font-medium mb-1">Requested Role</p>
        <RoleBadge role={data.requestedRole} />
      </div>
      {data.teamName && (
        <div>
          <p className="text-sm font-medium mb-1">Team</p>
          <p className="text-sm text-muted-foreground">{data.teamName}</p>
        </div>
      )}
      <div>
        <p className="text-sm font-medium mb-1">Justification</p>
        <p className="text-sm text-muted-foreground">{data.justification}</p>
      </div>
    </>
  );
}

function SystemCreationDetails({ data }: { data: SystemCreationRequestData }) {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium mb-1">System Name</p>
          <p className="text-sm text-muted-foreground">{data.systemName}</p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">System Ref</p>
          <code className="text-sm bg-muted px-2 py-0.5 rounded">{data.systemRef}</code>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Description</p>
        <p className="text-sm text-muted-foreground">{data.systemDescription}</p>
      </div>
      <div className="flex gap-4">
        <div>
          <p className="text-sm font-medium mb-1">Tier</p>
          <TierBadge tier={data.tier} />
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Lifecycle</p>
          <LifecycleBadge lifecycle={data.lifecycle} />
        </div>
      </div>
      {data.tags.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-1">Tags</p>
          <div className="flex gap-1 flex-wrap">
            {data.tags.map(tag => (
              <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function SystemPermissionDetails({ data }: { data: SystemPermissionRequestData }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
          <Server className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">{data.systemName}</p>
          <code className="text-xs text-muted-foreground">{data.systemRef}</code>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Requested Role</p>
        <RoleBadge role={data.requestedRole} />
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Justification</p>
        <p className="text-sm text-muted-foreground">{data.justification}</p>
      </div>
    </>
  );
}
