import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { logActivity } from "@/lib/activity";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tenderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { tenderId } = await params;

    const quotations = await prisma.quotation.findMany({
      where: { tenderId },
      include: { vendor: true },
      orderBy: { totalAmount: "asc" },
    });

    return NextResponse.json(quotations);
  } catch (error) {
    console.error("Fetch quotations error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { tenderId } = await params;
    const body = await req.json();
    const {
      vendorId,
      totalAmount,
      currency,
      timeline,
      warranty,
      exclusions,
      commercialTerms,
      fileUrl,
    } = body;

    if (!vendorId || !totalAmount) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const quotation = await prisma.quotation.create({
      data: {
        tenderId,
        vendorId,
        totalAmount: parseFloat(totalAmount),
        currency: currency || "USD",
        timeline,
        warranty,
        exclusions,
        commercialTerms,
        fileUrl,
      },
      include: {
        vendor: true,
        tender: true
      }
    });

    // Log the activity
    await logActivity({
      userId: session.user.id,
      companyId: session.user.companyId,
      action: "QUOTATION_SUBMITTED",
      entityId: quotation.id,
      entityType: "QUOTATION",
      metadata: {
        vendorName: quotation.vendor.name,
        tenderTitle: quotation.tender.title,
        amount: quotation.totalAmount,
        currency: quotation.currency
      }
    });

    return NextResponse.json(quotation);
  } catch (error) {
    console.error("Create quotation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
