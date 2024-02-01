"use client";

import React, { useEffect, useState } from 'react'
import { Button } from './button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';


interface ImageUploadProps {
    disabled: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    values: string[];
}

export default function ImageUpload({disabled, onChange, onRemove, values}: ImageUploadProps) {
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])
  
    const onUpload = async (result: any) => {
          onChange(result.info.secure_url);
    }



  if(!isMounted) return null;
  
    return (
    <div>
        <div className="mb-4 flex items-center gap-4">
            {values?.map((url) => (
                <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                    <div className="z-10 absolute top-2 right-1">
                        <Button type='button' onClick={() => onRemove(url)} variant="destructive" size="icon">
                            <Trash className='w-4 h-4' />
                        </Button>
                    </div>
                    <Image src={url} alt='image' fill className='object-cover' />
                </div>
            ))}
        </div>
        <CldUploadWidget 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onUpload={onUpload}
        >
            {({open}) => {
                const onClick = () => {
                    open();
                }

                return (
                    <>
                     <Button
                     className="hover:bg-gray-200 transition-all duration-300"
                     type='button'
                     disabled={disabled}
                     variant="secondary"
                     onClick={onClick}
                     >
                        <ImagePlus className='h-4 w-4 mr-2' />
                        <span>Upload an Image</span>
                     </Button>
                    </>
                )
            }}
        </CldUploadWidget>
    </div>
  )
}