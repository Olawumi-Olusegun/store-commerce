import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


interface Props {
    params: { productId: string; storeId: string; }
}

export async function PATCH(req: Request, { params: { productId, storeId } }: Props ) {

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

        if(!productId) {
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

         await prismadb.product.update({
            where: { id: productId },
            data: { 
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                storeId,
                images: {
                    deleteMany: { }
                },
                isFeatured,
                isArchived, 
            }
        });

        const product = await prismadb.product.update({
            where: { id: productId },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })
        
        return NextResponse.json(product, { status: 200});


    } catch (error) {
        console.log("[PRODUCT_PATCH]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function GET(req: Request, { params: { storeId, productId } }: Props ) {

    try {

        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        const product = await prismadb.product.findUnique({
            where: { 
                id: productId,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
        });

        return NextResponse.json(product, { status: 200});


    } catch (error) {
        console.log("[PRODUCT_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}


export async function DELETE(req: Request, { params: { storeId, productId } }: Props ) {

    try {
        const { userId } = auth();


        if(!userId) {
            return new NextResponse("Unathenticated", { status: 401});
        }

        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400});
        }

        if(!productId) {
            return new NextResponse("Billboard id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }

        await prismadb.product.deleteMany({
            where: { id: productId },
        });

        return NextResponse.json("Product deleted", { status: 200});


    } catch (error) {
        console.log("[PRODUCT_DELETE]", error)
        return new NextResponse("Internal error", { status: 500})
    }
}