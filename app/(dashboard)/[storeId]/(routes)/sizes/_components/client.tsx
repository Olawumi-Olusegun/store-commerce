"use client";


import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { SizeColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data.table';
import ApiList from '@/components/ui/api-list';

type Props = {
  data: SizeColumn[]
}

export default function SizeClient({data}: Props) {
    const router = useRouter();
    const params = useParams<{storeId: string}>();

  return (
    <>
    <div>
        <Heading 
        title={`Sizes (${data?.length})` }
        description='Manage sizes for your store'
        />
        <Button className='mt-2' onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
            <Plus className='w-4 h-4 mr-2' />
            <span>Add New</span>
        </Button>
    </div>
    <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
      <Heading title='API' description='API calls for sizes' />
    <Separator />
    <ApiList entityIdName='sizeId' entityName='sizes' />
    </>
  )
}