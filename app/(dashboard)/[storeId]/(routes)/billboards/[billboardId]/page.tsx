
import React from 'react'
import prismadb from '@/lib/prismadb'
import BillboardForm from './_components/billboard-form';

type Props = {
    params: { billboardId: string }
}

export default async function BillboardPageWithId({params: {billboardId}}: Props) {
    const billboard = await prismadb.billboard.findUnique({
        where: { id: billboardId }
    });


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8">
            <BillboardForm initialData={billboard} />
        </div>
    </div>
  )
}