import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession()

    if(!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const documents = await db.document.findMany({
      where: {
        userId: session.user.id,
        parentDocumentId: null,
        isArchived: false
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    console.log(typeof documents)
    if(documents === null) {
      return new Response("No record Found", { status: 404 })
    }

    return new Response(JSON.stringify(documents))

  } catch (error) {
    return new Response("Internal Server Error")
  }
}