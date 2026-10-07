'use client';

import { AlertTriangle, ArrowDownToLine, PackageCheck, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { nationalStockInventory, provinceNames } from '@/lib/data';

export default function StockPage() {
  const [selectedProvince, setSelectedProvince] = useState('Semua Provinsi');
  const [medicineSearch, setMedicineSearch] = useState('');
  const [page, setPage] = useState(0);
  const critical = nationalStockInventory.filter(item => item.status === 'Kritis').length;
  const totalStock = nationalStockInventory.reduce((sum, item) => sum + item.stock, 0);
  const filteredInventory = nationalStockInventory.filter(item =>
    (selectedProvince === 'Semua Provinsi' || item.province === selectedProvince)
    && item.medicine.toLowerCase().includes(medicineSearch.trim().toLowerCase()),
  );
  const pageSize = 50;
  const pageCount = Math.ceil(filteredInventory.length / pageSize);
  const visibleInventory = filteredInventory.slice(page * pageSize, (page + 1) * pageSize);
  const updateProvince = (value: string) => { setSelectedProvince(value); setPage(0); };
  const updateMedicine = (value: string) => { setMedicineSearch(value); setPage(0); };
  return <div className="page"><div className="eyebrow">Logistik nasional / Persediaan antibiotik</div><div className="page-heading"><div><h1>Stok antibiotik Indonesia</h1><p className="subtitle">Pantau ketersediaan, laju pengeluaran, dan kebutuhan reorder lintas 38 provinsi.</p></div><button className="btn ghost"><RefreshCw size={15}/> Sinkronkan stok</button></div><div className="grid kpis"><Kpi label="Total stok terpantau" value={`${(totalStock / 1000).toFixed(1)}k`} detail={`${nationalStockInventory.length.toLocaleString('id-ID')} item • ${provinceNames.length} provinsi`} /><Kpi label="Item perlu reorder" value={String(critical)} detail="Prioritas distribusi hari ini" alert /><Kpi label="Provinsi terhubung" value={String(provinceNames.length)} detail="Agregator aktif nasional" /><Kpi label="Antibiotik dalam katalog" value={String(new Set(nationalStockInventory.map(item => item.medicine)).size)} detail="Nama generik dan kekuatan sediaan" /></div><section className="card stock-summary"><div className="summary-callout"><PackageCheck size={22}/><div><strong>Ketersediaan nasional terkendali</strong><p className="meta">Stok Access mendominasi. Item Watch di bawah titik reorder diprioritaskan untuk redistribusi.</p></div></div></section><section className="card" style={{marginTop:18}}><div className="section-title"><span>Inventaris lintas 38 provinsi</span><span className="meta">{filteredInventory.length.toLocaleString('id-ID')} item ditemukan</span></div><div className="inventory-filters"><label>Provinsi<select value={selectedProvince} onChange={event => updateProvince(event.target.value)}><option>Semua Provinsi</option>{provinceNames.map(province => <option key={province}>{province}</option>)}</select></label><label>Cari antibiotik<input value={medicineSearch} onChange={event => updateMedicine(event.target.value)} placeholder="Cari nama atau kekuatan obat" /></label></div><div className="table-wrap"><table><thead><tr><th>Provinsi</th><th>Antibiotik</th><th>AWaRe</th><th>Stok tersedia</th><th>Keluar/bulan</th><th>Titik reorder</th><th>Status</th><th></th></tr></thead><tbody>{visibleInventory.map(item => <tr key={`${item.province}-${item.medicine}`}><td><strong>{item.province}</strong></td><td>{item.medicine}</td><td><span className={`badge ${item.aware === 'Access' ? 'green' : item.aware === 'Reserve' ? 'red' : 'yellow'}`}>{item.aware}</span></td><td>{item.stock.toLocaleString('id-ID')} unit</td><td>{item.monthlyOut.toLocaleString('id-ID')}</td><td>{item.reorderPoint.toLocaleString('id-ID')}</td><td><span className={`badge ${item.status === 'Kritis' ? 'red' : item.status === 'Waspada' ? 'yellow' : 'green'}`}>{item.status}</span></td><td>{item.status === 'Kritis' && <button className="icon-action" title="Ajukan reorder"><ArrowDownToLine size={16}/></button>}</td></tr>)}</tbody></table></div><div className="inventory-pagination"><span className="meta">Halaman {page + 1} dari {Math.max(pageCount, 1)} • menampilkan {visibleInventory.length} item</span><div><button className="btn ghost" disabled={page === 0} onClick={() => setPage(current => current - 1)}>Sebelumnya</button><button className="btn ghost" disabled={page + 1 >= pageCount} onClick={() => setPage(current => current + 1)}>Berikutnya</button></div></div></section></div>;
}
function Kpi({label, value, detail, alert}: {label:string; value:string; detail:string; alert?:boolean}) { return <div className={`card ${alert ? 'stock-kpi-alert' : ''}`}><div className="kpi-label">{label}</div><div className="kpi-value">{value}</div><div className="meta">{detail}</div></div>; }
