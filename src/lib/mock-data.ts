import {
  User,
  Group,
  System,
  RoleBinding,
  CMDBRelationship,
  Request,
  AuditLogEntry,
  CurrentUser,
} from './types';

// ============ USERS (10) ============
export const users: User[] = [
  { id: 'user-1', name: 'Alice Chen', email: 'alice.chen@company.com', avatar: 'AC', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'user-2', name: 'Bob Martinez', email: 'bob.martinez@company.com', avatar: 'BM', createdAt: '2024-01-20T10:00:00Z' },
  { id: 'user-3', name: 'Carol Johnson', email: 'carol.johnson@company.com', avatar: 'CJ', createdAt: '2024-02-01T10:00:00Z' },
  { id: 'user-4', name: 'David Kim', email: 'david.kim@company.com', avatar: 'DK', createdAt: '2024-02-10T10:00:00Z' },
  { id: 'user-5', name: 'Emma Wilson', email: 'emma.wilson@company.com', avatar: 'EW', createdAt: '2024-02-15T10:00:00Z' },
  { id: 'user-6', name: 'Frank Brown', email: 'frank.brown@company.com', avatar: 'FB', createdAt: '2024-03-01T10:00:00Z' },
  { id: 'user-7', name: 'Grace Lee', email: 'grace.lee@company.com', avatar: 'GL', createdAt: '2024-03-10T10:00:00Z' },
  { id: 'user-8', name: 'Henry Taylor', email: 'henry.taylor@company.com', avatar: 'HT', createdAt: '2024-03-15T10:00:00Z' },
  { id: 'user-9', name: 'Iris Zhang', email: 'iris.zhang@company.com', avatar: 'IZ', createdAt: '2024-03-20T10:00:00Z' },
  { id: 'user-10', name: 'Jack Davis', email: 'jack.davis@company.com', avatar: 'JD', createdAt: '2024-04-01T10:00:00Z' },
];

// ============ GROUPS (6) ============
export const groups: Group[] = [
  { id: 'group-1', name: 'Platform Team', description: 'Core platform infrastructure team', memberIds: ['user-1', 'user-2'], createdAt: '2024-01-10T10:00:00Z' },
  { id: 'group-2', name: 'Payments Squad', description: 'Payment processing team', memberIds: ['user-3', 'user-4', 'user-5'], createdAt: '2024-01-15T10:00:00Z' },
  { id: 'group-3', name: 'Auth Team', description: 'Authentication and authorization', memberIds: ['user-6', 'user-7'], createdAt: '2024-02-01T10:00:00Z' },
  { id: 'group-4', name: 'Data Engineering', description: 'Data pipelines and analytics', memberIds: ['user-8', 'user-9'], createdAt: '2024-02-15T10:00:00Z' },
  { id: 'group-5', name: 'Mobile Team', description: 'Mobile application development', memberIds: ['user-10', 'user-5'], createdAt: '2024-03-01T10:00:00Z' },
  { id: 'group-6', name: 'SRE Team', description: 'Site reliability engineering', memberIds: ['user-1', 'user-8'], createdAt: '2024-03-15T10:00:00Z' },
];

// ============ SYSTEMS (12) ============
export const systems: System[] = [
  { id: 'sys-1', ref: 'payment-gateway', name: 'Payment Gateway', description: 'Core payment processing service handling all transactions', owner: 'user-3', ownerType: 'user', tier: 'tier-1', lifecycle: 'production', tags: ['payments', 'critical', 'pci'], createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-12-01T10:00:00Z' },
  { id: 'sys-2', ref: 'auth-service', name: 'Authentication Service', description: 'OAuth2/OIDC identity provider and session management', owner: 'group-3', ownerType: 'group', tier: 'tier-1', lifecycle: 'production', tags: ['auth', 'security', 'identity'], createdAt: '2024-01-05T10:00:00Z', updatedAt: '2024-11-15T10:00:00Z' },
  { id: 'sys-3', ref: 'user-management', name: 'User Management', description: 'User profiles, preferences, and account management', owner: 'user-6', ownerType: 'user', tier: 'tier-2', lifecycle: 'production', tags: ['users', 'profiles'], createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-10-20T10:00:00Z' },
  { id: 'sys-4', ref: 'notification-hub', name: 'Notification Hub', description: 'Multi-channel notification delivery (email, SMS, push)', owner: 'group-1', ownerType: 'group', tier: 'tier-2', lifecycle: 'production', tags: ['notifications', 'messaging'], createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-09-10T10:00:00Z' },
  { id: 'sys-5', ref: 'data-warehouse', name: 'Data Warehouse', description: 'Central analytics data store and reporting', owner: 'group-4', ownerType: 'group', tier: 'tier-1', lifecycle: 'production', tags: ['analytics', 'data', 'reporting'], createdAt: '2024-02-15T10:00:00Z', updatedAt: '2024-12-10T10:00:00Z' },
  { id: 'sys-6', ref: 'api-gateway', name: 'API Gateway', description: 'Rate limiting, routing, and API management', owner: 'user-1', ownerType: 'user', tier: 'tier-1', lifecycle: 'production', tags: ['api', 'gateway', 'infrastructure'], createdAt: '2024-03-01T10:00:00Z', updatedAt: '2024-11-01T10:00:00Z' },
  { id: 'sys-7', ref: 'mobile-backend', name: 'Mobile Backend', description: 'BFF for mobile applications', owner: 'group-5', ownerType: 'group', tier: 'tier-2', lifecycle: 'production', tags: ['mobile', 'bff'], createdAt: '2024-03-15T10:00:00Z', updatedAt: '2024-10-05T10:00:00Z' },
  { id: 'sys-8', ref: 'search-service', name: 'Search Service', description: 'Full-text search and indexing', owner: 'user-4', ownerType: 'user', tier: 'tier-2', lifecycle: 'production', tags: ['search', 'elasticsearch'], createdAt: '2024-04-01T10:00:00Z', updatedAt: '2024-08-20T10:00:00Z' },
  { id: 'sys-9', ref: 'config-service', name: 'Configuration Service', description: 'Feature flags and dynamic configuration', owner: 'group-1', ownerType: 'group', tier: 'tier-2', lifecycle: 'staging', tags: ['config', 'feature-flags'], createdAt: '2024-04-15T10:00:00Z', updatedAt: '2024-12-01T10:00:00Z' },
  { id: 'sys-10', ref: 'legacy-billing', name: 'Legacy Billing', description: 'Old billing system (migrating)', owner: 'user-3', ownerType: 'user', tier: 'tier-3', lifecycle: 'deprecated', tags: ['billing', 'legacy', 'migration'], createdAt: '2023-01-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: 'sys-11', ref: 'ml-pipeline', name: 'ML Pipeline', description: 'Machine learning model training and serving', owner: 'group-4', ownerType: 'group', tier: 'tier-2', lifecycle: 'development', tags: ['ml', 'ai', 'data-science'], createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-12-15T10:00:00Z' },
  { id: 'sys-12', ref: 'logging-platform', name: 'Logging Platform', description: 'Centralized log aggregation and analysis', owner: 'group-6', ownerType: 'group', tier: 'tier-1', lifecycle: 'production', tags: ['logging', 'observability', 'infrastructure'], createdAt: '2024-05-01T10:00:00Z', updatedAt: '2024-11-20T10:00:00Z' },
];

// ============ ROLE BINDINGS ============
export let roleBindings: RoleBinding[] = [
  // Platform admins
  { id: 'rb-1', subjectId: 'user-1', subjectType: 'user', role: 'platform-admin', scope: 'platform', createdAt: '2024-01-01T10:00:00Z', createdBy: 'system' },
  { id: 'rb-2', subjectId: 'user-2', subjectType: 'user', role: 'platform-admin', scope: 'platform', createdAt: '2024-01-01T10:00:00Z', createdBy: 'system' },
  
  // PMs with system scope
  { id: 'rb-3', subjectId: 'user-3', subjectType: 'user', role: 'pm', scope: 'system:payment-gateway', createdAt: '2024-01-15T10:00:00Z', createdBy: 'user-1' },
  { id: 'rb-4', subjectId: 'user-6', subjectType: 'user', role: 'pm', scope: 'system:auth-service', createdAt: '2024-02-01T10:00:00Z', createdBy: 'user-1' },
  { id: 'rb-5', subjectId: 'group-4', subjectType: 'group', role: 'pm', scope: 'system:data-warehouse', createdAt: '2024-02-15T10:00:00Z', createdBy: 'user-2' },
  { id: 'rb-6', subjectId: 'user-3', subjectType: 'user', role: 'pm', scope: 'system:legacy-billing', createdAt: '2024-01-20T10:00:00Z', createdBy: 'user-1' },
  
  // Developers with system scope
  { id: 'rb-7', subjectId: 'user-4', subjectType: 'user', role: 'developer', scope: 'system:payment-gateway', createdAt: '2024-02-10T10:00:00Z', createdBy: 'user-3' },
  { id: 'rb-8', subjectId: 'user-5', subjectType: 'user', role: 'developer', scope: 'system:payment-gateway', createdAt: '2024-02-15T10:00:00Z', createdBy: 'user-3' },
  { id: 'rb-9', subjectId: 'group-3', subjectType: 'group', role: 'developer', scope: 'system:auth-service', createdAt: '2024-02-20T10:00:00Z', createdBy: 'user-6' },
  { id: 'rb-10', subjectId: 'user-8', subjectType: 'user', role: 'developer', scope: 'system:data-warehouse', createdAt: '2024-03-01T10:00:00Z', createdBy: 'user-1' },
  { id: 'rb-11', subjectId: 'user-9', subjectType: 'user', role: 'developer', scope: 'system:data-warehouse', createdAt: '2024-03-05T10:00:00Z', createdBy: 'user-1' },
  { id: 'rb-12', subjectId: 'group-5', subjectType: 'group', role: 'developer', scope: 'system:mobile-backend', createdAt: '2024-03-20T10:00:00Z', createdBy: 'user-2' },
];

// ============ CMDB RELATIONSHIPS ============
export let cmdbRelationships: CMDBRelationship[] = [
  // Ownership
  { id: 'rel-1', sourceId: 'user-3', sourceType: 'user', targetId: 'sys-1', targetType: 'system', relationshipType: 'owns', createdAt: '2024-01-01T10:00:00Z' },
  { id: 'rel-2', sourceId: 'group-3', sourceType: 'group', targetId: 'sys-2', targetType: 'system', relationshipType: 'owns', createdAt: '2024-01-05T10:00:00Z' },
  { id: 'rel-3', sourceId: 'user-6', sourceType: 'user', targetId: 'sys-3', targetType: 'system', relationshipType: 'owns', createdAt: '2024-01-10T10:00:00Z' },
  { id: 'rel-4', sourceId: 'group-1', sourceType: 'group', targetId: 'sys-4', targetType: 'system', relationshipType: 'owns', createdAt: '2024-02-01T10:00:00Z' },
  { id: 'rel-5', sourceId: 'group-4', sourceType: 'group', targetId: 'sys-5', targetType: 'system', relationshipType: 'owns', createdAt: '2024-02-15T10:00:00Z' },
  
  // Management (PM role)
  { id: 'rel-6', sourceId: 'user-3', sourceType: 'user', targetId: 'sys-1', targetType: 'system', relationshipType: 'manages', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'rel-7', sourceId: 'user-6', sourceType: 'user', targetId: 'sys-2', targetType: 'system', relationshipType: 'manages', createdAt: '2024-02-01T10:00:00Z' },
  { id: 'rel-8', sourceId: 'group-4', sourceType: 'group', targetId: 'sys-5', targetType: 'system', relationshipType: 'manages', createdAt: '2024-02-15T10:00:00Z' },
  
  // Access (Developer role)
  { id: 'rel-9', sourceId: 'user-4', sourceType: 'user', targetId: 'sys-1', targetType: 'system', relationshipType: 'hasAccess', createdAt: '2024-02-10T10:00:00Z' },
  { id: 'rel-10', sourceId: 'user-5', sourceType: 'user', targetId: 'sys-1', targetType: 'system', relationshipType: 'hasAccess', createdAt: '2024-02-15T10:00:00Z' },
  { id: 'rel-11', sourceId: 'group-3', sourceType: 'group', targetId: 'sys-2', targetType: 'system', relationshipType: 'hasAccess', createdAt: '2024-02-20T10:00:00Z' },
  { id: 'rel-12', sourceId: 'user-8', sourceType: 'user', targetId: 'sys-5', targetType: 'system', relationshipType: 'hasAccess', createdAt: '2024-03-01T10:00:00Z' },
  { id: 'rel-13', sourceId: 'user-9', sourceType: 'user', targetId: 'sys-5', targetType: 'system', relationshipType: 'hasAccess', createdAt: '2024-03-05T10:00:00Z' },
];

// ============ REQUESTS (40) ============
export let requests: Request[] = [
  // Approved signup requests
  { id: 'req-1', type: 'signup', title: 'Request PM Role', description: 'Requesting PM role to manage payment systems', status: 'approved', requesterId: 'user-3', data: { requestedRole: 'pm', justification: 'Need to manage payment gateway development', teamName: 'Payments Squad' }, approverId: 'user-1', approvedAt: '2024-01-15T10:00:00Z', createdAt: '2024-01-14T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'req-2', type: 'signup', title: 'Request Developer Role', description: 'Developer role for payment gateway work', status: 'approved', requesterId: 'user-4', data: { requestedRole: 'developer', justification: 'Joining payments team as backend developer', teamName: 'Payments Squad' }, approverId: 'user-1', approvedAt: '2024-02-10T10:00:00Z', createdAt: '2024-02-09T10:00:00Z', updatedAt: '2024-02-10T10:00:00Z' },
  { id: 'req-3', type: 'signup', title: 'Request Developer Role', description: 'Developer access needed', status: 'approved', requesterId: 'user-5', data: { requestedRole: 'developer', justification: 'Working on payment integrations', teamName: 'Payments Squad' }, approverId: 'user-2', approvedAt: '2024-02-15T10:00:00Z', createdAt: '2024-02-14T10:00:00Z', updatedAt: '2024-02-15T10:00:00Z' },
  { id: 'req-4', type: 'signup', title: 'Request PM Role', description: 'PM role for auth team', status: 'approved', requesterId: 'user-6', data: { requestedRole: 'pm', justification: 'Leading authentication service development', teamName: 'Auth Team' }, approverId: 'user-1', approvedAt: '2024-02-01T10:00:00Z', createdAt: '2024-01-31T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z' },
  
  // Pending signup requests
  { id: 'req-5', type: 'signup', title: 'Request Developer Role', description: 'Need developer access for SRE work', status: 'pending', requesterId: 'user-10', data: { requestedRole: 'developer', justification: 'Joining SRE team, need access to infrastructure systems', teamName: 'SRE Team' }, createdAt: '2024-12-20T10:00:00Z', updatedAt: '2024-12-20T10:00:00Z' },
  { id: 'req-6', type: 'signup', title: 'Request PM Role', description: 'PM role for mobile team', status: 'pending', requesterId: 'user-7', data: { requestedRole: 'pm', justification: 'Taking over mobile backend management', teamName: 'Mobile Team' }, createdAt: '2024-12-22T10:00:00Z', updatedAt: '2024-12-22T10:00:00Z' },
  
  // Rejected signup requests
  { id: 'req-7', type: 'signup', title: 'Request PM Role', description: 'Requesting PM access', status: 'rejected', requesterId: 'user-9', data: { requestedRole: 'pm', justification: 'Want to manage data pipelines' }, approverId: 'user-1', rejectedAt: '2024-11-15T10:00:00Z', rejectionReason: 'Insufficient experience for PM role at this time', createdAt: '2024-11-14T10:00:00Z', updatedAt: '2024-11-15T10:00:00Z' },
  
  // Approved system creation requests
  { id: 'req-8', type: 'system-creation', title: 'Create ML Pipeline System', description: 'New system for ML workflows', status: 'approved', requesterId: 'user-8', data: { systemRef: 'ml-pipeline', systemName: 'ML Pipeline', systemDescription: 'Machine learning model training and serving', tier: 'tier-2', lifecycle: 'development', tags: ['ml', 'ai', 'data-science'] }, approverId: 'user-1', approvedAt: '2024-06-01T10:00:00Z', createdAt: '2024-05-28T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z' },
  { id: 'req-9', type: 'system-creation', title: 'Create Logging Platform', description: 'Centralized logging system', status: 'approved', requesterId: 'user-1', data: { systemRef: 'logging-platform', systemName: 'Logging Platform', systemDescription: 'Centralized log aggregation and analysis', tier: 'tier-1', lifecycle: 'production', tags: ['logging', 'observability', 'infrastructure'] }, approverId: 'user-2', approvedAt: '2024-05-01T10:00:00Z', createdAt: '2024-04-28T10:00:00Z', updatedAt: '2024-05-01T10:00:00Z' },
  
  // Pending system creation requests
  { id: 'req-10', type: 'system-creation', title: 'Create A/B Testing Platform', description: 'Feature experimentation system', status: 'pending', requesterId: 'user-8', data: { systemRef: 'ab-testing', systemName: 'A/B Testing Platform', systemDescription: 'Feature flags and experimentation platform', tier: 'tier-2', lifecycle: 'development', tags: ['experimentation', 'feature-flags'] }, createdAt: '2024-12-18T10:00:00Z', updatedAt: '2024-12-18T10:00:00Z' },
  { id: 'req-11', type: 'system-creation', title: 'Create CDN Service', description: 'Content delivery network management', status: 'pending', requesterId: 'user-1', data: { systemRef: 'cdn-service', systemName: 'CDN Service', systemDescription: 'Static asset delivery and caching', tier: 'tier-1', lifecycle: 'staging', tags: ['cdn', 'infrastructure', 'performance'] }, createdAt: '2024-12-21T10:00:00Z', updatedAt: '2024-12-21T10:00:00Z' },
  
  // Rejected system creation
  { id: 'req-12', type: 'system-creation', title: 'Create Chat Service', description: 'Real-time messaging system', status: 'rejected', requesterId: 'user-7', data: { systemRef: 'chat-service', systemName: 'Chat Service', systemDescription: 'Real-time chat and messaging', tier: 'tier-2', lifecycle: 'development', tags: ['chat', 'realtime'] }, approverId: 'user-2', rejectedAt: '2024-11-20T10:00:00Z', rejectionReason: 'Duplicate functionality with existing notification hub', createdAt: '2024-11-18T10:00:00Z', updatedAt: '2024-11-20T10:00:00Z' },
  
  // Approved system permission requests
  { id: 'req-13', type: 'system-permission', title: 'Access to Payment Gateway', description: 'Developer access for payment integration', status: 'approved', requesterId: 'user-4', data: { systemRef: 'payment-gateway', systemName: 'Payment Gateway', requestedRole: 'developer', justification: 'Working on payment integration features' }, approverId: 'user-3', approvedAt: '2024-02-10T10:00:00Z', createdAt: '2024-02-09T10:00:00Z', updatedAt: '2024-02-10T10:00:00Z' },
  { id: 'req-14', type: 'system-permission', title: 'Access to Payment Gateway', description: 'Developer access needed', status: 'approved', requesterId: 'user-5', data: { systemRef: 'payment-gateway', systemName: 'Payment Gateway', requestedRole: 'developer', justification: 'Frontend integration with payments' }, approverId: 'user-3', approvedAt: '2024-02-15T10:00:00Z', createdAt: '2024-02-14T10:00:00Z', updatedAt: '2024-02-15T10:00:00Z' },
  { id: 'req-15', type: 'system-permission', title: 'Access to Data Warehouse', description: 'Developer access for analytics', status: 'approved', requesterId: 'user-8', data: { systemRef: 'data-warehouse', systemName: 'Data Warehouse', requestedRole: 'developer', justification: 'Building new analytics dashboards' }, approverId: 'user-1', approvedAt: '2024-03-01T10:00:00Z', createdAt: '2024-02-28T10:00:00Z', updatedAt: '2024-03-01T10:00:00Z' },
  { id: 'req-16', type: 'system-permission', title: 'Access to Data Warehouse', description: 'Developer access for ETL work', status: 'approved', requesterId: 'user-9', data: { systemRef: 'data-warehouse', systemName: 'Data Warehouse', requestedRole: 'developer', justification: 'ETL pipeline development' }, approverId: 'user-1', approvedAt: '2024-03-05T10:00:00Z', createdAt: '2024-03-04T10:00:00Z', updatedAt: '2024-03-05T10:00:00Z' },
  
  // Pending system permission requests
  { id: 'req-17', type: 'system-permission', title: 'Access to Auth Service', description: 'Need developer access for security audit', status: 'pending', requesterId: 'user-8', data: { systemRef: 'auth-service', systemName: 'Authentication Service', requestedRole: 'developer', justification: 'Security audit and token rotation implementation' }, createdAt: '2024-12-23T10:00:00Z', updatedAt: '2024-12-23T10:00:00Z' },
  { id: 'req-18', type: 'system-permission', title: 'Access to API Gateway', description: 'Developer access for rate limiting work', status: 'pending', requesterId: 'user-4', data: { systemRef: 'api-gateway', systemName: 'API Gateway', requestedRole: 'developer', justification: 'Implementing new rate limiting rules' }, createdAt: '2024-12-24T10:00:00Z', updatedAt: '2024-12-24T10:00:00Z' },
  { id: 'req-19', type: 'system-permission', title: 'Access to Notification Hub', description: 'Need to integrate with notifications', status: 'pending', requesterId: 'user-10', data: { systemRef: 'notification-hub', systemName: 'Notification Hub', requestedRole: 'developer', justification: 'Adding push notification support' }, createdAt: '2024-12-25T10:00:00Z', updatedAt: '2024-12-25T10:00:00Z' },
  { id: 'req-20', type: 'system-permission', title: 'PM Access to Mobile Backend', description: 'Need PM role for mobile backend', status: 'pending', requesterId: 'user-7', data: { systemRef: 'mobile-backend', systemName: 'Mobile Backend', requestedRole: 'pm', justification: 'Taking over product management for mobile team' }, createdAt: '2024-12-26T10:00:00Z', updatedAt: '2024-12-26T10:00:00Z' },
  
  // Rejected system permission requests
  { id: 'req-21', type: 'system-permission', title: 'Access to Payment Gateway', description: 'Developer access request', status: 'rejected', requesterId: 'user-10', data: { systemRef: 'payment-gateway', systemName: 'Payment Gateway', requestedRole: 'developer', justification: 'Want to learn about payments' }, approverId: 'user-3', rejectedAt: '2024-11-10T10:00:00Z', rejectionReason: 'No current business need for this access', createdAt: '2024-11-08T10:00:00Z', updatedAt: '2024-11-10T10:00:00Z' },
  
  // More varied requests to reach 40
  { id: 'req-22', type: 'signup', title: 'Request Developer Role', description: 'Developer role for infrastructure work', status: 'approved', requesterId: 'user-7', data: { requestedRole: 'developer', justification: 'Infrastructure automation development', teamName: 'Platform Team' }, approverId: 'user-2', approvedAt: '2024-03-10T10:00:00Z', createdAt: '2024-03-09T10:00:00Z', updatedAt: '2024-03-10T10:00:00Z' },
  { id: 'req-23', type: 'signup', title: 'Request Developer Role', description: 'Developer access for data team', status: 'approved', requesterId: 'user-8', data: { requestedRole: 'developer', justification: 'Data engineering work', teamName: 'Data Engineering' }, approverId: 'user-1', approvedAt: '2024-02-20T10:00:00Z', createdAt: '2024-02-19T10:00:00Z', updatedAt: '2024-02-20T10:00:00Z' },
  { id: 'req-24', type: 'signup', title: 'Request Developer Role', description: 'Developer role request', status: 'approved', requesterId: 'user-9', data: { requestedRole: 'developer', justification: 'Analytics development', teamName: 'Data Engineering' }, approverId: 'user-1', approvedAt: '2024-02-25T10:00:00Z', createdAt: '2024-02-24T10:00:00Z', updatedAt: '2024-02-25T10:00:00Z' },
  
  { id: 'req-25', type: 'system-permission', title: 'Access to Search Service', description: 'Developer access for search improvements', status: 'pending', requesterId: 'user-5', data: { systemRef: 'search-service', systemName: 'Search Service', requestedRole: 'developer', justification: 'Improving search relevance' }, createdAt: '2024-12-27T10:00:00Z', updatedAt: '2024-12-27T10:00:00Z' },
  { id: 'req-26', type: 'system-permission', title: 'Access to Config Service', description: 'Need access for feature flags', status: 'pending', requesterId: 'user-7', data: { systemRef: 'config-service', systemName: 'Configuration Service', requestedRole: 'developer', justification: 'Feature flag implementation' }, createdAt: '2024-12-28T10:00:00Z', updatedAt: '2024-12-28T10:00:00Z' },
  
  { id: 'req-27', type: 'system-creation', title: 'Create Event Bus', description: 'Async event messaging system', status: 'pending', requesterId: 'user-6', data: { systemRef: 'event-bus', systemName: 'Event Bus', systemDescription: 'Async event-driven messaging infrastructure', tier: 'tier-1', lifecycle: 'development', tags: ['messaging', 'events', 'infrastructure'] }, createdAt: '2024-12-29T10:00:00Z', updatedAt: '2024-12-29T10:00:00Z' },
  
  { id: 'req-28', type: 'system-permission', title: 'Access to Logging Platform', description: 'Developer access for log analysis', status: 'approved', requesterId: 'user-4', data: { systemRef: 'logging-platform', systemName: 'Logging Platform', requestedRole: 'developer', justification: 'Setting up log-based alerts' }, approverId: 'user-1', approvedAt: '2024-11-25T10:00:00Z', createdAt: '2024-11-24T10:00:00Z', updatedAt: '2024-11-25T10:00:00Z' },
  
  { id: 'req-29', type: 'signup', title: 'Request PM Role', description: 'PM role for search team', status: 'pending', requesterId: 'user-4', data: { requestedRole: 'pm', justification: 'Taking product ownership of search', teamName: 'Search Team' }, createdAt: '2024-12-30T10:00:00Z', updatedAt: '2024-12-30T10:00:00Z' },
  
  { id: 'req-30', type: 'system-permission', title: 'PM Access to Search Service', description: 'PM role for search management', status: 'pending', requesterId: 'user-4', data: { systemRef: 'search-service', systemName: 'Search Service', requestedRole: 'pm', justification: 'Product management for search features' }, createdAt: '2024-12-31T10:00:00Z', updatedAt: '2024-12-31T10:00:00Z' },
  
  // Draft requests
  { id: 'req-31', type: 'signup', title: 'Draft: PM Role Request', description: 'Draft request for PM role', status: 'draft', requesterId: 'user-10', data: { requestedRole: 'pm', justification: 'Draft - incomplete' }, createdAt: '2024-12-30T10:00:00Z', updatedAt: '2024-12-30T10:00:00Z' },
  { id: 'req-32', type: 'system-creation', title: 'Draft: Cache Service', description: 'Distributed caching system', status: 'draft', requesterId: 'user-8', data: { systemRef: 'cache-service', systemName: 'Cache Service', systemDescription: 'Redis-based caching layer', tier: 'tier-2', lifecycle: 'development', tags: ['cache', 'redis'] }, createdAt: '2024-12-28T10:00:00Z', updatedAt: '2024-12-28T10:00:00Z' },
  
  // More historical approved/rejected
  { id: 'req-33', type: 'system-permission', title: 'Access to User Management', description: 'Developer access', status: 'approved', requesterId: 'user-7', data: { systemRef: 'user-management', systemName: 'User Management', requestedRole: 'developer', justification: 'Profile features development' }, approverId: 'user-6', approvedAt: '2024-04-15T10:00:00Z', createdAt: '2024-04-14T10:00:00Z', updatedAt: '2024-04-15T10:00:00Z' },
  { id: 'req-34', type: 'system-permission', title: 'Access to Notification Hub', description: 'Developer access for email integration', status: 'approved', requesterId: 'user-5', data: { systemRef: 'notification-hub', systemName: 'Notification Hub', requestedRole: 'developer', justification: 'Email template development' }, approverId: 'user-1', approvedAt: '2024-05-01T10:00:00Z', createdAt: '2024-04-30T10:00:00Z', updatedAt: '2024-05-01T10:00:00Z' },
  
  { id: 'req-35', type: 'system-permission', title: 'Access to ML Pipeline', description: 'Developer access for ML work', status: 'approved', requesterId: 'user-9', data: { systemRef: 'ml-pipeline', systemName: 'ML Pipeline', requestedRole: 'developer', justification: 'Model training infrastructure' }, approverId: 'user-8', approvedAt: '2024-07-01T10:00:00Z', createdAt: '2024-06-30T10:00:00Z', updatedAt: '2024-07-01T10:00:00Z' },
  
  { id: 'req-36', type: 'system-creation', title: 'Create Secrets Manager', description: 'Centralized secrets management', status: 'rejected', requesterId: 'user-6', data: { systemRef: 'secrets-manager', systemName: 'Secrets Manager', systemDescription: 'Vault-based secrets management', tier: 'tier-1', lifecycle: 'development', tags: ['security', 'secrets'] }, approverId: 'user-1', rejectedAt: '2024-08-15T10:00:00Z', rejectionReason: 'Using existing cloud provider secrets manager', createdAt: '2024-08-10T10:00:00Z', updatedAt: '2024-08-15T10:00:00Z' },
  
  { id: 'req-37', type: 'system-permission', title: 'PM Access to Legacy Billing', description: 'PM access for migration project', status: 'approved', requesterId: 'user-3', data: { systemRef: 'legacy-billing', systemName: 'Legacy Billing', requestedRole: 'pm', justification: 'Leading billing migration' }, approverId: 'user-1', approvedAt: '2024-01-20T10:00:00Z', createdAt: '2024-01-19T10:00:00Z', updatedAt: '2024-01-20T10:00:00Z' },
  
  { id: 'req-38', type: 'system-permission', title: 'Access to API Gateway', description: 'Developer access', status: 'approved', requesterId: 'user-6', data: { systemRef: 'api-gateway', systemName: 'API Gateway', requestedRole: 'developer', justification: 'Auth integration with gateway' }, approverId: 'user-1', approvedAt: '2024-03-20T10:00:00Z', createdAt: '2024-03-19T10:00:00Z', updatedAt: '2024-03-20T10:00:00Z' },
  
  { id: 'req-39', type: 'signup', title: 'Request Developer Role', description: 'Initial developer role', status: 'rejected', requesterId: 'user-10', data: { requestedRole: 'developer', justification: 'New hire onboarding' }, approverId: 'user-2', rejectedAt: '2024-04-05T10:00:00Z', rejectionReason: 'Please complete security training first', createdAt: '2024-04-03T10:00:00Z', updatedAt: '2024-04-05T10:00:00Z' },
  
  { id: 'req-40', type: 'system-permission', title: 'Access to Data Warehouse', description: 'PM access for analytics strategy', status: 'pending', requesterId: 'user-3', data: { systemRef: 'data-warehouse', systemName: 'Data Warehouse', requestedRole: 'pm', justification: 'Cross-functional analytics planning' }, createdAt: '2025-01-02T10:00:00Z', updatedAt: '2025-01-02T10:00:00Z' },
];

// ============ AUDIT LOG ============
export let auditLog: AuditLogEntry[] = [
  { id: 'audit-1', action: 'role_binding_created', actorId: 'user-1', actorName: 'Alice Chen', targetType: 'role_binding', targetId: 'rb-3', targetName: 'user-3 -> pm @ payment-gateway', details: { role: 'pm', scope: 'system:payment-gateway' }, timestamp: '2024-01-15T10:00:00Z' },
  { id: 'audit-2', action: 'request_approved', actorId: 'user-1', actorName: 'Alice Chen', targetType: 'request', targetId: 'req-1', targetName: 'Request PM Role', details: { requestType: 'signup', requesterId: 'user-3' }, timestamp: '2024-01-15T10:00:00Z' },
  { id: 'audit-3', action: 'cmdb_relationship_created', actorId: 'user-1', actorName: 'Alice Chen', targetType: 'system', targetId: 'sys-1', targetName: 'Payment Gateway', details: { relationshipType: 'manages', subjectId: 'user-3' }, timestamp: '2024-01-15T10:00:00Z' },
  { id: 'audit-4', action: 'request_approved', actorId: 'user-1', actorName: 'Alice Chen', targetType: 'request', targetId: 'req-2', targetName: 'Request Developer Role', details: { requestType: 'signup', requesterId: 'user-4' }, timestamp: '2024-02-10T10:00:00Z' },
  { id: 'audit-5', action: 'role_binding_created', actorId: 'user-3', actorName: 'Carol Johnson', targetType: 'role_binding', targetId: 'rb-7', targetName: 'user-4 -> developer @ payment-gateway', details: { role: 'developer', scope: 'system:payment-gateway' }, timestamp: '2024-02-10T10:00:00Z' },
  { id: 'audit-6', action: 'request_rejected', actorId: 'user-1', actorName: 'Alice Chen', targetType: 'request', targetId: 'req-7', targetName: 'Request PM Role', details: { requestType: 'signup', reason: 'Insufficient experience' }, timestamp: '2024-11-15T10:00:00Z' },
  { id: 'audit-7', action: 'system_created', actorId: 'user-1', actorName: 'Alice Chen', targetType: 'system', targetId: 'sys-11', targetName: 'ML Pipeline', details: { tier: 'tier-2', lifecycle: 'development' }, timestamp: '2024-06-01T10:00:00Z' },
  { id: 'audit-8', action: 'request_approved', actorId: 'user-1', actorName: 'Alice Chen', targetType: 'request', targetId: 'req-8', targetName: 'Create ML Pipeline System', details: { requestType: 'system-creation' }, timestamp: '2024-06-01T10:00:00Z' },
  { id: 'audit-9', action: 'role_binding_created', actorId: 'user-1', actorName: 'Alice Chen', targetType: 'role_binding', targetId: 'rb-10', targetName: 'user-8 -> developer @ data-warehouse', details: { role: 'developer', scope: 'system:data-warehouse' }, timestamp: '2024-03-01T10:00:00Z' },
  { id: 'audit-10', action: 'cmdb_relationship_created', actorId: 'user-1', actorName: 'Alice Chen', targetType: 'system', targetId: 'sys-5', targetName: 'Data Warehouse', details: { relationshipType: 'hasAccess', subjectId: 'user-8' }, timestamp: '2024-03-01T10:00:00Z' },
];

// ============ CURRENT USER (for mocking auth) ============
// Default: user-3 (Carol Johnson) who is a PM for payment-gateway
export let currentUser: CurrentUser = {
  ...users[2], // user-3 Carol Johnson
  roles: roleBindings.filter(rb => 
    (rb.subjectType === 'user' && rb.subjectId === 'user-3') ||
    (rb.subjectType === 'group' && groups.find(g => g.id === rb.subjectId)?.memberIds.includes('user-3'))
  ),
};

// Helper to switch current user for testing
export function setCurrentUser(userId: string) {
  const user = users.find(u => u.id === userId);
  if (user) {
    currentUser = {
      ...user,
      roles: roleBindings.filter(rb => 
        (rb.subjectType === 'user' && rb.subjectId === userId) ||
        (rb.subjectType === 'group' && groups.find(g => g.id === rb.subjectId)?.memberIds.includes(userId))
      ),
    };
  }
}

// Helper functions
export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getGroupById(id: string): Group | undefined {
  return groups.find(g => g.id === id);
}

export function getSystemById(id: string): System | undefined {
  return systems.find(s => s.id === id);
}

export function getSystemByRef(ref: string): System | undefined {
  return systems.find(s => s.ref === ref);
}

export function getSubjectName(id: string, type: 'user' | 'group'): string {
  if (type === 'user') {
    return getUserById(id)?.name || 'Unknown User';
  }
  return getGroupById(id)?.name || 'Unknown Group';
}
