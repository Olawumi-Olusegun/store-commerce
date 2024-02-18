"use client";

import React, { PropsWithChildren, useEffect, useState } from 'react'


export default function Container({children}: PropsWithChildren) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if(!isMounted) {
        return null;
    }
  return (
    <div className='p-4 lg:max-w-screen-xl lg:mx-auto'>
        {children}
    </div>
  )
}