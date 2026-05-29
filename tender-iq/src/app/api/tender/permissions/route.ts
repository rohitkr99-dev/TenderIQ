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

    const { searchParams } = new URL(req.url);
    const tenderId = searchParams.get("tenderId");

    if (!tenderId) {
      return new NextResponse("Missing tenderId", { status: 400 });
    }

    const permissions = await prisma.tenderPermission.findMany({
      where: {
        tenderId,
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
    });

    return NextResponse.json(permissions);
  } catch (error) {
    console.error("Fetch permissions error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { tenderId, userId, role } = await req.json();

    if (!tenderId || !userId || !role) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const userRole = session.user.role;
    const companyId = session.user.companyId;

    if (!companyId) {
      return new NextResponse(
        "User not associated with a company",
        { status: 400 }
      );
    }

    if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: {
        project: true,
      },
    });

    if (!tender || tender.project.companyId !== companyId) {
      return new NextResponse(
        "Tender not found in your company",
        { status: 404 }
      );
    }

    const permission = await prisma.tenderPermission.upsert({
      where: {
        tenderId_userId: {
          tenderId,
          userId,
        },
      },
      update: {
        role,
      },
      create: {
        tenderId,
        userId,
        role,
      },
    });

    await logActivity({
      userId: session.user.id,
      companyId,
      action: "TENDER_PERMISSION_UPDATED",
      entityId: tenderId,
      entityType: "Tender",
      metadata: {
        targetUserId: userId,
        newRole: role,
      },
    });

    return NextResponse.json(permission);
  } catch (error) {
    console.error("Set permission error:", error);
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
    const tenderId = searchParams.get("tenderId");
    const userId = searchParams.get("userId");

    if (!tenderId || !userId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const userRole = session.user.role;
    const companyId = session.user.companyId;

    if (!companyId) {
      return new NextResponse(
        "User not associated with a company",
        { status: 400 }
      );
    }

    if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.tenderPermission.delete({
      where: {
        tenderId_userId: {
          tenderId,
          userId,
        },
      },
    });

    await logActivity({
      userId: session.user.id,
      companyId,
      action: "TENDER_PERMISSION_REMOVED",
      entityId: tenderId,
      entityType: "Tender",
      metadata: {
        targetUserId: userId,
      },
    });

    return new NextResponse("Permission removed", { status: 200 });
  } catch (error) {
    console.error("Remove permission error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
