"use client"

import AlertModal from '@/components/modals/alert-modals';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, Color, Image, Product, Size } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from "zod";
import { Checkbox } from "@/components/ui/checkbox"


interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;



export default function ProductForm({initialData, categories, colors, sizes}: ProductFormProps) {

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const emptyInitialData = { 
        name: "", 
        images: [],
        price: 0,
        categoryId: "",
        colorId: "",
        sizeId: "",
        isFeatured: false,
        isArchived: false,
    };

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData 
        ? { 
            ...initialData,
            price: parseFloat(initialData?.price),
          }
        : emptyInitialData,
    });

    const params = useParams<{ storeId: string; productId: string}>();
    const router = useRouter();

    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit a Product" : "Add a new Product";
    const toastMessage = initialData ? "Product updated" : "Product Created";
    const action = initialData ? "Save Changes" : "Create";

    const onSubmit = async (formValues: ProductFormValues) => {
        try {
            setIsLoading(true)
            if(initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, formValues)
            } else {
                await axios.post(`/api/${params.storeId}/products`, formValues)
            }

            toast.success(toastMessage);
            window.location.assign(`/${params?.storeId}/products`);

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false)
            setOpen(false)
        }
    }

    const onDeleteStore = async () => {
        try {
            setIsLoading(true)
            const response = await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh();
            toast.success("Product deleted");
            window.location.assign(`/${params.storeId}/products`);
        } catch (error) {
            toast.error("Make sure you remove all categories using this products first");
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
                name="images"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Images</FormLabel>
                        <FormControl>
                            <ImageUpload 
                                values={field.value.map((image) => image.url) } 
                                disabled={isLoading}
                                onChange={(url) => field.onChange([...field.value, { url }])}
                                onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                             />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                ) }
                />
                
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <FormField 
                 control={form.control}
                 name="name"
                 render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input  
                            disabled={isLoading} 
                            placeholder='Product name' 
                            {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 ) }
                />

                <FormField 
                 control={form.control}
                 name="price"
                 render={({field}) => (
                    <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input 
                            type='number'
                            disabled={isLoading} 
                            placeholder='9.99' 
                            {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 ) }
                />

                <FormField
                 control={form.control}
                 name="categoryId"
                 render={({field}) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                            <Select disabled={isLoading} 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="w-full ">
                                <SelectValue defaultValue={field.value}  placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                            <SelectContent>
                                {
                                    categories.map((category) => (
                                        <SelectItem
                                        className='cursor-pointer' 
                                        key={category.id} 
                                        value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                       
                            </Select>
                        <FormMessage />
                    </FormItem>
                 ) }
                />

                <FormField
                 control={form.control}
                 name="sizeId"
                 render={({field}) => (
                    <FormItem>
                        <FormLabel>Size</FormLabel>
                            <Select disabled={isLoading} 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="w-full ">
                                <SelectValue defaultValue={field.value}  placeholder="Select a size" />
                            </SelectTrigger>
                        </FormControl>
                            <SelectContent>
                                {
                                    sizes.map((size) => (
                                        <SelectItem
                                        className='cursor-pointer' 
                                        key={size.id} 
                                        value={size.id}>
                                            {size.name}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                       
                            </Select>
                        <FormMessage />
                    </FormItem>
                 ) }
                />

                <FormField
                 control={form.control}
                 name="colorId"
                 render={({field}) => (
                    <FormItem>
                        <FormLabel>Color</FormLabel>
                            <Select disabled={isLoading} 
                            onValueChange={field.onChange} 
                            value={field.value} 
                            defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="w-full ">
                                <SelectValue defaultValue={field.value}  placeholder="Select a color" />
                            </SelectTrigger>
                        </FormControl>
                            <SelectContent>
                                {
                                    colors.map((color) => (
                                        <SelectItem
                                        className='cursor-pointer' 
                                        key={color.id} 
                                        value={color.id}>
                                            {color.name}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                       
                            </Select>
                        <FormMessage />
                    </FormItem>
                 ) }
                />

                <FormField 
                 control={form.control}
                 name="isFeatured"
                 render={({field}) => (
                    <FormItem className='flex items-start space-x-3 space-y-0 rounded-md border p-4'>
                        
                        <FormControl>
                            <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                                />
                        </FormControl>
                        
                        <div className="space-y-1 leading-none">
                            <FormLabel>Featured</FormLabel>
                            <FormDescription>
                                This product will appear on the homepage
                            </FormDescription>
                        </div>
                        <FormMessage />
                    </FormItem>
                 ) }
                />

                <FormField 
                 control={form.control}
                 name="isArchived"
                 render={({field}) => (
                    <FormItem className='flex items-start space-x-3 space-y-0 rounded-md border p-4'>
                        
                        <FormControl>
                            <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange}
                                />
                        </FormControl>
                                
                        <div className="space-y-1 leading-none">
                            <FormLabel>Archived</FormLabel>
                            <FormDescription>
                                This product will not appear anywhere on the store
                            </FormDescription>
                        </div>
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