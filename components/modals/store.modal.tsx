"use client";

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import { useStoremodal } from '@/hooks/use-store.modal';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios'
import toast from 'react-hot-toast';


const formSchema = z.object({
  name: z.string().min(1),
});



type Props = {}

export default function StoreModal({}: Props) {

  const [isLoading, setIsLoading] = useState(false);
 
  const storeModal = useStoremodal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    }
  });

  const onSubmit = async (formValues: z.infer<typeof formSchema>) => {

    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/stores", formValues);

      window.location.assign(`/${data.id}`);
      
    } catch (error) {
      console.log({error})
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <Modal
    title="Create Store"
    description="Add a new stroe to manage products and categories"
    onClose={storeModal.onClose}
    isOpen={storeModal.isOpen}
    >
      <div>
        <div className='space-y-4 py-2 pb-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField control={form.control} name='name' render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder='E-commerce' {...field} />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )} />
              <div className="pt-6 space-x-2 flex items-center justify-end">
                <Button 
                variant="outline" 
                onClick={() => storeModal.onClose}
                disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} type='submit'>Continue</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}