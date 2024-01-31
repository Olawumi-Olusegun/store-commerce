import Navbar from "@/components/Navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
    params: {
        storeId: string;
    };
    children: React.ReactNode;
}

export default async function DashboardLayout({params, children}: DashboardLayoutProps){
    const { userId } = auth();

    if(!userId) {
        return redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: { id: params.storeId, userId },
    });

    if(!store) {
        return redirect("/");
    }

    return (
        <>
         <Navbar />
         {children}
        </>
    )
}