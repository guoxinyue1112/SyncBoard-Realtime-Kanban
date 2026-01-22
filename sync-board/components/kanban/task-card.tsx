'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/types/task'

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
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 mb-3 border rounded-xl bg-white shadow-sm cursor-grab active:cursor-grabbing hover:border-primary transition-colors group"
    >
      <h3 className="font-semibold">{task.title}</h3>
      {task.content && (
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{task.content}</p>
      )}
    </div>
  )
}