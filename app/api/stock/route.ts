import { NextResponse } from 'next/server';
import { nationalStockInventory, provinceNames } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ data: nationalStockInventory, totalItems: nationalStockInventory.length, provinces: provinceNames.length, critical: nationalStockInventory.filter(item => item.status === 'Kritis').length, generatedAt: new Date().toISOString() });
}
