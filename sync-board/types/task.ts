export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  content: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  created_at: string; // 对应数据库的 createtime
}

// 输入类型也同步去掉 project_id
export type CreateTaskInput = Omit<Task, 'id' | 'created_at'>;