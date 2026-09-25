import { NextResponse } from 'next/server';
import { allProvinces, metrics, nationalAtcDddReport, pharmacies, trend } from '@/lib/data';

export async function GET() {
	return NextResponse.json({
		metrics,
		trend,
		provinces: allProvinces,
		atcDdd: nationalAtcDddReport,
		anomalies: pharmacies,
		generatedAt: new Date().toISOString(),
		pipeline: ['received', 'quarantined', 'cleaned', 'aggregated'],
	});
}
