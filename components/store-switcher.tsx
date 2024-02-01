"use client";

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Store } from '@prisma/client';
import { useStoremodal } from '@/hooks/use-store.modal';
import { useParams, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[]
}

export default function StoreSwitcher({className, items = []}: StoreSwitcherProps) {
    
    const storeModal = useStoremodal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({ label: item.name, value: item.id }));

    const [open, setOpen] = useState(false);

    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    const onStoreSelect = (store: { value: string, label: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }


  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button 
            variant="outline" 
            size="sm" 
            role='combobox'
             arial-aria-expanded={open} 
             arial-aria-label='Select a store'
             className={cn("w-[200px] justify-between", className)}
             >
                <StoreIcon className='mr-2 h-4 w-4 ' /> 
                <span className='line-clamp-1' title={currentStore?.label}>{currentStore?.label}</span>
                <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
            </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] px-0'>
            <Command>
                <CommandList>
                    <CommandInput placeholder='Search store...' />
                    <CommandEmpty>No store found.</CommandEmpty>
                    <CommandGroup heading="Stores">
                        {formattedItems.map((store) => (
                            <CommandItem 
                            key={store.value} 
                            onSelect={() => onStoreSelect(store)} 
                            className='text-sm cursor-pointer'>
                                <StoreIcon className='mr-2 h-4 w-4' />
                                <span className='line-clamp-1'>{store.label}</span>
                                <Check className={cn("ml-auto h-4 w-4", currentStore?.value === store.value 
                                ? "opacity-100"
                                : "opacity-0" )} />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
                <CommandSeparator />
                <CommandList>
                    <CommandGroup>
                        <CommandItem
                        onSelect={() => {
                            setOpen(false);
                            storeModal.onOpen();
                        }}
                        className='cursor-pointer'
                        >
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Create Store
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
  )
}