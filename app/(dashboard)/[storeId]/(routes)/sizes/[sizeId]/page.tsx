
import React from 'react'
import prismadb from '@/lib/prismadb'
import SizeForm from './_components/size-form';

type Props = {
    params: { sizeId: string }
}

export default async function SizePageWithId({params: {sizeId}}: Props) {
   
   console.log({ SizePageWithId: sizeId })
    const size = await prismadb.size.findUnique({
        where: { id: sizeId }
    });


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8">
            <SizeForm initialData={size} />
        </div>
    </div>
  )
}