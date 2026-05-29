import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const companyId = session.user.companyId;

    if (!companyId) {
      return new NextResponse(
        "User not associated with a company",
        { status: 400 }
      );
    }

    const members = await prisma.user.findMany({
      where: {
        companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Fetch members error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId, role } = await req.json();

    if (!userId || !role) {
      return new NextResponse(
        "Missing userId or role",
        { status: 400 }
      );
    }

    const userRole = session.user.role;
    const companyId = session.user.companyId;

    if (!companyId) {
      return new NextResponse(
        "User not associated with a company",
        { status: 400 }
      );
    }

    if (userRole !== "ADMIN") {
      return new NextResponse(
        "Forbidden: Only ADMIN can change roles",
        { status: 403 }
      );
    }

    const member = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!member || member.companyId !== companyId) {
      return new NextResponse(
        "User not found in your company",
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    await logActivity({
      userId: session.user.id,
      companyId,
      action: "ROLE_UPDATED",
      entityId: userId,
      entityType: "User",
      metadata: {
        targetUserId: userId,
        newRole: role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update role error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    const userRole = session.user.role;
    const companyId = session.user.companyId;

    if (!companyId) {
      return new NextResponse(
        "User not associated with a company",
        { status: 400 }
      );
    }

    if (userRole !== "ADMIN") {
      return new NextResponse(
        "Forbidden: Only ADMIN can remove members",
        { status: 403 }
      );
    }

    if (userId === session.user.id) {
      return new NextResponse(
        "Cannot remove yourself",
        { status: 400 }
      );
    }

    const member = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!member || member.companyId !== companyId) {
      return new NextResponse(
        "User not found in your company",
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        companyId: null,
        role: "USER",
      },
    });

    await logActivity({
      userId: session.user.id,
      companyId,
      action: "MEMBER_REMOVED",
      entityId: userId,
      entityType: "User",
      metadata: {
        removedUserId: userId,
      },
    });

    return new NextResponse(
      "Member removed",
      { status: 200 }
    );
  } catch (error) {
    console.error("Remove member error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
