
import React from 'react'
import CategoryClient from './_components/client'
import prismadb from '@/lib/prismadb'
import { CategoriesColumn } from './_components/columns'
import { format } from "date-fns";
import { Category } from '@prisma/client';

type Props = {
  params: { storeId: string }
}

export default async function CategoryPage({params: { storeId }}: Props) {

  const categories = await prismadb.category.findMany({
    where: { storeId },
    include: {
      billboard: true
    },
    orderBy: { 
      createdAt: "desc"
    }
  });


  const formattedCategories: CategoriesColumn[] = categories.map((category: Category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, "MMMM do, yyyy"),
  }));


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryClient data={formattedCategories} />
        </div>
    </div>
  )
}