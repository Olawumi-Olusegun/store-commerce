"use client";

import StoreModal from '@/components/modals/store.modal';
import React, { useEffect, useState } from 'react'

type Props = {}

export default function ModalProviders({}: Props) {
    
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if(!isMounted) return null;


  return (
    <>
        <StoreModal />
    </>
  )
}