'use server'

import { createClient } from '@/utils/supabase/server'
import { CreateTaskInput } from '@/types/task'
import { revalidatePath } from 'next/cache'

export async function createTask(data: CreateTaskInput) {
  const supabase = await createClient()

  const { data: newTask, error } = await supabase
    .from('tasks')
    .insert([
      {
        title: data.title,
        content: data.content,
        status: data.status,
        priority: data.priority,
        position: data.position,
      }
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/') 
  return newTask
}