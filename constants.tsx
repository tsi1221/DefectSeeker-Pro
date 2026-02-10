
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
  { id: 'u1', name: 'Alice Smith', email: 'alice@defectseeker.pro', role: UserRole.MANAGER, avatar: 'https://picsum.photos/seed/alice/100' },
  { id: 'u2', name: 'Bob Johnson', email: 'bob@defectseeker.pro', role: UserRole.QA, avatar: 'https://picsum.photos/seed/bob/100' },
  { id: 'u3', name: 'Charlie Davis', email: 'charlie@defectseeker.pro', role: UserRole.DEVELOPER, avatar: 'https://picsum.photos/seed/charlie/100' },
  { id: 'u4', name: 'Diana Prince', email: 'diana@defectseeker.pro', role: UserRole.DEVELOPER, avatar: 'https://picsum.photos/seed/diana/100' },
];

export const INITIAL_DEFECTS: Defect[] = [
  {
    id: 'DEF-101',
    title: 'Login page crashes on mobile',
    description: 'When tapping the login button on iOS Chrome, the app crashes completely.',
    status: DefectStatus.OPEN,
    severity: DefectSeverity.CRITICAL,
    category: 'UI/UX',
    reporterId: 'u2',
    assigneeId: 'u3',
    projectId: 'p1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [
      { id: 'c1', authorId: 'u3', authorName: 'Charlie Davis', content: 'Checking logs now. Might be a CSS animation issue.', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    aiReasoning: 'Critical crash in core functionality (Login) affecting mobile users.'
  },
  {
    id: 'DEF-102',
    title: 'Profile image not uploading',
    description: 'The S3 bucket returns a 403 error when trying to upload profile pics.',
    status: DefectStatus.IN_PROGRESS,
    severity: DefectSeverity.HIGH,
    category: 'Backend API',
    reporterId: 'u2',
    assigneeId: 'u4',
    projectId: 'p2',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    comments: [],
    aiReasoning: 'Major feature failure affecting user profile completeness.'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u1', type: 'Alert', title: 'High Severity Issue', message: 'A new critical defect has been logged for Phoenix Redesign.', read: false, createdAt: new Date().toISOString() },
  { id: 'n2', userId: 'u3', type: 'Assignment', title: 'New Bug Assigned', message: 'You have been assigned DEF-101.', read: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
];
