import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateReportPDF } from '@/lib/pdf';

export async function GET(
  req: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const { reportId } = params;

    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        tender: true,
      },
    });

    if (!report || !report.content) {
      return NextResponse.json(
        { error: 'Report not found or has no content' },
        { status: 404 }
      );
    }

    const pdfBuffer = await generateReportPDF(
      report.tender.title,
      report.type,
      report.content
    );

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Report_${reportId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
