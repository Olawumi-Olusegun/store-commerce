import { UserButton, auth } from '@clerk/nextjs'
import React from 'react'
import MainNav from './MainNav'
import StoreSwitcher from './store-switcher'
import { redirect } from 'next/navigation'
import prismadb from '@/lib/prismadb'

type Props = {}

export default async function Navbar({}: Props) {
    const { userId } = auth();

    if(!userId) {
        return redirect("/sign-in");
    }

    const stores = await prismadb.store.findMany({
        where: { userId }
    });


  return (
    <div className='border-b'>
        <div className="flex h-16 items-center px-4 gap-3">
            <StoreSwitcher items={stores} />
            <MainNav /> 
            <div className="ml-auto flex items-center space-x-4">
                <UserButton afterSignOutUrl='/' />
            </div>
        </div>
    </div>
  )
}