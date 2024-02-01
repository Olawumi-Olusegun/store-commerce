"use client";


import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { columns } from './columns';
import { DataTable } from '@/components/ui/data.table';
import ApiList from '@/components/ui/api-list';
import { SizeColumn } from '../../sizes/_components/columns';

type Props = {
  data: SizeColumn[]
}

export default function ColorClient({data}: Props) {
    const router = useRouter();
    const params = useParams<{storeId: string}>();

  return (
    <>
    <div>
        <Heading 
        title={`Colors (${data?.length})` }
        description='Manage colors for your store'
        />
        <Button className='mt-2' onClick={() => router.push(`/${params.storeId}/colors/new`)}>
            <Plus className='w-4 h-4 mr-2' />
            <span>Add New</span>
        </Button>
    </div>
    <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
      <Heading title='API' description='API calls for colors' />
    <Separator />
    <ApiList entityIdName='colorId' entityName='colors' />
    </>
  )
}