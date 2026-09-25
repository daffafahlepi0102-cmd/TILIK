'use client';

import { CalendarDays, CheckCircle2, Download, FileText, LockKeyhole, MailWarning, MapPin, Send, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { anomalyCases, auditTrail } from '@/lib/data';
import { downloadTextPdf } from '@/lib/download';

const stages = ['Baru Masuk', 'Dalam Audit Lapangan', 'Menunggu Klarifikasi', 'Selesai / Diberi Sanksi'];

export default function InvestigationPage() {
  const params = useSearchParams();
  const [actionMessage, setActionMessage] = useState('');
  const selected = anomalyCases.find(item => item.id === params.get('case')) ?? anomalyCases[0];
  const runAction = (message: string) => setActionMessage(`${message} untuk ${selected.pharmacy} berhasil dicatat di audit trail.`);
  const downloadInvestigation = () => downloadTextPdf(`${selected.id}-investigasi.pdf`, `TILIK - Laporan Investigasi ${selected.id}`, [`Apotek: ${selected.pharmacy}`, `Lokasi: ${selected.location}`, `Flag: ${selected.flag}`, `Risk score: ${selected.score}/100`, '', 'Bukti investigasi:', 'Lonjakan transaksi Azithromycin +300% dalam 3 hari.', '42 transaksi diperiksa; 7 percobaan QR ganda terblokir.', 'Selisih 86 unit antara stok sistem dan mutasi resep.', '', ...auditTrail.map(item => `${item.date} - ${item.actor}: ${item.action}`)]);
  return <div className="page">
    <div className="eyebrow">Actionable Surveillance / Workspace Dinkes</div>
    <div className="page-heading"><div><h1>Investigasi {selected.id}</h1><p className="subtitle">Tindak lanjut kasus {selected.pharmacy} sampai bukti terverifikasi dan intervensi diterbitkan.</p></div><span className={`badge ${selected.flag === 'Red Flag' ? 'red' : 'yellow'}`}>{selected.flag}</span></div>
    <section className="card investigation-case"><div><span className="kpi-label">Kasus terpilih</span><h2>{selected.pharmacy}</h2><p className="meta"><MapPin size={13}/> {selected.location} • {selected.created}</p></div><div className="case-score"><span>Risk score</span><strong>{selected.score}</strong><small>/ 100</small></div></section>
    <section className="card investigation-pipeline"><div className="section-title"><span>Pipeline investigasi</span><span className="meta">Deteksi dini → tindak lanjut</span></div><div className="pipeline">{stages.map((stage, index) => <div className={`pipeline-stage ${stage === selected.status ? 'current' : ''}`} key={stage}><span>{index + 1}</span><strong>{stage}</strong><small>{index === 0 ? 'Kasus baru dari aggregator' : index === 1 ? 'Tim pengawas ditugaskan' : index === 2 ? 'Menunggu dokumen faskes' : 'Audit selesai dan tercatat'}</small></div>)}</div></section>
    <div className="grid investigation-columns"><section className="card"><div className="section-title"><span>Laporan investigasi otomatis</span><button className="btn ghost" onClick={downloadInvestigation}><Download size={15}/> Unduh PDF</button></div><div className="evidence-list"><Evidence title="Lonjakan transaksi" detail="Azithromycin +300% dalam 3 hari dibanding baseline wilayah."/><Evidence title="Log resep dan QR" detail="42 transaksi diperiksa; 7 percobaan QR ganda terblokir."/><Evidence title="Kesesuaian stok" detail="Selisih 86 unit ditemukan antara stok sistem dan mutasi resep."/></div><div className="investigation-note"><FileText size={18}/><span>Dokumen audit otomatis siap diunduh dan dikirim ke tim lapangan.</span></div></section>
      <section className="card"><div className="section-title"><span>Pusat intervensi Dinkes</span><ShieldCheck size={18} color="#217bd2"/></div><div className="action-grid"><button className="action-card" onClick={() => runAction('Surat SP-1')}><MailWarning size={19}/><strong>Kirim e-SP</strong><small>SP-1 / SP-2 / SP-3</small></button><button className="action-card" onClick={() => runAction('Inspeksi lapangan')}><CalendarDays size={19}/><strong>Jadwalkan inspeksi</strong><small>Assign tim lapangan</small></button><button className="action-card danger" onClick={() => runAction('Pembekuan akses')}><LockKeyhole size={19}/><strong>Bekukan akses</strong><small>Batasi kategori antibiotik</small></button><button className="action-card" onClick={() => runAction('Rekomendasi kebijakan lokal')}><Send size={19}/><strong>Rekomendasi lokal</strong><small>Atur kuota distributor</small></button></div>{actionMessage && <div className="action-confirm"><CheckCircle2 size={16}/> {actionMessage}</div>}</section></div>
    <section className="card audit-section"><div className="section-title"><span>Log riwayat audit</span><span className="meta">Audit trail immutable</span></div><div className="audit-list">{auditTrail.map(item => <div className="audit-row" key={item.date}><CheckCircle2 size={17}/><div><strong>{item.date}</strong><p>{item.actor} — {item.action}</p></div></div>)}</div></section>
  </div>;
}
function Evidence({title, detail}: {title:string; detail:string}) { return <div className="evidence-row"><CheckCircle2 size={17}/><div><strong>{title}</strong><p>{detail}</p></div><span className="badge green">Terverifikasi</span></div>; }
