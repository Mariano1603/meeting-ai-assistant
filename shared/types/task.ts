export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  due_date?: string;
  status: TaskStatus;
  priority: TaskPriority;
  meeting_id: string;
  created_at: string;
  updated_at: string;
}

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed"
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent"
}

export interface TaskCreate {
  title: string;
  description?: string;
  assignee?: string;
  due_date?: string;
  priority?: TaskPriority;
  meeting_id: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  assignee?: string;
  due_date?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

