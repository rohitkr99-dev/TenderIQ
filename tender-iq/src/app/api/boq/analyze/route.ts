```ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { boqId } = body;

    if (!boqId) {
      return NextResponse.json(
        { error: "BOQ ID is required" },
        { status: 400 }
      );
    }

    const boq = await prisma.bOQ.findUnique({
      where: {
        id: boqId,
      },
      include: {
        items: true,
        tender: true,
      },
    });

    if (!boq) {
      return NextResponse.json(
        { error: "BOQ not found" },
        { status: 404 }
      );
    }

    const totalAmount = boq.items.reduce((sum, item) => {
      return sum + (item.amount || 0);
    }, 0);

    const totalItems = boq.items.length;

    const analysis =
      "BOQ Analysis Summary\n\n" +
      `BOQ Name: ${boq.name}\n\n` +
      `Tender: ${boq.tender.title}\n\n` +
      `Total Items: ${totalItems}\n\n` +
      `Total Estimated Amount: ${totalAmount}\n\n` +
      "This BOQ has been analyzed successfully.";

    const savedLog = await prisma.aILog.create({
      data: {
        userId: session.user.id,
        action: "BOQ_ANALYSIS",
        input: JSON.stringify({
          boqId,
        }),
        output: analysis,
      },
    });

    return NextResponse.json({
      success: true,
      analysis,
      logId: savedLog.id,
    });
  } catch (error) {
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
```
