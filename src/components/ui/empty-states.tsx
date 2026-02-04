import { ReactNode } from 'react';
import { AlertCircle, FileX, Inbox, Search, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('empty-state', className)}>
      <div className="empty-state-icon">
        {icon || <Inbox className="h-12 w-12" />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-4" variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message, 
  onRetry, 
  className 
}: ErrorStateProps) {
  return (
    <div className={cn('empty-state', className)}>
      <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4" variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
}

// Preset empty states
export function NoRequestsState({ onCreateRequest }: { onCreateRequest?: () => void }) {
  return (
    <EmptyState
      icon={<FileX className="h-12 w-12" />}
      title="No requests found"
      description="Create a new request to get started with access management."
      action={onCreateRequest ? { label: 'Create Request', onClick: onCreateRequest } : undefined}
    />
  );
}

export function NoSystemsState() {
  return (
    <EmptyState
      icon={<Server className="h-12 w-12" />}
      title="No systems found"
      description="Systems will appear here once they are registered in the catalog."
    />
  );
}

export function NoSearchResultsState({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="h-12 w-12" />}
      title="No results found"
      description={`No items match "${query}". Try adjusting your search or filters.`}
    />
  );
}

export function NoApprovalsState() {
  return (
    <EmptyState
      icon={<Inbox className="h-12 w-12" />}
      title="No pending approvals"
      description="You're all caught up! There are no requests waiting for your approval."
    />
  );
}
