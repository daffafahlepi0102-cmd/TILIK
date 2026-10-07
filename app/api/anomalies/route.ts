import { NextResponse } from 'next/server';
import { anomalyCases, provinceNames } from '@/lib/data';

export async function GET() {
  const red = anomalyCases.filter(item => item.flag === 'Red Flag').length;
  return NextResponse.json({
    data: anomalyCases,
    summary: { active: anomalyCases.length, red, yellow: anomalyCases.length - red, averageResponseDays: 1.2 },
    provinces: provinceNames,
    generatedAt: new Date().toISOString(),
  });
}
