
import prismadb from '@/lib/prismadb';
import React from 'react'

interface DashboardPageProps {
  params: {
    storeId: string;
  },
}

export default async function DashboardPage({params: { storeId }}: DashboardPageProps) {
  
  const store = await prismadb.store.findFirst({
    where: { id: storeId }
  });



  return (
    <div>
      DashboardPage 
      </div>
  )
}