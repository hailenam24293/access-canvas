// Core types for the RBAC + CMDB system

export type Role = 'platform-admin' | 'pm' | 'developer';

export type Scope = 'platform' | `system:${string}`;

export type RequestStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export type RequestType = 'signup' | 'system-creation' | 'system-permission';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  createdAt: string;
}

export interface System {
  id: string;
  ref: string; // e.g., "payment-service"
  name: string;
  description: string;
  owner: string; // user or group id
  ownerType: 'user' | 'group';
  tier: 'tier-1' | 'tier-2' | 'tier-3';
  lifecycle: 'production' | 'staging' | 'development' | 'deprecated';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleBinding {
  id: string;
  subjectId: string; // user or group id
  subjectType: 'user' | 'group';
  role: Role;
  scope: Scope;
  createdAt: string;
  createdBy: string;
  expiresAt?: string;
}

export interface CMDBRelationship {
  id: string;
  sourceId: string;
  sourceType: 'user' | 'group';
  targetId: string;
  targetType: 'system';
  relationshipType: 'hasAccess' | 'manages' | 'owns';
  createdAt: string;
  metadata?: Record<string, string>;
}

export interface Request {
  id: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  requesterId: string;
  
  // Type-specific data
  data: SignupRequestData | SystemCreationRequestData | SystemPermissionRequestData;
  
  // Approval workflow
  approverId?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface SignupRequestData {
  requestedRole: 'pm' | 'developer';
  justification: string;
  teamName?: string;
}

export interface SystemCreationRequestData {
  systemRef: string;
  systemName: string;
  systemDescription: string;
  tier: System['tier'];
  lifecycle: System['lifecycle'];
  tags: string[];
}

export interface SystemPermissionRequestData {
  systemRef: string;
  systemName: string;
  requestedRole: 'pm' | 'developer';
  justification: string;
}

export interface AuditLogEntry {
  id: string;
  action: 'role_binding_created' | 'role_binding_deleted' | 'request_approved' | 'request_rejected' | 'system_created' | 'cmdb_relationship_created';
  actorId: string;
  actorName: string;
  targetType: 'user' | 'group' | 'system' | 'request' | 'role_binding';
  targetId: string;
  targetName: string;
  details: Record<string, string>;
  timestamp: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

// Current user context (for mocking auth)
export interface CurrentUser extends User {
  roles: RoleBinding[];
}
