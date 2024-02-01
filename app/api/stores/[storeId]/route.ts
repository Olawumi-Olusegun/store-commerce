import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


interface PatchProps {
    params: { storeId: string; }
}

export async function PATCH(req: Request, { params: { storeId } }: PatchProps ) {

    try {
        const { userId } = auth();

        const body = await req.json();

        const { name } = body;


        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }

        if(!name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        const store = await prismadb.store.updateMany({
            where: { id: storeId, userId },
            data: { name }
        });

        
        return NextResponse.json(store, { status: 200});


    } catch (error) {
        console.log("[STORE_PATCH]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function DELETE(req: Request, { params: { storeId } }: PatchProps ) {

    try {
        const { userId } = auth();


        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }


        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        await prismadb.store.deleteMany({
            where: { id: storeId, userId },
        });

        return NextResponse.json("Store deleted", { status: 200});


    } catch (error) {
        console.log("[STORE_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}