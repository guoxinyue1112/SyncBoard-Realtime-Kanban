import { createClient } from '@/utils/supabase/server'
import { CreateTaskDialog } from '@/components/kanban/create-task-dialog'
import { KanbanBoard } from '@/components/kanban/kanban-board'

export default async function Home() {
  const supabase = await createClient()
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('position', { ascending: true })

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold italic tracking-tighter">SyncBoard</h1>
        <CreateTaskDialog />
      </div>

      <KanbanBoard initialTasks={tasks || []} />
    </div>
  )
}