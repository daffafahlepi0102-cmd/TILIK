import { NextResponse } from 'next/server';

const usedCodes = new Set(['RX-USED-001', 'RX-2026-0901']);
export async function GET() { return NextResponse.json({ data: [{ id: 'RX-2026-0912', status: 'verified' }], total: 1 }); }
export async function POST(request: Request) { const body = await request.json(); const qrCode = String(body.qrCode ?? ''); if (usedCodes.has(qrCode)) return NextResponse.json({ ok: false, code: 'PRESCRIPTION_ALREADY_DISPENSED', message: 'PERINGATAN: RESEP SUDAH DITEBUS!' }, { status: 409 }); return NextResponse.json({ ok: true, status: 'quarantined', prescription: { id: `RX-${Date.now()}`, ...body } }, { status: 201 }); }
