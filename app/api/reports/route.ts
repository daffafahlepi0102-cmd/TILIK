import { NextResponse } from 'next/server';
import { awareReport, nationalAtcDddReport, nationalComplianceReport, reportMetrics } from '@/lib/data';
import { createPdfDocument } from '@/lib/download';

export async function GET(request: Request) {
  if (new URL(request.url).searchParams.get('format') === 'pdf') {
    const pdf = createPdfDocument('TILIK - Laporan Surveillance Antibiotik', [`Resep reuse: ${reportMetrics.reused}`, `Resep ditolak: ${reportMetrics.rejected}`, `Kepatuhan validasi: ${reportMetrics.validPrescription}`, '', 'AWaRe:', ...awareReport.map(item => `${item.category}: ${item.percentage}% (${item.count} resep)`), '', 'Kepatuhan apotek nasional:', ...nationalComplianceReport.map(item => `${item.name} - ${item.province} - skor ${item.score}%`)]);
    return new Response(pdf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="tilik-laporan-surveillance.pdf"' } });
  }
  return NextResponse.json({ prescription: reportMetrics, aware: awareReport, compliance: nationalComplianceReport, atcDdd: nationalAtcDddReport, periods: ['7 hari', '30 hari', '6 bulan', '12 bulan'], generatedAt: new Date().toISOString() });
}
