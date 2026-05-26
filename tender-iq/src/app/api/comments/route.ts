import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const tenderId = searchParams.get("tenderId");
    const projectId = searchParams.get("projectId");

    if (!tenderId && !projectId) {
      return new NextResponse("Missing tenderId or projectId", { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        tenderId: tenderId || undefined,
        projectId: projectId || undefined,
      },
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
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Fetch comments error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, tenderId, projectId } = await req.json();

    if (!content) {
      return new NextResponse("Missing content", { status: 400 });
    }

    const companyId = session.user.companyId;

    if (!companyId) {
      return new NextResponse("User not associated with a company", { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        tenderId,
        projectId,
      },
    });

    await logActivity({
      userId: session.user.id,
      companyId,
      action: "COMMENT_ADDED",
      entityId: comment.id,
      entityType: "Comment",
      metadata: { tenderId, projectId },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Add comment error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
