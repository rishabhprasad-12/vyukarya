// Workspace Member Schema Model
export const WORKSPACE_ROLE = ["Owner", "Admin", "Member"] as const;
export type workspaceMemberRole = typeof WORKSPACE_ROLE[number];

// Project Schema Model
export const PROJECT_VISIBILITY = ["Public", "Private"] as const;
export type projectVisibility = typeof PROJECT_VISIBILITY[number];

export const PROJECT_STATUS = ["Not Started", "In Process", "Pending", "Blocked", "Completed", "Cancelled"] as const;
export type projectStatus = typeof PROJECT_STATUS[number];

// Task Schema MOdel
export const TASK_STATUS = ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'] as const;
export type taskStatus = typeof TASK_STATUS[number];

export const TASK_PRIORITY = ['Low', 'Medium', "High", "Urgent"] as const;
export type taskPriority = typeof TASK_PRIORITY[number];