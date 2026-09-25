import { NextResponse } from 'next/server';
import { nationalStockInventory } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ data: nationalStockInventory, totalItems: nationalStockInventory.length, provinces: 38, critical: nationalStockInventory.filter(item => item.status === 'Kritis').length, generatedAt: new Date().toISOString() });
}
