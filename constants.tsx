
import { UserRole, DefectStatus, DefectSeverity, User, Defect, Project, Notification } from './types';

export const CATEGORIES = [
  'UI/UX',
  'Backend API',
  'Database',
  'Performance',
  'Security',
  'Functional',
  'Integration'
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Phoenix Redesign', description: 'Major overhaul of the main customer dashboard.', status: 'Active', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
  { id: 'p2', name: 'API Gateway v2', description: 'Upgrading the core infrastructure to support gRPC.', status: 'Active', createdAt: new Date(Date.now() - 86400000 * 60).toISOString() },
  { id: 'p3', name: 'Security Audit 2024', description: 'Internal security patching and pen-testing.', status: 'Planning', createdAt: new Date().toISOString() },
];

export const MOCK_USERS: User[] = [
  { id: 'admin', name: 'System Admin', email: 'admin@defectseeker.pro', role: UserRole.ADMIN, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' },
  { id: 'u1', name: 'Alice Smith', email: 'alice@defectseeker.pro', role: UserRole.MANAGER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: 'u2', name: 'Bob Johnson', email: 'bob@defectseeker.pro', role: UserRole.QA, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: 'u3', name: 'Charlie Davis', email: 'charlie@defectseeker.pro', role: UserRole.DEVELOPER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
];

export const INITIAL_DEFECTS: Defect[] = [
  {
    id: 'DEF-101',
    title: 'Authentication bypass via token manipulation',
    description: 'Exploit found where modifying the JWT sub field allows acting as another user.',
    status: DefectStatus.OPEN,
    severity: DefectSeverity.CRITICAL,
    predictedSeverity: DefectSeverity.CRITICAL,
    category: 'Security',
    reporterId: 'u2',
    assigneeId: 'u3',
    projectId: 'p2',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [],
    aiReasoning: 'Security vulnerability involving authentication bypass is a critical threat.'
  },
  {
    id: 'DEF-102',
    title: 'Button color mismatch on dark mode',
    description: 'The primary button is indigo-600 in light mode but hard to see in dark mode.',
    status: DefectStatus.IN_PROGRESS,
    severity: DefectSeverity.LOW,
    predictedSeverity: DefectSeverity.LOW,
    category: 'UI/UX',
    reporterId: 'u2',
    assigneeId: 'u3',
    projectId: 'p1',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
    aiReasoning: 'Visual inconsistency without functional impact is typically low severity.'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'admin', type: 'Alert', title: 'System Initialization', message: 'Welcome to DefectSeeker Pro. All modules are online.', read: false, createdAt: new Date().toISOString() },
];
