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

        const { name, billboardId } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401});
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if(!billboardId) {
            return new NextResponse("Billboard ID is required", {status: 400});
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

        const category = await prismadb.category.create({
            data: { name, billboardId, storeId }
        });

        return NextResponse.json(category, {status: 201});

    } catch (error) {
        console.log(`[CATEGORY_POST]`, error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function GET(req: Request, { params: { storeId } }: ParamsProps) {
    try {

        if(!storeId) {
            return  new NextResponse("Store id is required", {status: 400});
        }
        const categories = await prismadb.billboard.findMany({
            where: { storeId }
        });

        return NextResponse.json(categories, {status: 200});

    } catch (error) {
        console.log(`[CATEGORY_GET]`, error);
        return new NextResponse("Internal error", { status: 500 })
    }
}