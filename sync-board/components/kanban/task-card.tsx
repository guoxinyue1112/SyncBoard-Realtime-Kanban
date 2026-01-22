'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/types/task'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    // 使用 Translate 替代 Transform 可以防止某些浏览器下的模糊问题
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "p-4 border rounded-xl bg-card shadow-sm cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-primary/20 transition-all",
        isDragging && "opacity-50 z-50 shadow-xl border-primary bg-accent"
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
            #{String(task.id).slice(-5)}
          </span>
          <div className="h-2 w-2 rounded-full bg-blue-400" title={task.status} />
        </div>
        
        <h3 className="font-semibold leading-none tracking-tight mt-1">
          {task.title}
        </h3>
        
        {task.content && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 italic">
            {task.content}
          </p>
        )}
      </div>
    </div>
  )
}