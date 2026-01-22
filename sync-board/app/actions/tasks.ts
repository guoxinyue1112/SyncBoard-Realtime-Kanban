'use server'

import { createClient } from '@/utils/supabase/server'
import { CreateTaskInput } from '@/types/task'
import { revalidatePath } from 'next/cache'

export async function createTask(data: CreateTaskInput) {
  const supabase = await createClient()
  const { data: newTask, error } = await supabase.from('tasks').insert([data]).select().single()
  if (error) throw new Error(error.message)
  revalidatePath('/')
  return newTask
}

export async function updateTaskPosition(taskId: string, newPosition: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('tasks')
    .update({ position: newPosition })
    .eq('id', taskId)

  if (error) throw new Error(error.message)
  // 注意：在 Realtime 开启的情况下，这里 revalidatePath 主要为了同步其他非实时组件
  revalidatePath('/') 
}