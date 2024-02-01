"use client";

import { useOrigin } from '@/hooks/use-origin';
import { useParams } from 'next/navigation';
import React from 'react'
import ApiAlert from './api-alert';

type Props = {
    entityName: string;
    entityIdName: string;
}

export default function ApiList({entityIdName, entityName}: Props) {

    const params = useParams<{storeId: string}>();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${params.storeId}`;
    
  return (
    <>
    <ApiAlert title='GET' variant='public' description={`${baseUrl}/${entityName}`} />
    <ApiAlert title='GET' variant='public' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
    <ApiAlert title='POST' variant='admin' description={`${baseUrl}/${entityName}`} />
    <ApiAlert title='PATCH' variant='admin' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
    <ApiAlert title='DELETE' variant='admin' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
    </>
  )
}