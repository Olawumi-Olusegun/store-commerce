"use client"

import AlertModal from '@/components/modals/alert-modals';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard, Category } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from "zod";


interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[]
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;



export default function CategoryForm({initialData, billboards}: CategoryFormProps) {

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const emptyInitialData = { name: "", billboardId: ""};

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || emptyInitialData,
    });

    const params = useParams<{storeId: string; categoryId: string}>();
    const router = useRouter();

    const title = initialData ? "Edit Billboard" : "Create Category";
    const description = initialData ? "Edit a category" : "Add a new Category";
    const toastMessage = initialData ? "Category updated" : "Category Created";
    const action = initialData ? "Save Changes" : "Create";

    const onSubmit = async (formValues: CategoryFormValues) => {
        try {
            setIsLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, formValues)
            } else {
                await axios.post(`/api/${params.storeId}/categories`, formValues)
            }

            toast.success(toastMessage);
            window.location.assign(`/${params?.storeId}/categories`);

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false)
        }
    }

    const onDeleteStore = async () => {
        try {
            setIsLoading(true)
            const response = await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh();
            toast.success("Category deleted");
            window.location.assign(`/${params.storeId}/categories`);
        } catch (error) {
            toast.error("Make sure you remove all products using this categories first");
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
                            placeholder='Category name' 
                            {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                ) }
                />         
                
                <FormField 
                 control={form.control}
                 name="billboardId"
                 render={({field}) => (
                    <FormItem>
                        <FormLabel>Billboard</FormLabel>
                            <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue defaultValue={field.value}  placeholder="Select a billboard" />
                            </SelectTrigger>
                        </FormControl>
                            <SelectContent>
                                {
                                    billboards.map((billboard) => (
                                        <SelectItem 
                                        key={billboard.id} 
                                        value={billboard.id}>
                                            {billboard.label}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                       
                            </Select>
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