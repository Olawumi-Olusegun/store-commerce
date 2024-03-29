"use client";


import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { BillboardColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data.table';
import ApiList from '@/components/ui/api-list';

type Props = {
  data: BillboardColumn[]
}

export default function BillboardClient({data}: Props) {
    const router = useRouter();
    const params = useParams<{storeId: string}>();


  return (
    <>
    <div>
        <Heading 
        title={`Billboard (${data?.length})` }
        description='Manage billboards for your store'
        />
        <Button className='mt-2' onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
            <Plus className='w-4 h-4 mr-2' />
            <span>Add New</span>
        </Button>
    </div>
    <Separator />
      <DataTable searchKey='label' columns={columns} data={data} />
      <Heading title='API' description='API calls for billboards' />
    <Separator />
    <ApiList entityIdName='billboardId' entityName='billboards' />
    </>
  )
}