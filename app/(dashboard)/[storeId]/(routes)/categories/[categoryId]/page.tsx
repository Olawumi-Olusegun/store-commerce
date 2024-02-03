
import React from 'react'
import prismadb from '@/lib/prismadb'
import CategoryForm from './_components/category-form';

type Props = {
    params: { categoryId: string; storeId: string; }
}

export default async function CategoryPageWithId({params: {categoryId, storeId}}: Props) {
    const category = await prismadb.category.findUnique({
        where: { id: categoryId }
    });

    const categories = await prismadb.category.findMany({
        where: { storeId }
    });

  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8">
            <CategoryForm initialData={category} categories={categories} />
        </div>
    </div>
  )
}