import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingState, SkeletonCard } from '@/components/ui/loading';
import { NoSystemsState, ErrorState } from '@/components/ui/empty-states';
import { TierBadge, LifecycleBadge } from '@/components/ui/badges';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchSystems } from '@/lib/api';
import { System } from '@/lib/types';
import { getSubjectName } from '@/lib/mock-data';
import { Search, Server, Users, Tag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SystemsListPage() {
  const navigate = useNavigate();
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [lifecycleFilter, setLifecycleFilter] = useState<string>('all');

  useEffect(() => {
    loadSystems();
  }, []);

  async function loadSystems() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSystems();
      setSystems(data);
    } catch (err) {
      setError('Failed to load systems');
    } finally {
      setLoading(false);
    }
  }

  const filteredSystems = systems.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.ref.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesTier = tierFilter === 'all' || s.tier === tierFilter;
    const matchesLifecycle = lifecycleFilter === 'all' || s.lifecycle === lifecycleFilter;
    return matchesSearch && matchesTier && matchesLifecycle;
  });

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader title="Systems" description="Service catalog and component registry" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <PageHeader title="Systems" description="Service catalog and component registry" />
        <ErrorState message={error} onRetry={loadSystems} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Systems"
        description={`${systems.length} systems in the catalog`}
      />

      {systems.length === 0 ? (
        <NoSystemsState />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6 mt-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search systems, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="tier-1">Tier 1</SelectItem>
                <SelectItem value="tier-2">Tier 2</SelectItem>
                <SelectItem value="tier-3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
            <Select value={lifecycleFilter} onValueChange={setLifecycleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Lifecycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lifecycle</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="staging">Staging</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="deprecated">Deprecated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Systems Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSystems.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No systems match your filters
              </div>
            ) : (
              filteredSystems.map((system) => (
                <Card
                  key={system.id}
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md hover:border-accent',
                    system.lifecycle === 'deprecated' && 'opacity-60'
                  )}
                  onClick={() => navigate(`/systems/${system.ref}`)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Server className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex gap-1">
                        <TierBadge tier={system.tier} />
                      </div>
                    </div>
                    <CardTitle className="text-base mt-2">{system.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {system.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <LifecycleBadge lifecycle={system.lifecycle} />
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{getSubjectName(system.owner, system.ownerType)}</span>
                      </div>

                      {system.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          {system.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                          {system.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{system.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
