import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const companyId = session.user.companyId;

    if (!companyId) {
      return new NextResponse("User not associated with a company", { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const entityId = searchParams.get("entityId");
    const entityType = searchParams.get("entityType");

    const where: any = {
      companyId,
    };

    if (entityId) where.entityId = entityId;
    if (entityType) where.entityType = entityType;

    const logs = await prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Fetch logs error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
