
import React from 'react'
import BillboardClient from './_components/client'
import prismadb from '@/lib/prismadb'
import { BillboardColumn } from './_components/columns'
import { format } from "date-fns";
import { Billboard } from '@prisma/client';

type Props = {
  params: { storeId: string }
}

export default async function BillboardPage({params: { storeId }}: Props) {

  const billboards = await prismadb.billboard.findMany({
    where: { storeId },
    orderBy: { 
      createdAt: "desc"
    }
  });


  const formattedBillboards: BillboardColumn[] = billboards.map((billboard: Billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
  }));


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <BillboardClient data={formattedBillboards} />
        </div>
    </div>
  )
}