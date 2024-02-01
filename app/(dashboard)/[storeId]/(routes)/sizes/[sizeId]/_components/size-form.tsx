"use client"

import AlertModal from '@/components/modals/alert-modals';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Size } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from "zod";


interface SizeFormProps {
    initialData: Size | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

type SizeFormValues = z.infer<typeof formSchema>;



export default function SizeForm({initialData}: SizeFormProps) {

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const emptyInitialData = { name: "", value: ""};

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || emptyInitialData,
    });

    const params = useParams<{storeId: string; sizeId: string}>();
    const router = useRouter();

    const title = initialData ? "Edit Size" : "Create Size";
    const description = initialData ? "Edit a size" : "Add a new Size";
    const toastMessage = initialData ? "Size updated" : "Size Created";
    const action = initialData ? "Save Changes" : "Create";

    const onSubmit = async (formValues: SizeFormValues) => {
        try {
            setIsLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, formValues)
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, formValues)
            }

            toast.success(toastMessage);
            window.location.assign(`/${params?.storeId}/sizes`);

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    const onDeleteStore = async () => {
        try {
            setIsLoading(true)
            const response = await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.refresh();
            toast.success("Size deleted");
            window.location.assign(`/${params.storeId}/sizes`);
        } catch (error) {
            toast.error("Make sure you remove all products using this size first");
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <>
    <AlertModal  
     isOpen={open}
     onClose={() => setOpen(false)}
     onConfirm={() => onDeleteStore}
     isLoading={isLoading}
    />
    <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {
            initialData ? (
                <Button disabled={isLoading} variant="destructive" size="icon" onClick={() => setOpen(true)}>
                    <Trash className='h-4 w-4' />
                </Button>
            ) : null
        }
    </div>
    <Separator />
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                           
            <div className="grid grid-cols-3 gap-8">
                <FormField 
                 control={form.control}
                 name="name"
                 render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input  
                            disabled={isLoading} 
                            placeholder='Size name' 
                            {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 ) }
                />
                <FormField 
                 control={form.control}
                 name="value"
                 render={({field}) => (
                    <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                            <Input  
                            disabled={isLoading} 
                            placeholder='Size value' 
                            {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 ) }
                />
            </div>
            <Button disabled={isLoading} className='ml-auto' >{action}</Button>
        </form>
    </Form>
    </>
  )
}