import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateChatCompletion } from "@/lib/openai";
import { ReportType } from "@prisma/client";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tenderId: string }> }
) {
  try {
    const params = await context.params;
    const { tenderId } = params;

    const reports = await prisma.report.findMany({
      where: { tenderId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error("Error fetching reports:", error);

    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ tenderId: string }> }
) {
  try {
    const params = await context.params;
    const { tenderId } = params;

    const { type } = await req.json();

    if (!type || !Object.values(ReportType).includes(type)) {
      return NextResponse.json(
        { error: "Invalid report type" },
        { status: 400 }
      );
    }

    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: {
        analysis: true,
        boqs: {
          include: {
            items: true,
          },
        },
        project: true,
      },
    });

    if (!tender) {
      return NextResponse.json(
        { error: "Tender not found" },
        { status: 404 }
      );
    }

    const contextData = {
      tenderTitle: tender.title,
      projectDescription: tender.project.description,
      tenderAnalysis: tender.analysis,
      boqItems: tender.boqs.flatMap((boq) =>
        boq.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          rate: item.rate,
        }))
      ),
    };

    let prompt = "";

    switch (type) {
      case ReportType.TECHNICAL_PROPOSAL:
        prompt = `
Generate a professional Technical Proposal draft for the following tender:

Tender: ${contextData.tenderTitle}

Project Description:
${contextData.projectDescription}

Analysis:
${JSON.stringify(contextData.tenderAnalysis)}

BOQ:
${JSON.stringify(contextData.boqItems.slice(0, 50))}

The proposal should include:
1. Executive Summary
2. Understanding of Requirements
3. Technical Approach & Methodology
4. Resource Allocation
5. Quality Assurance Plan
6. Health & Safety Measures
`;
        break;

      case ReportType.COMMERCIAL_SUMMARY:
        prompt = `
Generate a Commercial Summary for the following tender:

Tender: ${contextData.tenderTitle}

Analysis:
${JSON.stringify(contextData.tenderAnalysis)}

BOQ Summary:
Total items ${contextData.boqItems.length}

The summary should highlight:
1. Key Commercial Terms
2. Pricing Strategy Recommendations
3. Major Cost Drivers
4. Payment Terms & Cash Flow Implications
5. Liquidated Damages & Liability Risks
`;
        break;

      case ReportType.RISK_ANALYSIS:
        prompt = `
Generate a detailed Risk Analysis report for the following tender:

Tender: ${contextData.tenderTitle}

Analysis:
${JSON.stringify(contextData.tenderAnalysis)}

The report should include:
1. Contractual Risks
2. Technical Risks
3. Financial Risks
4. Mitigation Strategies
5. Overall Risk Score & Justification
`;
        break;

      case ReportType.BID_RECOMMENDATION:
        prompt = `
Generate a Bid/No-Bid Recommendation for the following tender:

Tender: ${contextData.tenderTitle}

Analysis:
${JSON.stringify(contextData.tenderAnalysis)}

Provide:
1. Strategic Alignment
2. Resource Availability
3. Complexity & Technical Capability
4. Profitability Potential
5. Final Recommendation with justification
`;
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported report type" },
          { status: 400 }
        );
    }

    const content = await generateChatCompletion([
      {
        role: "system",
        content:
          "You are an expert construction bid manager and procurement specialist.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);

    const report = await prisma.report.create({
      data: {
        tenderId,
        type,
        content,
      },
    });

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("Error generating report:", error);

    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
