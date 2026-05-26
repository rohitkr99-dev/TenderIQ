import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { messages, tenderId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse("Invalid messages", { status: 400 });
    }

    // Fetch context if tenderId is provided
    let context = {};
    if (tenderId) {
      const tender = await prisma.tender.findUnique({
        where: { id: tenderId },
        include: {
          analysis: true,
          boqs: {
            include: {
              items: true
            }
          },
          procurementSchedule: true
        }
      });
      
      if (tender) {
        context = {
          tenderTitle: tender.title,
          tenderDescription: tender.description,
          status: tender.status,
          estimatedValue: tender.estimatedValue,
          deadline: tender.deadline,
          analysis: tender.analysis,
          boqs: tender.boqs.map(boq => ({
            name: boq.name,
            itemsCount: boq.items.length,
            items: boq.items.slice(0, 50) // Limit items for context size
          })),
          procurementSchedule: tender.procurementSchedule
        };
      }
    } else {
      // If no tenderId, maybe fetch general company context or just latest tenders
      const companyId = session.user.companyId;
      if (companyId) {
        const latestTenders = await prisma.tender.findMany({
          where: {
            project: {
              companyId: companyId
            }
          },
          take: 5,
          orderBy: { updatedAt: 'desc' }
        });
        context = {
          latestTenders: latestTenders.map(t => ({ title: t.title, status: t.status }))
        };
      }
    }

    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:3001';
    const response = await axios.post(`${aiServiceUrl}/api/chat`, {
      messages,
      context
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Chat API Error:", error.response?.data || error.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
