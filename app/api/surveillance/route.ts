import { NextResponse } from 'next/server';
import { allProvinces, metrics, nationalAtcDddReport, nationalAtcDddTrend, pharmacies, provinceNames, trend } from '@/lib/data';

export async function GET() {
	return NextResponse.json({
		metrics,
		trend,
		provinces: allProvinces,
		provinceCount: provinceNames.length,
		atcDdd: nationalAtcDddReport,
		nationalAtcDdd: nationalAtcDddTrend,
		anomalies: pharmacies,
		generatedAt: new Date().toISOString(),
		pipeline: ['received', 'quarantined', 'cleaned', 'aggregated'],
	});
}
