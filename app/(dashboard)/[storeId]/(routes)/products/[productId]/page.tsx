
import React from 'react'
import prismadb from '@/lib/prismadb'
import ProductForm from './_components/product-form';

type Props = {
    params: { productId: string, storeId: string; }
}

export default async function ProductPageWithId({params: { productId, storeId }}: Props) {
    const product = await prismadb.product.findUnique({
        where: { id: productId },
        include: {
            images: true,
        }
    });


    const categories = await prismadb.product.findMany({
        where: {
            storeId,
        }
    });

    const sizes = await prismadb.size.findMany({
        where: {
            storeId,
        }
    });

    const colors = await prismadb.color.findMany({
        where: {
            storeId,
        }
    });

  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8">
            <ProductForm 
            initialData={product}
            categories={categories} 
            sizes={sizes} 
            colors={colors} 
            />
        </div>
    </div>
  )
}