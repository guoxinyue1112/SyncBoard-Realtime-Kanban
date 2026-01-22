'use client'

import { useEffect, useState } from 'react'
import { 
  DndContext, 
  closestCenter, 
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable'
import { Task } from '@/types/task'
import { TaskCard } from './task-card'
import { createClient } from '@/utils/supabase/client'
import { updateTaskPosition } from '@/app/actions/tasks'
import { toast } from 'sonner'

export function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isMounted, setIsMounted] = useState(false)
  const supabase = createClient()

  // 传感器配置：防止点击按钮被误判为拖拽
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  // 1. 处理挂载状态，解决 Hydration Error
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 2. 实时同步逻辑
  useEffect(() => {
    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTask = payload.new as Task
            setTasks((prev) => [...prev, newTask].sort((a, b) => a.position - b.position))
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = payload.new as Task
            setTasks((prev) => {
              const exists = prev.find(t => t.id === updatedTask.id)
              if (!exists) return [...prev, updatedTask].sort((a, b) => a.position - b.position)
              return prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
                .sort((a, b) => a.position - b.position)
            })
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  // 3. 拖拽结束逻辑
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id)
      const newIndex = tasks.findIndex((t) => t.id === over.id)
      
      const newTasks = arrayMove(tasks, oldIndex, newIndex)
      setTasks(newTasks) // 乐观更新 UI

      // 计算新 Position
      const prevTask = newTasks[newIndex - 1]
      const nextTask = newTasks[newIndex + 1]
      let newPos: number

      if (!prevTask) newPos = nextTask.position - 1000
      else if (!nextTask) newPos = prevTask.position + 1000
      else newPos = (prevTask.position + nextTask.position) / 2

      try {
        await updateTaskPosition(active.id as string, newPos)
      } catch (error) {
        setTasks(initialTasks) // 失败回滚
        toast.error("位置同步失败")
      }
    }
  }

  if (!isMounted) return <div className="space-y-3">{initialTasks.map(t => <div key={t.id} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}</div>

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}