"use client";


import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'

type Props = {}

export default function BillboardClient({}: Props) {
    const router = useRouter();
    const params = useParams<{storeId: string}>();


  return (
    <>
    <div>
        <Heading 
        title='Billboard (0)' 
        description='Manage billboards for your store'
        />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
            <Plus className='w-4 h-4 mr-2' />
            <span>Add New</span>
        </Button>
    </div>
    <Separator />
    </>
  )
}