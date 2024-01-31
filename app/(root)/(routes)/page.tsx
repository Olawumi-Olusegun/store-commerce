"use client"

import { useStoremodal } from "@/hooks/use-store.modal";
import { useEffect } from "react";

export default function SetupPage() {

  const onOpen = useStoremodal((state) => state.onOpen);
  const isOpen = useStoremodal((state) => state.isOpen);

  useEffect(()=> {
    if(!isOpen){ 
      onOpen();
    }
  }, [onOpen, isOpen]);

  return null;
}
