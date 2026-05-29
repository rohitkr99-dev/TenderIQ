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

    const vendors = await prisma.vendor.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Fetch vendors error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, email, phone } = await req.json();

    if (!name) {
      return new NextResponse("Missing name", { status: 400 });
    }

    const vendor = await prisma.vendor.create({
      data: { name, email, phone },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Create vendor error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
