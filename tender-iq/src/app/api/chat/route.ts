import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:3001";

    const response = await axios.post(`${aiServiceUrl}/api/chat`, {
      messages,
      context,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Chat API Error:", error?.response?.data || error?.message);
    return NextResponse.json(
      { error: error?.response?.data?.error || "Failed to process chat" },
      { status: error?.response?.status || 500 }
    );
  }
}
