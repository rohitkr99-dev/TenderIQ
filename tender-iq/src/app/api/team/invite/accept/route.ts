import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  try {
    const { token, userId } = await req.json();

    if (!token || !userId) {
      return new NextResponse("Missing token or userId", { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token },
    });

    if (!invitation || invitation.accepted || invitation.expires < new Date()) {
      return new NextResponse("Invalid or expired invitation", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (user.email !== invitation.email) {
      return new NextResponse("Email mismatch", { status: 400 });
    }

    // Update user and mark invitation as accepted
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          companyId: invitation.companyId,
          role: invitation.role,
        },
      }),
      prisma.invitation.update({
        where: { id: invitation.id },
        data: { accepted: true },
      }),
    ]);

    await logActivity({
      userId,
      companyId: invitation.companyId,
      action: "INVITATION_ACCEPTED",
      entityId: invitation.id,
      entityType: "Invitation",
    });

    return NextResponse.json({ message: "Invitation accepted" });
  } catch (error) {
    console.error("Accept invitation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
