import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


interface Props {
    params: { billboardId: string; storeId: string; }
}

export async function PATCH(req: Request, { params: { billboardId, storeId } }: Props ) {

    try {
        const { userId } = auth();

        const body = await req.json();

        const { label, imageUrl } = body;

        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }

        if(!label) {
            return new NextResponse("Name is required", { status: 400});
        }

        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        if(!billboardId) {
            return new NextResponse("Billboard Id is required", { status: 400});
        }

        if(!imageUrl) {
            return new NextResponse("Image Url is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        const store = await prismadb.billboard.updateMany({
            where: { id: billboardId },
            data: { label, imageUrl, }
        });

        
        return NextResponse.json(store, { status: 200});


    } catch (error) {
        console.log("[BILLBOARD_PATCH]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function GET(req: Request, { params: { billboardId } }: Props ) {

    try {


        if(!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400});
        }

        const billboard = await prismadb.billboard.findUnique({
            where: { id: billboardId },
        });

        return NextResponse.json(billboard, { status: 200});


    } catch (error) {
        console.log("[BILLBOARD_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function DELETE(req: Request, { params: { storeId, billboardId } }: Props ) {

    try {
        const { userId } = auth();


        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }


        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
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

        await prismadb.billboard.deleteMany({
            where: { id: billboardId },
        });

        return NextResponse.json("Billboard deleted", { status: 200});


    } catch (error) {
        console.log("[BILLBOARD_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}