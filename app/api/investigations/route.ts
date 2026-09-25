import { NextResponse } from 'next/server';
import { anomalyCases, auditTrail } from '@/lib/data';
import { createPdfDocument } from '@/lib/download';

export async function GET(request: Request) {
  const selectedId = new URL(request.url).searchParams.get('case') ?? anomalyCases[0].id;
  if (new URL(request.url).searchParams.get('format') === 'pdf') {
    const selected = anomalyCases.find(item => item.id === selectedId) ?? anomalyCases[0];
    const pdf = createPdfDocument(`TILIK - Laporan Investigasi ${selected.id}`, [`Apotek: ${selected.pharmacy}`, `Lokasi: ${selected.location}`, `Flag: ${selected.flag}`, `Risk score: ${selected.score}/100`, '', ...auditTrail.map(item => `${item.date} - ${item.actor}: ${item.action}`)]);
    return new Response(pdf, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${selected.id}-investigasi.pdf"` } });
  }
  return NextResponse.json({ cases: anomalyCases, stages: ['Baru Masuk', 'Dalam Audit Lapangan', 'Menunggu Klarifikasi', 'Selesai / Diberi Sanksi'], auditTrail, generatedAt: new Date().toISOString() });
}
