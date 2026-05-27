import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import FormData from "form-data"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { logActivity } from "@/lib/activity"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Forward to standalone AI service
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:3001"
    
    const forwardData = new FormData()
    const buffer = Buffer.from(await file.arrayBuffer())
    forwardData.append("file", buffer, {
      filename: file.name,
      contentType: file.type,
    })

    const response = await axios.post(`${aiServiceUrl}/api/boq/analyze`, forwardData, {
      headers: {
        ...forwardData.getHeaders(),
      },
    })

    // Log the activity
    await logActivity({
      userId: session.user.id,
      if (!session.user.companyId) {
  return NextResponse.json(
    { error: "Company ID missing" },
    { status: 400 }
  );
}
      
      action: "BOQ_ANALYZED",
      entityType: "BOQ",
      metadata: {
        fileName: file.name,
        itemCount: response.data.extractedData?.length || 0
      }
    });

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("BOQ Analysis API Error:", error.response?.data || error.message)
    return NextResponse.json(
      { error: "Failed to analyze BOQ. Please ensure the AI service is running." },
      { status: 500 }
    )
  }
}
