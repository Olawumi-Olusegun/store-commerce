
import React, { PropsWithChildren } from 'react'


export default function AuthLayout({children}: PropsWithChildren) {
  return (
    <div className='flex items-center justify-center h-full w-full'>
        {children}
    </div>
  )
}