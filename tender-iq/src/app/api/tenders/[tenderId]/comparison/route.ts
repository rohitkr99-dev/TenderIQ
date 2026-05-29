import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

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
    });

    if (quotations.length === 0) {
      return NextResponse.json({
        rankings: [],
        recommendations: "No quotations found for this tender.",
        analysis: null,
      });
    }

    // Sort by total amount
    const sortedQuotations = [...quotations].sort((a, b) => a.totalAmount - b.totalAmount);

    // Generate rankings
    const rankings = sortedQuotations.map((q, index) => ({
      rank: index + 1,
      vendorName: q.vendor.name,
      totalAmount: q.totalAmount,
      currency: q.currency,
      timeline: q.timeline,
      score: 100 - (index * 10), // Simple mock score
    }));

    // Detect abnormal pricing (e.g., more than 30% from average)
    const totalSum = quotations.reduce((acc, q) => acc + q.totalAmount, 0);
    const averageAmount = totalSum / quotations.length;
    const abnormalPricing = quotations
      .filter(q => Math.abs(q.totalAmount - averageAmount) / averageAmount > 0.3)
      .map(q => ({
        vendorName: q.vendor.name,
        amount: q.totalAmount,
        deviation: ((q.totalAmount - averageAmount) / averageAmount * 100).toFixed(1) + "%",
      }));

    // Mock AI Recommendations
    const recommendations = [
      `Consider negotiating with ${sortedQuotations[0].vendor.name} on their ${sortedQuotations[0].timeline ? 'timeline' : 'payment terms'} to match market standards.`,
      abnormalPricing.length > 0 
        ? `Note: ${abnormalPricing.map(v => v.vendorName).join(", ")} submitted pricing significantly different from average. Verify their scope coverage.`
        : "Pricing is relatively consistent across all vendors.",
      "Check warranty terms for all vendors as they vary significantly in value.",
    ];

    return NextResponse.json({
      rankings,
      abnormalPricing,
      recommendations,
      averageAmount,
      comparisonMatrix: quotations.map(q => ({
        vendor: q.vendor.name,
        price: q.totalAmount,
        timeline: q.timeline,
        warranty: q.warranty,
        exclusions: q.exclusions,
        commercialTerms: q.commercialTerms,
      })),
    });
  } catch (error) {
    console.error("Comparison error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
