"use client";


import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import React from 'react'
import { OrderColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data.table';

type Props = {
  data: OrderColumn[]
}

export default function OrderClient({data}: Props) {

  return (
    <>
    <div>
        <Heading 
        title={`Orders (${data?.length})` }
        description='Manage orders for your store'
        />
    </div>
    <Separator />
      <DataTable searchKey='label' columns={columns} data={data} />
    </>
  )
}