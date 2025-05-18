import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {

    const resources = await prisma.resource.findMany({
      where: {

        OR: [
          { link: { contains: "cdn.discordapp.com" } },
          { link: { contains: ".png" } },
          { link: { contains: ".jpg" } },
          { link: { contains: ".jpeg" } },
          { link: { contains: ".gif" } },
          { link: { contains: ".pdf" } },
          { link: { contains: ".doc" } },
          { link: { contains: ".docx" } },
          { link: { contains: ".xls" } },
          { link: { contains: ".xlsx" } },
          { link: { contains: ".zip" } },
          { link: { contains: ".rar" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error fetching file resources:", error)
    return NextResponse.json({ error: "Failed to fetch file resources" }, { status: 500 })
  }
}
