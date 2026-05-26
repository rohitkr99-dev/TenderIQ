import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  try {
    const { email, password, name, companyName } = await req.json();

    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create company first
    const company = await prisma.company.create({
      data: {
        name: companyName,
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        companyId: company.id,
        role: "ADMIN", // First user is Admin
      },
    });

    // Log the activity
    await logActivity({
      userId: user.id,
      companyId: company.id,
      action: "COMPANY_REGISTERED",
      entityId: company.id,
      entityType: "COMPANY",
      metadata: {
        companyName: company.name,
        adminName: user.name
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
