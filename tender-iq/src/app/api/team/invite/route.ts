import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { email, role } = await req.json();

    if (!email || !role) {
      return new NextResponse("Missing email or role", { status: 400 });
    }

    const userRole = session.user.role;
    const companyId = session.user.companyId;

    if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!companyId) {
      return new NextResponse("User not associated with a company", { status: 400 });
    }

    // Check if user already exists in the company
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        companyId,
      },
    });

    if (existingUser) {
      return new NextResponse("User already in team", { status: 400 });
    }

    // Check for existing active invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        companyId,
        accepted: false,
        expires: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      return new NextResponse("Invitation already sent", { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.invitation.create({
      data: {
        email,
        companyId,
        role,
        token,
        expires,
        invitedById: session.user.id,
      },
    });

    await logActivity({
      userId: session.user.id,
      companyId,
      action: "USER_INVITED",
      entityId: invitation.id,
      entityType: "Invitation",
      metadata: { invitedEmail: email, role },
    });

    return NextResponse.json({
      message: "Invitation sent",
      invitation: {
        id: invitation.id,
        email: invitation.email,
        token: invitation.token,
      },
    });
  } catch (error) {
    console.error("Invitation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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

    const invitations = await prisma.invitation.findMany({
      where: {
        companyId,
        accepted: false,
        expires: { gt: new Date() },
      },
      include: {
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Fetch invitations error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
