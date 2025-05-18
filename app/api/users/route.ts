import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {

    const users = await prisma.resource.groupBy({
      by: ["uploader"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    })


    const userStats = await Promise.all(
      users.map(async (user) => {
        const latestResource = await prisma.resource.findFirst({
          where: {
            uploader: user.uploader,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            createdAt: true,
          },
        })

        return {
          username: user.uploader,
          resourceCount: user._count.id,
          lastActive: latestResource?.createdAt || new Date(),
        }
      }),
    )

    return NextResponse.json(userStats)
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}
