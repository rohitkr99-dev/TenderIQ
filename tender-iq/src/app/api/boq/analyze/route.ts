import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { generateChatCompletion } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!session.user.companyId) {
      return NextResponse.json(
        { error: "Company ID missing" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const { boqId, items } = body;

    if (!boqId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const analysisPrompt = `
Analyze the following BOQ items and provide:
1. Cost insights
2. Risk areas
3. Pricing recommendations
4. Quantity anomalies
5. Procurement suggestions

BOQ Items:
${JSON.stringify(items.slice(0, 100), null, 2)}
`;

    const analysis = await generateChatCompletion([
      {
        role: "system",
        content:
          "You are an expert quantity surveyor and construction cost consultant.",
      },
      {
        role: "user",
        content: analysisPrompt,
      },
    ]);

    const savedAnalysis = await prisma.analysis.create({
      data: {
        boqId,
        content: analysis,
      },
    });

    await logActivity({
      userId: session.user.id,
      companyId: session.user.companyId,
      action: "BOQ_ANALYZED",
      entityType: "BOQ",
      metadata: {
        boqId,
        totalItems: items.length,
      },
    });

    return NextResponse.json({
      success: true,
      analysis: savedAnalysis,
    });
  } catch (error: any) {
    console.error("BOQ Analysis Error:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze BOQ",
      },
      {
        status: 500,
      }
    );
  }
}
