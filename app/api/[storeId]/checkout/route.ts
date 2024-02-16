
import prismadb from '@/lib/prismadb'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'


const corsHeader = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Types, Authorization"
}

export async function OPTIONS() {
    return NextResponse.json({}, {headers: corsHeader})
}
export async function POST(req: Request, { params }: { params: { storeId: string} }) {
    const { productIds } = await req.json();

    if(!productIds || productIds.length === 0) {
        return new NextResponse("Product ids are required", { status: 400})
    }
}