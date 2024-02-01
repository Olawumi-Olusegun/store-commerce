import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

interface ParamsProps {
    params: { storeId: string; }
}

export async function POST(req: Request, { params: { storeId } }: ParamsProps) {
    try {

        const { userId } = auth();

        const body = await req.json();

        const { label, imageUrl } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401});
        }

        if(!label) {
            return new NextResponse("Label is required", {status: 400});
        }

        if(!imageUrl) {
            return new NextResponse("Image Url is required", {status: 400});
        }

        if(!storeId) {
            return new NextResponse("StoreId is required", {status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        const billbaord = await prismadb.billboard.create({
            data: { label, imageUrl , storeId }
        });

        return NextResponse.json(billbaord, {status: 201});

    } catch (error) {
        console.log(`[BILLBOARD_POST]`, error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(req: Request, { params: { storeId } }: ParamsProps) {
    try {

        const billbaord = await prismadb.billboard.findMany({
            where: { storeId }
        });

        return NextResponse.json(billbaord, {status: 200});

    } catch (error) {
        console.log(`[BILLBOARD_GET]`, error);
        return new NextResponse("Internal error", { status: 500 })
    }
}