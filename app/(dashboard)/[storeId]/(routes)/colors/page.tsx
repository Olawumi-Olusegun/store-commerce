
import React from 'react'
import prismadb from '@/lib/prismadb'
import { format } from "date-fns";
import { Color } from '@prisma/client';
import ColorClient from './_components/client';
import { ColorColumn } from './_components/columns';

type Props = {
  params: { storeId: string }
}

export default async function ColorsPage({params: { storeId }}: Props) {

  const colors = await prismadb.color.findMany({
    where: { storeId },
    orderBy: { 
      createdAt: "desc"
    }
  });


  const formattedColors: ColorColumn[] = colors.map((color: Color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, "MMMM do, yyyy"),
  }));


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ColorClient data={formattedColors} />
        </div>
    </div>
  )
}