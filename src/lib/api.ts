// Mock API layer with simulated async operations

import {
  users,
  groups,
  systems,
  roleBindings,
  cmdbRelationships,
  requests,
  auditLog,
  currentUser,
  getUserById,
  getGroupById,
  getSystemByRef,
} from './mock-data';
import type {
  User,
  Group,
  System,
  RoleBinding,
  CMDBRelationship,
  Request,
  AuditLogEntry,
  CurrentUser,
  RequestType,
  RequestStatus,
  Role,
  Scope,
} from './types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 400);

// ============ Users API ============
export async function fetchUsers(): Promise<User[]> {
  await randomDelay();
  return [...users];
}

export async function fetchUser(id: string): Promise<User | null> {
  await randomDelay();
  return getUserById(id) || null;
}

// ============ Groups API ============
export async function fetchGroups(): Promise<Group[]> {
  await randomDelay();
  return [...groups];
}

export async function fetchGroup(id: string): Promise<Group | null> {
  await randomDelay();
  return getGroupById(id) || null;
}

// ============ Systems API ============
export async function fetchSystems(): Promise<System[]> {
  await randomDelay();
  return [...systems];
}

export async function fetchSystem(id: string): Promise<System | null> {
  await randomDelay();
  return systems.find(s => s.id === id) || null;
}

export async function fetchSystemByRef(ref: string): Promise<System | null> {
  await randomDelay();
  return getSystemByRef(ref) || null;
}

// ============ Role Bindings API ============
export async function fetchRoleBindings(): Promise<RoleBinding[]> {
  await randomDelay();
  return [...roleBindings];
}

export async function fetchRoleBindingsForSubject(subjectId: string): Promise<RoleBinding[]> {
  await randomDelay();
  return roleBindings.filter(rb => rb.subjectId === subjectId);
}

export async function fetchRoleBindingsForScope(scope: Scope): Promise<RoleBinding[]> {
  await randomDelay();
  return roleBindings.filter(rb => rb.scope === scope);
}

export async function createRoleBinding(data: {
  subjectId: string;
  subjectType: 'user' | 'group';
  role: Role;
  scope: Scope;
}): Promise<RoleBinding> {
  await randomDelay();
  const newBinding: RoleBinding = {
    id: `rb-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    createdBy: currentUser.id,
  };
  roleBindings.push(newBinding);
  return newBinding;
}

// ============ CMDB Relationships API ============
export async function fetchCMDBRelationships(): Promise<CMDBRelationship[]> {
  await randomDelay();
  return [...cmdbRelationships];
}

export async function fetchCMDBRelationshipsForSystem(systemId: string): Promise<CMDBRelationship[]> {
  await randomDelay();
  return cmdbRelationships.filter(rel => rel.targetId === systemId);
}

export async function createCMDBRelationship(data: {
  sourceId: string;
  sourceType: 'user' | 'group';
  targetId: string;
  relationshipType: 'hasAccess' | 'manages' | 'owns';
}): Promise<CMDBRelationship> {
  await randomDelay();
  const newRelationship: CMDBRelationship = {
    id: `rel-${Date.now()}`,
    ...data,
    targetType: 'system',
    createdAt: new Date().toISOString(),
  };
  cmdbRelationships.push(newRelationship);
  return newRelationship;
}

// ============ Requests API ============
export async function fetchRequests(filters?: {
  type?: RequestType;
  status?: RequestStatus;
  requesterId?: string;
}): Promise<Request[]> {
  await randomDelay();
  let result = [...requests];
  
  if (filters?.type) {
    result = result.filter(r => r.type === filters.type);
  }
  if (filters?.status) {
    result = result.filter(r => r.status === filters.status);
  }
  if (filters?.requesterId) {
    result = result.filter(r => r.requesterId === filters.requesterId);
  }
  
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function fetchRequest(id: string): Promise<Request | null> {
  await randomDelay();
  return requests.find(r => r.id === id) || null;
}

export async function fetchMyRequests(): Promise<Request[]> {
  await randomDelay();
  return requests
    .filter(r => r.requesterId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function fetchPendingApprovals(): Promise<Request[]> {
  await randomDelay();
  const pendingRequests = requests.filter(r => r.status === 'pending');
  
  // Filter based on what current user can approve
  return pendingRequests.filter(request => {
    // Platform admins can approve signup and system-creation requests
    const isPlatformAdmin = currentUser.roles.some(
      rb => rb.role === 'platform-admin' && rb.scope === 'platform'
    );
    
    if (request.type === 'signup' || request.type === 'system-creation') {
      return isPlatformAdmin;
    }
    
    // System permission requests are approved by PMs of that system
    if (request.type === 'system-permission') {
      const data = request.data as { systemRef: string };
      const scope: Scope = `system:${data.systemRef}`;
      
      return currentUser.roles.some(
        rb => rb.role === 'pm' && rb.scope === scope
      );
    }
    
    return false;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createRequest(data: Partial<Request>): Promise<Request> {
  await randomDelay();
  const newRequest: Request = {
    id: `req-${Date.now()}`,
    type: data.type!,
    title: data.title!,
    description: data.description!,
    status: 'pending',
    requesterId: currentUser.id,
    data: data.data!,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  requests.push(newRequest);
  return newRequest;
}

export async function approveRequest(requestId: string): Promise<Request> {
  await randomDelay();
  const request = requests.find(r => r.id === requestId);
  if (!request) throw new Error('Request not found');
  
  request.status = 'approved';
  request.approverId = currentUser.id;
  request.approvedAt = new Date().toISOString();
  request.updatedAt = new Date().toISOString();
  
  // Create audit log entry
  auditLog.unshift({
    id: `audit-${Date.now()}`,
    action: 'request_approved',
    actorId: currentUser.id,
    actorName: currentUser.name,
    targetType: 'request',
    targetId: request.id,
    targetName: request.title,
    details: { requestType: request.type },
    timestamp: new Date().toISOString(),
  });
  
  // Handle side effects based on request type
  if (request.type === 'system-permission') {
    const data = request.data as { systemRef: string; requestedRole: Role };
    const system = getSystemByRef(data.systemRef);
    
    if (system) {
      // Create role binding
      const newBinding: RoleBinding = {
        id: `rb-${Date.now()}`,
        subjectId: request.requesterId,
        subjectType: 'user',
        role: data.requestedRole,
        scope: `system:${data.systemRef}`,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id,
      };
      roleBindings.push(newBinding);
      
      // Create CMDB relationship
      const relType = data.requestedRole === 'pm' ? 'manages' : 'hasAccess';
      const newRelationship: CMDBRelationship = {
        id: `rel-${Date.now()}`,
        sourceId: request.requesterId,
        sourceType: 'user',
        targetId: system.id,
        targetType: 'system',
        relationshipType: relType,
        createdAt: new Date().toISOString(),
      };
      cmdbRelationships.push(newRelationship);
      
      // Audit entries
      auditLog.unshift({
        id: `audit-${Date.now() + 1}`,
        action: 'role_binding_created',
        actorId: currentUser.id,
        actorName: currentUser.name,
        targetType: 'role_binding',
        targetId: newBinding.id,
        targetName: `${getUserById(request.requesterId)?.name} -> ${data.requestedRole} @ ${data.systemRef}`,
        details: { role: data.requestedRole, scope: `system:${data.systemRef}` },
        timestamp: new Date().toISOString(),
      });
      
      auditLog.unshift({
        id: `audit-${Date.now() + 2}`,
        action: 'cmdb_relationship_created',
        actorId: currentUser.id,
        actorName: currentUser.name,
        targetType: 'system',
        targetId: system.id,
        targetName: system.name,
        details: { relationshipType: relType, subjectId: request.requesterId },
        timestamp: new Date().toISOString(),
      });
    }
  }
  
  return request;
}

export async function rejectRequest(requestId: string, reason: string): Promise<Request> {
  await randomDelay();
  const request = requests.find(r => r.id === requestId);
  if (!request) throw new Error('Request not found');
  
  request.status = 'rejected';
  request.approverId = currentUser.id;
  request.rejectedAt = new Date().toISOString();
  request.rejectionReason = reason;
  request.updatedAt = new Date().toISOString();
  
  auditLog.unshift({
    id: `audit-${Date.now()}`,
    action: 'request_rejected',
    actorId: currentUser.id,
    actorName: currentUser.name,
    targetType: 'request',
    targetId: request.id,
    targetName: request.title,
    details: { requestType: request.type, reason },
    timestamp: new Date().toISOString(),
  });
  
  return request;
}

// ============ Audit Log API ============
export async function fetchAuditLog(limit: number = 50): Promise<AuditLogEntry[]> {
  await randomDelay();
  return auditLog.slice(0, limit);
}

// ============ Current User API ============
export async function fetchCurrentUser(): Promise<CurrentUser> {
  await delay(200);
  return { ...currentUser };
}

// ============ Permission Helpers ============
export function canApproveRequest(request: Request, user: CurrentUser): boolean {
  const isPlatformAdmin = user.roles.some(
    rb => rb.role === 'platform-admin' && rb.scope === 'platform'
  );
  
  if (request.type === 'signup' || request.type === 'system-creation') {
    return isPlatformAdmin;
  }
  
  if (request.type === 'system-permission') {
    const data = request.data as { systemRef: string };
    const scope: Scope = `system:${data.systemRef}`;
    
    return user.roles.some(rb => rb.role === 'pm' && rb.scope === scope);
  }
  
  return false;
}

export function hasRole(user: CurrentUser, role: Role, scope?: Scope): boolean {
  return user.roles.some(rb => {
    if (rb.role !== role) return false;
    if (scope && rb.scope !== scope) return false;
    return true;
  });
}

export function isPlatformAdmin(user: CurrentUser): boolean {
  return hasRole(user, 'platform-admin', 'platform');
}
