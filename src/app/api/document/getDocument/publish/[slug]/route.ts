import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params: { slug } }: { params: { slug: string }}) {
  try {
    const document = await db.document.findUnique({
      where: {
        id: slug,
        isPublished: true,
        isArchived: false,
      }
    })

    return NextResponse.json(document)
  } catch (error) {
    console.log(error)
  }
}