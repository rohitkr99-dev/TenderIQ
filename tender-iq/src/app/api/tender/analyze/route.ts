import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const companyId = session.user.companyId;

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID missing" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const aiServiceUrl =
      process.env.AI_SERVICE_URL || "http://localhost:3001";

    const form = new FormData();

    form.append("file", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    const response = await axios.post(
      `${aiServiceUrl}/api/tender/analyze`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    await logActivity({
      userId: session.user.id,
      companyId,
      action: "TENDER_ANALYZED",
      entityType: "TENDER",
      metadata: {
        fileName: file.name,
        projectName:
          response.data?.projectName || "Unknown Project",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "Error in tender analysis route:",
      error?.response?.data || error?.message
    );

    return NextResponse.json(
      {
        error:
          error?.response?.data?.error ||
          "Failed to analyze tender",
      },
      {
        status: error?.response?.status || 500,
      }
    );
  }
}
