'use client';

import { Input } from '@/components/ui';
import { Form, FormField, FormControl, FormDescription, FormMessage, FormLabel, FormItem } from '@/components/ui/form';
import { cn } from '@/shared/lib/utils';
import { Description } from '@radix-ui/react-dialog';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodReadonly } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Tiptap from './Tiptap';


interface Props {

  className?: string;
}

export const TextForm: React.FC<Props> = ({ className }) => {

  const formSchema = z.object({
    title: z.string().min(1, {
      message: 'Title must be at least 1 characters.',
    }),
    description: z.string().min(1, {
      message: 'Description must be at least 1 characters.',
    }).max(1000, {
      message: 'Description must be at most 1000 characters.',
    }).trim()
  })

  function onSubmit(values: z.infer<typeof formSchema>){
    //dosomething
    console.log(values);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
    },
  });

  return (
    <div className={cn("p-24",className)}>
      <Form {...form}>

        <form onSubmit={form.handleSubmit((data) => onSubmit(data))} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Main Title' {...field}/>
              </FormControl>
              <FormMessage/>
          </FormItem>
        )}></FormField>
        

        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Tiptap description={field.value || ''}  onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>

      </form>
      </Form>
    </div>
    
  );
};