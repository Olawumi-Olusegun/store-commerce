
import React from 'react'
import prismadb from '@/lib/prismadb'
import { SizeColumn } from './_components/columns'
import { format } from "date-fns";
import { Size } from '@prisma/client';
import SizeClient from './_components/client';

type Props = {
  params: { storeId: string }
}

export default async function SizesPage({params: { storeId }}: Props) {

  const sizes = await prismadb.size.findMany({
    where: { storeId },
    orderBy: { 
      createdAt: "desc"
    }
  });


  const formattedSizes: SizeColumn[] = sizes.map((size: Size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SizeClient data={formattedSizes} />
        </div>
    </div>
  )
}