
import React from 'react'
import OrderClient from './_components/client'
import prismadb from '@/lib/prismadb'
import { OrderColumn } from './_components/columns'
import { format } from "date-fns";
import { Order, OrderItem } from '@prisma/client';
import { currencyFormatter } from '@/lib/utils';

type Props = {
  params: { storeId: string }
}

export default async function OrderPage({params: { storeId }}: Props) {

  const orders = await prismadb.order.findMany({
    where: { storeId },
    include: {
      orderItem: {
        include: {
          product: true
        }
      }
    },
    orderBy: { 
      createdAt: "desc"
    }
  });


  const formattedOrders: OrderColumn[] = orders.map((order: Order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    isPaid: order.isPaid,
    products: order.orderItems.map((orderItem: OrderItem) => orderItem.product.name ).join(", "),
    totalPrice: currencyFormatter(order.orderItems.reduce((total:any, item:any) => {
      return total + Number(item.product.price);
    }, 0)),
    createdAt: format(order.createdAt, "MMMM do, yyyy"),
  }));


  return (
    <div className='flex flex-col'>
        <div className="flex-1 space-y-4 p-8 pt-6">
            <OrderClient data={formattedOrders} />
        </div>
    </div>
  )
}