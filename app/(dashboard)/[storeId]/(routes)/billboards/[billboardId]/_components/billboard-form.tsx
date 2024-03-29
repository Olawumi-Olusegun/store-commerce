"use client"

import AlertModal from '@/components/modals/alert-modals';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from "zod";


interface BillboardFormProps {
    initialData: Billboard | null;
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;



export default function BillboardForm({initialData}: BillboardFormProps) {

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const emptyInitialData = { label: "", imageUrl: ""};

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || emptyInitialData,
    });

    const params = useParams<{storeId: string; billboardId: string}>();
    const router = useRouter();

    const title = initialData ? "Edit Billboard" : "Create Billboard";
    const description = initialData ? "Edit a billboard" : "Add a new Billboard";
    const toastMessage = initialData ? "Billboard updated" : "Billboard Created";
    const action = initialData ? "Save Changes" : "Create";

    const onSubmit = async (formValues: BillboardFormValues) => {
        try {
            setIsLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, formValues)
            } else {
                await axios.post(`/api/${params.storeId}/billboards`, formValues)
            }

            toast.success(toastMessage);
            window.location.assign(`/${params?.storeId}/billboards`);

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false)
        }
    }

    const onDeleteStore = async () => {
        try {
            setIsLoading(true)
            const response = await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh();
            toast.success("Billboard deleted");
            window.location.assign(`/${params.storeId}/billboards`);
        } catch (error) {
            toast.error("Make sure you remove all categories using this billboard first");
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
            
            <FormField 
                control={form.control}
                name="imageUrl"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Background Image</FormLabel>
                        <FormControl>
                            <ImageUpload 
                                values={field.value ? [field.value] : [] } 
                                disabled={isLoading}
                                onChange={(url) => field.onChange(url)}
                                onRemove={(url) => field.onChange("")}
                             />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                ) }
                />
                
            <div className="grid grid-cols-3 gap-8">
                <FormField 
                 control={form.control}
                 name="label"
                 render={({field}) => (
                    <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                            <Input  
                            disabled={isLoading} 
                            placeholder='Billboard label' 
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