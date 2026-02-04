import { cn } from '@/lib/utils';
import { RequestStatus, Role } from '@/lib/types';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<RequestStatus, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'status-badge-draft' },
    pending: { label: 'Pending', className: 'status-badge-pending' },
    approved: { label: 'Approved', className: 'status-badge-approved' },
    rejected: { label: 'Rejected', className: 'status-badge-rejected' },
  };

  const config = statusConfig[status];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const roleConfig: Record<Role, { label: string; className: string }> = {
    'platform-admin': { label: 'Platform Admin', className: 'role-badge-admin' },
    pm: { label: 'PM', className: 'role-badge-pm' },
    developer: { label: 'Developer', className: 'role-badge-developer' },
  };

  const config = roleConfig[role];

  return (
    <span className={cn('role-badge', config.className, className)}>
      {config.label}
    </span>
  );
}

interface TierBadgeProps {
  tier: 'tier-1' | 'tier-2' | 'tier-3';
  className?: string;
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  const tierConfig = {
    'tier-1': { label: 'Tier 1', className: 'bg-red-100 text-red-700' },
    'tier-2': { label: 'Tier 2', className: 'bg-yellow-100 text-yellow-700' },
    'tier-3': { label: 'Tier 3', className: 'bg-gray-100 text-gray-700' },
  };

  const config = tierConfig[tier];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}

interface LifecycleBadgeProps {
  lifecycle: 'production' | 'staging' | 'development' | 'deprecated';
  className?: string;
}

export function LifecycleBadge({ lifecycle, className }: LifecycleBadgeProps) {
  const lifecycleConfig = {
    production: { label: 'Production', className: 'bg-green-100 text-green-700' },
    staging: { label: 'Staging', className: 'bg-blue-100 text-blue-700' },
    development: { label: 'Development', className: 'bg-purple-100 text-purple-700' },
    deprecated: { label: 'Deprecated', className: 'bg-gray-100 text-gray-500' },
  };

  const config = lifecycleConfig[lifecycle];

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
