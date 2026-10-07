import { NextResponse } from 'next/server';
import { recentTransactions } from '@/lib/data';

const usedCodes = new Set(['RX-USED-001', 'RX-2026-0901']);
const validSources = new Set(['manual', 'camera', 'photo']);
const validDocumentTypes = new Set([
  'Resep antibiotik',
  'Dokumen resep pasien',
  'Bukti dispensasi fasilitas',
  'Dokumen pendukung verifikasi',
]);

export async function GET() {
  return NextResponse.json(
    { data: recentTransactions, total: recentTransactions.length },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Badan permintaan harus berupa JSON yang valid.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ ok: false, message: 'Data verifikasi tidak valid.' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const qrCode = typeof input.qrCode === 'string' ? input.qrCode.trim().toUpperCase() : '';
  const source = typeof input.source === 'string' ? input.source : 'manual';
  const documentType = typeof input.documentType === 'string' ? input.documentType : 'Resep antibiotik';

  if (!qrCode || qrCode.length > 100) {
    return NextResponse.json({ ok: false, message: 'Kode QR atau nomor resep wajib diisi (maksimal 100 karakter).' }, { status: 400 });
  }
  if (!validSources.has(source) || !validDocumentTypes.has(documentType)) {
    return NextResponse.json({ ok: false, message: 'Sumber atau jenis dokumen tidak dikenal.' }, { status: 400 });
  }

  if (usedCodes.has(qrCode)) {
    return NextResponse.json(
      { ok: false, code: 'PRESCRIPTION_ALREADY_DISPENSED', message: 'PERINGATAN: RESEP SUDAH DITEBUS!' },
      { status: 409 },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      status: 'quarantined',
      message: 'Kode diterima untuk pemeriksaan lanjutan.',
      prescription: {
        id: `RX-${Date.now()}`,
        qrCode,
        documentType,
        source,
        receivedAt: new Date().toISOString(),
      },
    },
    { status: 201, headers: { 'Cache-Control': 'no-store' } },
  );
}
