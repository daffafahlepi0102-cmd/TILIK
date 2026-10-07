'use client';

import { ArrowUpRight, Clock3, FileSearch, Flame, MapPin, ShieldAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import { anomalyCases } from '@/lib/data';

export default function AnomalyPage() {
  const [query, setQuery] = useState('');
  const [flagFilter, setFlagFilter] = useState('Semua risiko');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const red = anomalyCases.filter(item => item.flag === 'Red Flag').length;
  const yellow = anomalyCases.filter(item => item.flag === 'Yellow Flag').length;
  const filteredCases = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('id-ID');
    return anomalyCases.filter(item => {
      const matchesQuery = !normalizedQuery || [item.id, item.pharmacy, item.location, item.type].some(value => value.toLocaleLowerCase('id-ID').includes(normalizedQuery));
      const matchesFlag = flagFilter === 'Semua risiko' || item.flag === flagFilter;
      return matchesQuery && matchesFlag;
    });
  }, [query, flagFilter]);
  const pageCount = Math.max(1, Math.ceil(filteredCases.length / pageSize));
  const visibleCases = filteredCases.slice((page - 1) * pageSize, page * pageSize);
  const updateQuery = (value: string) => { setQuery(value); setPage(1); };
  const updateFilter = (value: string) => { setFlagFilter(value); setPage(1); };
  return <div className="page"><div className="eyebrow">Early Warning System / Local Aggregator Hub</div><div className="page-heading"><div><h1>Anomali & Investigasi</h1><p className="subtitle">Deteksi dini transaksi antibiotik berisiko dan tindak lanjut terukur Dinas Kesehatan.</p></div><span className="live-pill"><i /> MONITORING AKTIF • 38 PROVINSI</span></div><div className="grid kpis anomaly-kpis"><Kpi icon={<ShieldAlert size={18}/>} label="Total anomali aktif" value={String(anomalyCases.length)} detail="Apotek lintas 38 provinsi" /><Kpi icon={<Flame size={18}/>} label="Kritis / Red Flag" value={String(red)} detail="Butuh penanganan cepat" alert /><Kpi icon={<FileSearch size={18}/>} label="Waspada / Yellow Flag" value={String(yellow)} detail="Perlu dipantau" /><Kpi icon={<Clock3 size={18}/>} label="Rata-rata waktu respon" value="1,2 hari" detail="Target maksimal 3 hari" /></div><section className="card anomaly-flow"><div className="flow-step active"><b>01</b><span>Deteksi otomatis</span><small>Aggregator menganalisis transaksi</small></div><ArrowUpRight className="anomaly-flow-arrow" size={18}/><div className="flow-step"><b>02</b><span>Review Dinkes</span><small>Validasi bukti dan tingkat risiko</small></div><ArrowUpRight className="anomaly-flow-arrow" size={18}/><div className="flow-step"><b>03</b><span>Tindak lanjut</span><small>Investigasi, audit, atau rekomendasi</small></div></section><section className="card"><div className="section-title anomaly-table-heading"><span>Daftar anomali aktif</span><span className="meta">{filteredCases.length.toLocaleString('id-ID')} dari {anomalyCases.length.toLocaleString('id-ID')} apotek</span></div><div className="anomaly-filters"><label htmlFor="anomaly-search">Cari apotek, lokasi, jenis, atau ID<input id="anomaly-search" value={query} onChange={event => updateQuery(event.target.value)} placeholder="Contoh: Bandung atau ANM-2026" /></label><label htmlFor="anomaly-risk">Tingkat risiko<select id="anomaly-risk" value={flagFilter} onChange={event => updateFilter(event.target.value)}><option>Semua risiko</option><option>Red Flag</option><option>Yellow Flag</option></select></label></div><div className="table-wrap"><table><thead><tr><th>ID Anomali</th><th>Apotek & lokasi</th><th>Jenis indikasi pelanggaran</th><th>Risiko</th><th>Waktu</th><th>Aksi</th></tr></thead><tbody>{visibleCases.map(item => <tr key={item.id}><td><strong>#{item.id}</strong><br/><span className="meta">Skor {item.score}/100</span></td><td><strong>{item.pharmacy}</strong><br/><span className="meta"><MapPin size={12}/> {item.location}</span></td><td><strong>{item.type}</strong><br/><span className="meta">{item.description}</span></td><td><span className={`badge ${item.flag === 'Red Flag' ? 'red' : 'yellow'}`}>{item.flag}</span></td><td className="meta">{item.created}</td><td><a className="btn small-btn" href={`/investigasi?case=${item.id}`}>{item.status === 'Baru Masuk' ? 'Buka investigasi' : 'Tinjau detail'} <ArrowUpRight size={14}/></a></td></tr>)}</tbody></table>{visibleCases.length === 0 && <p className="anomaly-empty">Tidak ada kasus yang cocok dengan pencarian tersebut.</p>}</div><div className="inventory-pagination anomaly-pagination"><span className="meta">Menampilkan {visibleCases.length ? ((page - 1) * pageSize + 1).toLocaleString('id-ID') : 0}–{Math.min(page * pageSize, filteredCases.length).toLocaleString('id-ID')} dari {filteredCases.length.toLocaleString('id-ID')} kasus</span><div><button className="btn ghost" disabled={page <= 1} onClick={() => setPage(current => current - 1)}>Sebelumnya</button><span className="meta">Halaman {page} / {pageCount}</span><button className="btn ghost" disabled={page >= pageCount} onClick={() => setPage(current => current + 1)}>Berikutnya</button></div></div></section></div>;
}
function Kpi({icon, label, value, detail, alert}: {icon:React.ReactNode; label:string; value:string; detail:string; alert?:boolean}) { return <div className={`card report-kpi ${alert ? 'report-alert' : ''}`}><div className="report-kpi-icon">{icon}</div><div className="kpi-label">{label}</div><div className="kpi-value">{value}</div><div className="meta">{detail}</div></div>; }
