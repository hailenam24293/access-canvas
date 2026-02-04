import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingState, SkeletonRow } from '@/components/ui/loading';
import { EmptyState, ErrorState } from '@/components/ui/empty-states';
import { fetchAuditLog } from '@/lib/api';
import { AuditLogEntry } from '@/lib/types';
import { 
  Search, ScrollText, Check, X, Plus, Shield, Server, Link,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const actionConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  role_binding_created: { icon: Plus, label: 'Role Binding Created', color: 'text-green-600' },
  role_binding_deleted: { icon: X, label: 'Role Binding Deleted', color: 'text-red-600' },
  request_approved: { icon: Check, label: 'Request Approved', color: 'text-green-600' },
  request_rejected: { icon: X, label: 'Request Rejected', color: 'text-red-600' },
  system_created: { icon: Server, label: 'System Created', color: 'text-blue-600' },
  cmdb_relationship_created: { icon: Link, label: 'CMDB Relationship Created', color: 'text-purple-600' },
};

export default function AuditLogPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAuditLog();
  }, []);

  async function loadAuditLog() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditLog(100);
      setEntries(data);
    } catch (err) {
      setError('Failed to load audit log');
    } finally {
      setLoading(false);
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredEntries = entries.filter(e => {
    const matchesSearch = 
      e.actorName.toLowerCase().includes(search.toLowerCase()) ||
      e.targetName.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'all' || e.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const uniqueActions = [...new Set(entries.map(e => e.action))];

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader title="Audit Log" description="Activity history and compliance trail" />
        <LoadingState message="Loading audit log..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <PageHeader title="Audit Log" description="Activity history and compliance trail" />
        <ErrorState message={error} onRetry={loadAuditLog} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Audit Log"
        description={`${entries.length} events recorded`}
      />

      {entries.length === 0 ? (
        <EmptyState
          icon={<ScrollText className="h-12 w-12" />}
          title="No audit entries"
          description="Activity will be logged here as changes are made."
        />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6 mt-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by actor or target..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>
                    {actionConfig[action]?.label || action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No entries match your filters
              </div>
            ) : (
              filteredEntries.map((entry) => {
                const config = actionConfig[entry.action] || { 
                  icon: Shield, 
                  label: entry.action, 
                  color: 'text-muted-foreground' 
                };
                const Icon = config.icon;
                const isExpanded = expandedEntries.has(entry.id);

                return (
                  <div
                    key={entry.id}
                    className="content-card overflow-hidden animate-fade-in"
                  >
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="w-full p-4 flex items-start gap-4 text-left hover:bg-muted/30 transition-colors"
                    >
                      {/* Icon */}
                      <div className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                        'bg-muted'
                      )}>
                        <Icon className={cn('h-4 w-4', config.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-medium">{entry.actorName}</span>
                            <span className="text-muted-foreground"> {config.label.toLowerCase()}: </span>
                            <span className="font-medium">{entry.targetName}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(entry.timestamp), 'PPpp')}
                        </p>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-0 ml-12 border-t mt-2 pt-3">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          Details
                        </h4>
                        <div className="bg-muted/50 rounded-md p-3">
                          <dl className="space-y-1 text-sm">
                            <div className="flex gap-2">
                              <dt className="text-muted-foreground w-24 shrink-0">Action:</dt>
                              <dd className="font-mono text-xs">{entry.action}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="text-muted-foreground w-24 shrink-0">Actor ID:</dt>
                              <dd className="font-mono text-xs">{entry.actorId}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="text-muted-foreground w-24 shrink-0">Target Type:</dt>
                              <dd className="font-mono text-xs">{entry.targetType}</dd>
                            </div>
                            <div className="flex gap-2">
                              <dt className="text-muted-foreground w-24 shrink-0">Target ID:</dt>
                              <dd className="font-mono text-xs">{entry.targetId}</dd>
                            </div>
                            {Object.entries(entry.details).map(([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <dt className="text-muted-foreground w-24 shrink-0 capitalize">{key}:</dt>
                                <dd className="font-mono text-xs">{value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
