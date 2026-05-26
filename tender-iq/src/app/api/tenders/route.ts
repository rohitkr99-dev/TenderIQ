import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { TenderStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const companyId = (session.user as any).companyId;
    if (!companyId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as TenderStatus | null;
    const minValue = searchParams.get('minValue') ? parseFloat(searchParams.get('minValue')!) : undefined;
    const maxValue = searchParams.get('maxValue') ? parseFloat(searchParams.get('maxValue')!) : undefined;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;
    const query = searchParams.get('q');

    const tenders = await prisma.tender.findMany({
      where: {
        project: { companyId },
        status: status || undefined,
        estimatedValue: {
          gte: minValue,
          lte: maxValue,
        },
        deadline: {
          gte: startDate,
          lte: endDate,
        },
        OR: query ? [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ] : undefined,
      },
      include: {
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tenders);
  } catch (error) {
    console.error("Fetch tenders error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
