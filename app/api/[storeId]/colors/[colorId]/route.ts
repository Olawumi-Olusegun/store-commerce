import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


interface Props {
    params: { colorId: string; storeId: string; }
}

export async function PATCH(req: Request, { params: { colorId, storeId } }: Props ) {

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

        if(!colorId) {
            return new NextResponse("Color Id is required", { status: 400});
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

        const color = await prismadb.color.updateMany({
            where: { id: colorId },
            data: { name, value, }
        });

        
        return NextResponse.json(color, { status: 200});


    } catch (error) {
        console.log("[COLOR_PATCH]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function GET(req: Request, { params: { colorId } }: Props ) {

    try {

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400});
        }

        const color = await prismadb.color.findUnique({
            where: { id: colorId },
        });

        return NextResponse.json(color, { status: 200});


    } catch (error) {
        console.log("[COLOR_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function DELETE(req: Request, { params: { storeId, colorId } }: Props ) {

    try {
        const { userId } = auth();


        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }


        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        await prismadb.color.deleteMany({
            where: { id: colorId },
        });

        return NextResponse.json("Color deleted", { status: 200});


    } catch (error) {
        console.log("[COLOR_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}