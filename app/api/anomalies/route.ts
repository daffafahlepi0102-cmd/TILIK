import { NextResponse } from 'next/server';
import { anomalyCases } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ data: anomalyCases, summary: { active: 128, red: 15, yellow: 113, averageResponseDays: 1.2 }, generatedAt: new Date().toISOString() });
}
