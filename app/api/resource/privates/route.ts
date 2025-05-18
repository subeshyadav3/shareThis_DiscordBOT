import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {

    const resources = await prisma.resource.findMany({
      where: {
        receiver: {
          not: null,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching private resources:", error)
    return NextResponse.json({ error: "Failed to fetch private resources" }, { status: 500 })
  }
}
