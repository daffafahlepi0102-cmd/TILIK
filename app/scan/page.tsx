'use client';
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CheckCircle2, Keyboard, ScanLine, TriangleAlert } from 'lucide-react';

export default function ScanPage() {
	const [code, setCode] = useState('');
	const [result, setResult] = useState<'idle'|'valid'|'used'>('idle');
	const scannerRef = useRef<Html5Qrcode | null>(null);
	useEffect(() => () => { if (scannerRef.current?.isScanning) scannerRef.current.stop().catch(() => undefined); }, []);
	const startScanner = async () => {
		const scanner = new Html5Qrcode('qr-reader'); scannerRef.current = scanner;
		await scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: 220 }, value => { setCode(value); setResult(value.toUpperCase().includes('USED') ? 'used' : 'valid'); scanner.stop().catch(() => undefined); }, () => undefined);
	};
	const check = () => setResult(code.toUpperCase().includes('USED') ? 'used' : 'valid');
	return <div className="page scan-page"><div className="scan-mobile-head"><a href="/apoteker">←</a><strong>TILIK Apotek - Pindai Resep</strong><ScanLine size={22}/></div><div className="eyebrow">Input / Verifikasi resep</div><h1>Pindai resep pasien</h1><p className="subtitle">Arahkan kamera ke QR resep atau masukkan kode secara manual.</p><div className="grid two-col"><section className="card"><div id="qr-reader" className="scanner-box"><div style={{textAlign:'center'}}><Camera size={48} strokeWidth={1.2}/><p style={{fontSize:15}}>Kamera pemindai siap digunakan</p><span className="meta">HTML5 QR Scanner</span></div></div><button className="btn teal" style={{marginTop:17, width:'100%'}} onClick={startScanner}><ScanLine size={17}/> Aktifkan kamera</button></section><section className="card"><div className="section-title"><span>Input manual</span><Keyboard size={18} color="#718295" /></div><label>Kode QR resep<input value={code} onChange={e => setCode(e.target.value)} placeholder="Contoh: RX-2026-0912" /></label><button className="btn" style={{marginTop:16, width:'100%'}} onClick={check}>Verifikasi resep</button>{result === 'valid' && <div className="card scan-result valid-result" style={{marginTop:18}}><CheckCircle2 size={20} color="#16805b"/><strong>RESEP SAH DAN LENGKAP</strong><p className="meta">Resep belum pernah ditebus. Silakan lanjutkan validasi data pasien.</p></div>}{result === 'used' && <div className="card scan-result used-result" style={{marginTop:18}}><TriangleAlert size={20} color="#c94b3e"/><strong>PERINGATAN: RESEP SUDAH DITEBUS!</strong><p className="meta">Penyerahan ulang diblokir otomatis untuk mencegah resistensi ganda antimikroba.</p></div>}</section></div></div>;
}
