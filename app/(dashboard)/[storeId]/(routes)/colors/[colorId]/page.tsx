
import React from 'react'
import prismadb from '@/lib/prismadb'
import SizeForm from './_components/color-form';

type Props = {
    params: { colorId: string }
}

export default async function ColorPageWithId({params: {colorId}}: Props) {
   

    const size = await prismadb.color.findUnique({
        where: { id: colorId }
    });


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8">
            <SizeForm initialData={size} />
        </div>
    </div>
  )
}