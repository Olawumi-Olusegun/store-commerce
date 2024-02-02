
import React from 'react'
import prismadb from '@/lib/prismadb'
import { format } from "date-fns";
import { Product } from '@prisma/client';
import { ProductColumn } from './_components/columns';
import { currencyFormatter } from '@/lib/utils';
import ProductClient from './_components/client';

type Props = {
  params: { storeId: string }
}

export default async function ProductsPage({params: { storeId }}: Props) {

  const products = await prismadb.product.findMany({
    where: { storeId },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: { 
      createdAt: "desc"
    }
  });


  const formattedProducts: ProductColumn[] = products.map((product: Product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: currencyFormatter(product.price.toNumber()),
    size: product.size,
    color: product.color.value,
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
  }));


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductClient data={formattedProducts} />
        </div>
    </div>
  )
}