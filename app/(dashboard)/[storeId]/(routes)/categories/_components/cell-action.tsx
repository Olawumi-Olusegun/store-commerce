
import React, { useState } from 'react'
import { CategoriesColumn } from './columns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, MoreHorizontal, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import AlertModal from '@/components/modals/alert-modals'

type CellActionProps = {
    data: CategoriesColumn
}

export default function CellAction({data}: CellActionProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const params = useParams<{storeId: string; }>();

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Category id copied to the clipboard");
    }

    const onDeleteBillboard = async () => {
        try {
            setIsLoading(true)
            const response = await axios.delete(`/api/${params.storeId}/categories/${data.id}`)
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast.success("Billboard deleted");
            // window.location.assign(`/${params.storeId}/categories`);
        } catch (error) {
            toast.error("Make sure you remove all products using this categories first");
        } finally {
            setIsLoading(false)
            setOpen(false)
        }
    }

  return (
    <>
    <AlertModal  
     isLoading={isLoading}
     isOpen={open}
     onClose={() => setOpen(false)}
     onConfirm={onDeleteBillboard}

    />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className='sr-only'>Open Menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                    Action
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onCopy(data.id)} className='cursor-pointer'>
                    <Copy className='w-4 h-4 mr-2' />
                    <span>Copy Id</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/categories/${data.id}`)} className='cursor-pointer'>
                    <Copy className='w-4 h-4 mr-2' />
                    <span>Update</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpen(true)} className='cursor-pointer'>
                    <Trash className='w-4 h-4 mr-2' />
                    <span>Delete</span>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    </>
  )
}