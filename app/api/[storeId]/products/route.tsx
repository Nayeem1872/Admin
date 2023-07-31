import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name,
    price,
    categoryId,
    colorId,
    sizeId,
    images,
    isFeatured,
    isArchived
    } = body;
    if (!userId) {
      return new NextResponse("Unauthorized(NO USERID!!)", { status: 401 });
    }
    if (!name) {
      return new NextResponse("name is Required", { status: 401 });
    }
    if (!price) {
      return new NextResponse("price is Required", { status: 401 });
    }
    if(!images || !images.length){
      return new NextResponse("Images are required",{status:401})
    }

    if (!categoryId) {
      return new NextResponse("category is Required", { status: 401 });
    }
    if (!sizeId) {
      return new NextResponse("sizeID is Required", { status: 401 });
    }
    if (!colorId) {
      return new NextResponse("colorID is Required", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is Required", { status: 401 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        categoryId,
        colorId,
        sizeId,
        images:{
          createMany:{
            data:[
              ...images.map((image:{url:string})=>image)
            ]
          }
        },
        storeId: params.storeId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[product_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try { 
    const {searchParams} = new URL (req.url)
    const categoryId = searchParams.get("categoryId")||undefined;
    const colorId = searchParams.get("colorId")|| undefined
    const sizeId= searchParams.get("sizeId")||undefined
    const isFeatured = searchParams.get("isFeatured")




    if (!params.storeId) {
      return new NextResponse("Store id is Required", { status: 401 });
    }
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true:undefined,
        isArchived:false
      },
      include:{
        images:true,
        category:true,
        color:true,
        size:true
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log("[products_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
