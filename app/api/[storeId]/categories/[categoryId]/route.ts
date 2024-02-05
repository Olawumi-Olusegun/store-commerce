import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


interface Props {
    params: { categoryId: string; storeId: string; }
}

export async function PATCH(req: Request, { params: { categoryId, storeId } }: Props ) {

    try {

        const { userId } = auth();

        const body = await req.json();

        const { name, billboardId } = body;

        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }

        if(!name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        if(!categoryId) {
            return new NextResponse("Category Id is required", { status: 400});
        }

        if(!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        const category = await prismadb.category.updateMany({
            where: { id: categoryId },
            data: { name, billboardId, }
        });

        
        return NextResponse.json(category, { status: 200});


    } catch (error) {
        console.log("[CATEGORY_PATCH]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function GET(req: Request, { params: { categoryId } }: Props ) {
    
    try {

        if(!categoryId) {
            return new NextResponse("Category id is required", { status: 400});
        }

        const category = await prismadb.category.findUnique({
            where: { id: categoryId },
            include:{ billboard: true }
        });

        return NextResponse.json(category, { status: 200});


    } catch (error) {
        console.log("[CATEGORY_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function DELETE(req: Request, { params: { storeId, categoryId } }: Props ) {

    try {

        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }


        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        if(!categoryId) {
            return new NextResponse("Billboard id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        await prismadb.category.deleteMany({
            where: { id: categoryId },
        });

        return NextResponse.json("Category deleted", { status: 200});


    } catch (error) {
        console.log("[CATEGORY_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}