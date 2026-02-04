import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingState } from '@/components/ui/loading';
import { NoApprovalsState, ErrorState } from '@/components/ui/empty-states';
import { StatusBadge, RoleBadge } from '@/components/ui/badges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { fetchPendingApprovals, approveRequest, rejectRequest } from '@/lib/api';
import { Request, RequestType, SignupRequestData, SystemCreationRequestData, SystemPermissionRequestData } from '@/lib/types';
import { getUserById } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Check, X, UserPlus, Server, Key, Clock, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const typeIcons: Record<RequestType, React.ElementType> = {
  signup: UserPlus,
  'system-creation': Server,
  'system-permission': Key,
};

const typeLabels: Record<RequestType, string> = {
  signup: 'Sign-up Request',
  'system-creation': 'System Creation',
  'system-permission': 'System Permission',
};

export default function ApprovalsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadApprovals();
  }, [user]);

  async function loadApprovals() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPendingApprovals();
      setRequests(data);
    } catch (err) {
      setError('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (request: Request) => {
    setProcessingId(request.id);
    try {
      await approveRequest(request.id);
      setRequests(prev => prev.filter(r => r.id !== request.id));
      toast({
        title: 'Request Approved',
        description: `"${request.title}" has been approved.`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to approve request.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) return;
    setProcessingId(selectedRequest.id);
    try {
      await rejectRequest(selectedRequest.id, rejectReason);
      setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
      setShowRejectDialog(false);
      setSelectedRequest(null);
      setRejectReason('');
      toast({
        title: 'Request Rejected',
        description: `"${selectedRequest.title}" has been rejected.`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to reject request.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectDialog = (request: Request) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader title="Approvals" description="Review and action pending requests" />
        <LoadingState message="Loading pending approvals..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <PageHeader title="Approvals" description="Review and action pending requests" />
        <ErrorState message={error} onRetry={loadApprovals} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Approvals"
        description={`${requests.length} pending request${requests.length !== 1 ? 's' : ''} awaiting your review`}
      />

      {requests.length === 0 ? (
        <NoApprovalsState />
      ) : (
        <div className="space-y-4 mt-6">
          {requests.map((request) => {
            const TypeIcon = typeIcons[request.type];
            const requester = getUserById(request.requesterId);
            const isProcessing = processingId === request.id;

            return (
              <Card key={request.id} className="animate-fade-in">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <TypeIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{request.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>{typeLabels[request.type]}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRejectDialog(request)}
                        disabled={isProcessing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? 'Processing...' : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-md p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-medium">{requester?.name}</span>
                    </div>
                    <RequestSummary request={request} />
                  </div>
                  <Button
                    variant="link"
                    className="mt-2 p-0 h-auto text-sm"
                    onClick={() => navigate(`/requests/${request.id}`)}
                  >
                    View full details
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedRequest?.title}".
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
              disabled={!rejectReason.trim() || processingId !== null}
            >
              {processingId ? 'Rejecting...' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RequestSummary({ request }: { request: Request }) {
  if (request.type === 'signup') {
    const data = request.data as SignupRequestData;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Requesting:</span>
        <RoleBadge role={data.requestedRole} />
        {data.teamName && <span className="text-muted-foreground">for {data.teamName}</span>}
      </div>
    );
  }

  if (request.type === 'system-creation') {
    const data = request.data as SystemCreationRequestData;
    return (
      <div className="text-sm">
        <span className="text-muted-foreground">System: </span>
        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{data.systemRef}</code>
        <span className="text-muted-foreground"> ({data.tier})</span>
      </div>
    );
  }

  if (request.type === 'system-permission') {
    const data = request.data as SystemPermissionRequestData;
    return (
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <RoleBadge role={data.requestedRole} />
        <span className="text-muted-foreground">access to</span>
        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{data.systemRef}</code>
      </div>
    );
  }

  return null;
}
