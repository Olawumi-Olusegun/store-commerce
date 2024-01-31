"use client"

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Store } from '@prisma/client'
import { Trash } from 'lucide-react';
import React from 'react'

interface SettingsFormProps {
    initialData: Store;
}

export default function SettingsForm({initialData}: SettingsFormProps) {


  return (
    <div className='flex items-center justify-between'>
        <Heading title="Settings" description="Manage store settings" />
        <Button variant="destructive" size="icon" onClick={() => {}}>
            <Trash className='h-4 w-4' />
        </Button>
    </div>
  )
}