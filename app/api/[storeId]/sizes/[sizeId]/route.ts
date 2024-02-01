import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


interface Props {
    params: { sizeId: string; storeId: string; }
}

export async function PATCH(req: Request, { params: { sizeId, storeId } }: Props ) {

    try {
        const { userId } = auth();

        const body = await req.json();

        const { name, value } = body;

        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }

        if(!name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        if(!sizeId) {
            return new NextResponse("Size Id is required", { status: 400});
        }

        if(!value) {
            return new NextResponse("Value is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        const store = await prismadb.size.updateMany({
            where: { id: sizeId },
            data: { name, value, }
        });

        
        return NextResponse.json(store, { status: 200});


    } catch (error) {
        console.log("[SIZE_PATCH]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function GET(req: Request, { params: { sizeId } }: Props ) {

    try {

        if(!sizeId) {
            return new NextResponse("Size id is required", { status: 400});
        }

        const size = await prismadb.size.findUnique({
            where: { id: sizeId },
        });

        return NextResponse.json(size, { status: 200});


    } catch (error) {
        console.log("[SIZE_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function DELETE(req: Request, { params: { storeId, sizeId } }: Props ) {

    try {
        const { userId } = auth();


        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }


        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        if(!sizeId) {
            return new NextResponse("Size id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        await prismadb.size.deleteMany({
            where: { id: sizeId },
        });

        return NextResponse.json("Size deleted", { status: 200});


    } catch (error) {
        console.log("[SIZE_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}