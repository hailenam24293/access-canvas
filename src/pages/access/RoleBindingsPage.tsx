import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingState, SkeletonRow } from '@/components/ui/loading';
import { EmptyState, ErrorState } from '@/components/ui/empty-states';
import { RoleBadge } from '@/components/ui/badges';
import { fetchRoleBindings } from '@/lib/api';
import { RoleBinding, Role } from '@/lib/types';
import { getSubjectName } from '@/lib/mock-data';
import { Search, Users, User, UsersRound, Server } from 'lucide-react';
import { format } from 'date-fns';

export default function RoleBindingsPage() {
  const [bindings, setBindings] = useState<RoleBinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [scopeFilter, setScopeFilter] = useState<string>('all');

  useEffect(() => {
    loadBindings();
  }, []);

  async function loadBindings() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoleBindings();
      setBindings(data);
    } catch (err) {
      setError('Failed to load role bindings');
    } finally {
      setLoading(false);
    }
  }

  const uniqueScopes = [...new Set(bindings.map(b => b.scope))];

  const filteredBindings = bindings.filter(b => {
    const subjectName = getSubjectName(b.subjectId, b.subjectType);
    const matchesSearch = 
      subjectName.toLowerCase().includes(search.toLowerCase()) ||
      b.scope.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || b.role === roleFilter;
    const matchesScope = scopeFilter === 'all' || b.scope === scopeFilter;
    return matchesSearch && matchesRole && matchesScope;
  });

  const groupedBindings = filteredBindings.reduce((acc, binding) => {
    const scope = binding.scope;
    if (!acc[scope]) acc[scope] = [];
    acc[scope].push(binding);
    return acc;
  }, {} as Record<string, RoleBinding[]>);

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader title="Role Bindings" description="RBAC assignments across scopes" />
        <LoadingState message="Loading role bindings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <PageHeader title="Role Bindings" description="RBAC assignments across scopes" />
        <ErrorState message={error} onRetry={loadBindings} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Role Bindings"
        description={`${bindings.length} role assignments across ${uniqueScopes.length} scopes`}
      />

      {bindings.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="No role bindings"
          description="Role bindings will appear here as requests are approved."
        />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6 mt-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or scope..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="platform-admin">Platform Admin</SelectItem>
                <SelectItem value="pm">PM</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scopeFilter} onValueChange={setScopeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scopes</SelectItem>
                {uniqueScopes.map(scope => (
                  <SelectItem key={scope} value={scope}>
                    {scope}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Grouped Bindings */}
          <div className="space-y-6">
            {Object.entries(groupedBindings)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([scope, scopeBindings]) => (
                <div key={scope} className="content-card overflow-hidden">
                  <div className="content-card-header bg-muted/30">
                    <div className="flex items-center gap-2">
                      {scope === 'platform' ? (
                        <Server className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Server className="h-4 w-4 text-muted-foreground" />
                      )}
                      <code className="text-sm font-medium">{scope}</code>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({scopeBindings.length} binding{scopeBindings.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Type</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Created By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scopeBindings.map(binding => (
                        <tr key={binding.id}>
                          <td>
                            <div className="flex items-center gap-2">
                              {binding.subjectType === 'user' ? (
                                <User className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <UsersRound className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="font-medium">
                                {getSubjectName(binding.subjectId, binding.subjectType)}
                              </span>
                            </div>
                          </td>
                          <td className="capitalize text-muted-foreground">
                            {binding.subjectType}
                          </td>
                          <td>
                            <RoleBadge role={binding.role} />
                          </td>
                          <td className="text-muted-foreground">
                            {format(new Date(binding.createdAt), 'PP')}
                          </td>
                          <td className="text-muted-foreground">
                            {binding.createdBy === 'system' ? (
                              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">system</span>
                            ) : (
                              getSubjectName(binding.createdBy, 'user')
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
