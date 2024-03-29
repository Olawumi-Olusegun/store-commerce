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

        const { 
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived,
        } = body;

        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }

        if(!name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if(!categoryId) {
            return new NextResponse("Category Id is required", { status: 400});
        }

        if(!price) {
            return new NextResponse("Price is required", { status: 400});
        }

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400});
        }

        if(!sizeId) {
            return new NextResponse("Size id is required", { status: 400});
        }

        if(!images || images.length === 0) {
            return new NextResponse("Image is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        const product = await prismadb.product.create({
            data: { 
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image )
                        ]
                    }
                },
                isFeatured,
                isArchived, 
            }
        });

        
        return NextResponse.json(product, { status: 200});


    } catch (error) {
        console.log("[PRODUCT_PATCH]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}

export async function GET(req: Request, { params: { storeId } }: ParamsProps ) {

    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured") || undefined;


    try {


        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        const products = await prismadb.product.findMany({
            where: { 
                storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(products, { status: 200});


    } catch (error) {
        console.log("[PRODUCT_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}