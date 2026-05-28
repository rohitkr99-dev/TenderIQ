import { NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { boqData, projectTimeline } = body;

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:3001';
    const response = await axios.post(`${aiServiceUrl}/api/procurement/generate`, {
      boqData,
      projectTimeline,
    });

    // Log the activity
    if (!session.user.companyId) { 
      return NextResponse.json( 
        { error: "Company ID missing" }, 
        { status: 400 } ); }
    
    await logActivity({
      userId: session.user.id,
      companyId: session.user.companyId,
      action: "PROCUREMENT_GENERATED",
      entityType: "PROCUREMENT_SCHEDULE",
      metadata: {
        itemCount: response.data.schedule?.length || 0
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Procurement Generation API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to generate procurement schedule' },
      { status: 500 }
    );
  }
}
