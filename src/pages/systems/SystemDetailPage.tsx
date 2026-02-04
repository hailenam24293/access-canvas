import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/components/ui/loading';
import { ErrorState, EmptyState } from '@/components/ui/empty-states';
import { TierBadge, LifecycleBadge, RoleBadge } from '@/components/ui/badges';
import { fetchSystemByRef, fetchCMDBRelationshipsForSystem, fetchRoleBindingsForScope } from '@/lib/api';
import { System, CMDBRelationship, RoleBinding, Scope } from '@/lib/types';
import { getSubjectName, getUserById, getGroupById } from '@/lib/mock-data';
import { 
  ArrowLeft, Server, Users, Tag, Calendar, RefreshCw, 
  Shield, Key, User, UsersRound, ExternalLink 
} from 'lucide-react';
import { format } from 'date-fns';

export default function SystemDetailPage() {
  const { ref } = useParams<{ ref: string }>();
  const navigate = useNavigate();

  const [system, setSystem] = useState<System | null>(null);
  const [relationships, setRelationships] = useState<CMDBRelationship[]>([]);
  const [roleBindings, setRoleBindings] = useState<RoleBinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [ref]);

  async function loadData() {
    if (!ref) return;
    setLoading(true);
    setError(null);
    try {
      const sys = await fetchSystemByRef(ref);
      if (!sys) {
        setError('System not found');
        return;
      }
      setSystem(sys);

      const [rels, bindings] = await Promise.all([
        fetchCMDBRelationshipsForSystem(sys.id),
        fetchRoleBindingsForScope(`system:${ref}` as Scope),
      ]);
      setRelationships(rels);
      setRoleBindings(bindings);
    } catch (err) {
      setError('Failed to load system details');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <LoadingState message="Loading system details..." />
      </div>
    );
  }

  if (error || !system) {
    return (
      <div className="page-container">
        <ErrorState message={error || 'System not found'} onRetry={loadData} />
      </div>
    );
  }

  const owners = relationships.filter(r => r.relationshipType === 'owns');
  const managers = relationships.filter(r => r.relationshipType === 'manages');
  const accessors = relationships.filter(r => r.relationshipType === 'hasAccess');

  return (
    <div className="page-container max-w-4xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate('/systems')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Systems
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
          <Server className="h-7 w-7 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold">{system.name}</h1>
            <TierBadge tier={system.tier} />
            <LifecycleBadge lifecycle={system.lifecycle} />
          </div>
          <code className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
            {system.ref}
          </code>
        </div>
        <Button variant="outline" onClick={() => navigate(`/requests/create/system-permission?system=${system.ref}`)}>
          <Key className="mr-2 h-4 w-4" />
          Request Access
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="access">Access & Ownership</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Description */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{system.description}</p>
            </CardContent>
          </Card>

          {/* Metadata */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {system.ownerType === 'user' ? (
                    <User className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <UsersRound className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">{getSubjectName(system.owner, system.ownerType)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{system.ownerType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Timestamps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{format(new Date(system.createdAt), 'PP')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{format(new Date(system.updatedAt), 'PP')}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tags */}
          {system.tags.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {system.tags.map(tag => (
                    <span key={tag} className="bg-muted px-2.5 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          {/* Access & Ownership Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Access & Ownership
              </CardTitle>
              <CardDescription>
                CMDB relationships and role bindings for this system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Owners */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  Owners ({owners.length})
                </h4>
                {owners.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No owners defined</p>
                ) : (
                  <div className="space-y-2">
                    {owners.map(rel => (
                      <RelationshipRow key={rel.id} relationship={rel} />
                    ))}
                  </div>
                )}
              </div>

              {/* Managers (PMs) */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  Managers (PM) ({managers.length})
                </h4>
                {managers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No managers assigned</p>
                ) : (
                  <div className="space-y-2">
                    {managers.map(rel => (
                      <RelationshipRow key={rel.id} relationship={rel} />
                    ))}
                  </div>
                )}
              </div>

              {/* Developers with Access */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Developers with Access ({accessors.length})
                </h4>
                {accessors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No developers have access</p>
                ) : (
                  <div className="space-y-2">
                    {accessors.map(rel => (
                      <RelationshipRow key={rel.id} relationship={rel} />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role Bindings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Role Bindings
              </CardTitle>
              <CardDescription>
                RBAC assignments scoped to this system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {roleBindings.length === 0 ? (
                <EmptyState
                  title="No role bindings"
                  description="No RBAC assignments for this system yet."
                />
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Type</th>
                      <th>Role</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleBindings.map(binding => (
                      <tr key={binding.id}>
                        <td className="font-medium">
                          {getSubjectName(binding.subjectId, binding.subjectType)}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RelationshipRow({ relationship }: { relationship: CMDBRelationship }) {
  const isUser = relationship.sourceType === 'user';
  const subject = isUser 
    ? getUserById(relationship.sourceId) 
    : getGroupById(relationship.sourceId);

  return (
    <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
          {isUser ? (
            <User className="h-4 w-4 text-muted-foreground" />
          ) : (
            <UsersRound className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{subject?.name || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground capitalize">{relationship.sourceType}</p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">
        {format(new Date(relationship.createdAt), 'PP')}
      </span>
    </div>
  );
}
