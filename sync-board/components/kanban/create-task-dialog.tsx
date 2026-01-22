'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createTask } from '@/app/actions/tasks'
import { toast } from 'sonner'

const formSchema = z.object({
  title: z.string().min(2, '标题太短了'),
  content: z.string().optional(),
})

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', content: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createTask({
        ...values,
        content: values.content || null,
        status: 'todo',
        priority: 'medium',
        position: Date.now(),
      })
      toast.success('创建成功')
      setOpen(false)
      form.reset()
    } catch (e) {
      toast.error('创建失败')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> 新任务</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>添加新任务</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem><FormLabel>标题</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem><FormLabel>内容</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <Button type="submit" className="w-full">保存</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}