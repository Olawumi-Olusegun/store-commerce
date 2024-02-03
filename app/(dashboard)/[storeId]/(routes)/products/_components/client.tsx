"use client";


import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { ProductColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data.table';
import ApiList from '@/components/ui/api-list';

type Props = {
  data: ProductColumn[]
}

export default function ProductClient({data}: Props) {
    const router = useRouter();
    const params = useParams<{storeId: string}>();


  return (
    <>
    <div>
        <Heading 
        title={`Product (${data?.length})` }
        description='Manage products for your store'
        />
        <Button className='mt-2' onClick={() => router.push(`/${params.storeId}/products/new`)}>
            <Plus className='w-4 h-4 mr-2' />
            <span>Add New</span>
        </Button>
    </div>
    <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
      <Heading title='API' description='API calls for products' />
    <Separator />
    <ApiList entityIdName='productId' entityName='products' />
    </>
  )
}