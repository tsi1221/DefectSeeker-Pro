
export enum UserRole {
  QA = 'QA Tester',
  DEVELOPER = 'Developer',
  MANAGER = 'Project Manager'
}

export enum DefectStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
  REOPENED = 'Reopened'
}

export enum DefectSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Defect {
  id: string;
  title: string;
  description: string;
  status: DefectStatus;
  severity: DefectSeverity;
  category: string;
  reporterId: string;
  assigneeId?: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  aiReasoning?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Archived' | 'Planning';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'Assignment' | 'Update' | 'Alert';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  defects: Defect[];
  users: User[];
  projects: Project[];
  notifications: Notification[];
}
