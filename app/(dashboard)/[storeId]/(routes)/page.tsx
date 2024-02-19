
import { getTotalRevenue } from '@/actions/get-total-revenue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { currencyFormatter } from '@/lib/utils';
import { CreditCard, DollarSign, Package } from 'lucide-react';
import React from 'react'

interface DashboardPageProps {
  params: {
    storeId: string;
  },
}

export default async function DashboardPage({params: { storeId }}: DashboardPageProps) {
  
  const totalRevenue = await getTotalRevenue(storeId);

  const salesCount = () => {}
  const stockCount = () => {}

  return (
    <div className='flex-col'>
      <div className="flex-col space-y-4 p-8 pt-6">
        <Heading title='Dashboard' description='Overview of your store' />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currencyFormatter(totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className='text-sm font-medium'>Sales</CardTitle>
              <CreditCard className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +25
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className='text-sm font-medium'>Products in stocks</CardTitle>
              <Package className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                12
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      </div>
  )
}