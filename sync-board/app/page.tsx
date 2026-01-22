import { createClient } from '@/utils/supabase/server'
import { CreateTaskDialog } from '@/components/kanban/create-task-dialog'

export default async function Home() {
  const supabase = await createClient()
  
  // 按 position 排序获取所有任务
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .order('position', { ascending: true })

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">SyncBoard</h1>
        <CreateTaskDialog />
      </div>

      <div className="grid gap-3">
        {tasks?.map(task => (
          <div key={task.id} className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            {task.content && <p className="text-gray-500 text-sm mt-1">{task.content}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}