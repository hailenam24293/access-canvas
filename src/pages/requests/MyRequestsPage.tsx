import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingState, SkeletonRow } from '@/components/ui/loading';
import { NoRequestsState, ErrorState } from '@/components/ui/empty-states';
import { StatusBadge } from '@/components/ui/badges';
import { fetchMyRequests } from '@/lib/api';
import { Request, RequestType, RequestStatus } from '@/lib/types';
import { Plus, Search, ExternalLink, Clock, UserPlus, Server, Key } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const typeIcons: Record<RequestType, React.ElementType> = {
  signup: UserPlus,
  'system-creation': Server,
  'system-permission': Key,
};

const typeLabels: Record<RequestType, string> = {
  signup: 'Sign-up',
  'system-creation': 'System Creation',
  'system-permission': 'System Permission',
};

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  }

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader title="My Requests" description="Track your submitted requests" />
        <LoadingState message="Loading your requests..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <PageHeader title="My Requests" description="Track your submitted requests" />
        <ErrorState message={error} onRetry={loadRequests} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="My Requests"
        description="Track your submitted requests"
        actions={
          <Button onClick={() => navigate('/requests/create')}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        }
      />

      {requests.length === 0 ? (
        <NoRequestsState onCreateRequest={() => navigate('/requests/create')} />
      ) : (
        <>
          {/* Filters */}
          <div className="flex gap-3 mb-6 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="content-card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      No requests match your filters
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => {
                    const TypeIcon = typeIcons[request.type];
                    return (
                      <tr
                        key={request.id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/requests/${request.id}`)}
                      >
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                              <TypeIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{request.title}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {request.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-sm">{typeLabels[request.type]}</span>
                        </td>
                        <td>
                          <StatusBadge status={request.status} />
                        </td>
                        <td>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                          </div>
                        </td>
                        <td>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
