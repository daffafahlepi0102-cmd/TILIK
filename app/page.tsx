'use client';

import { Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type LoginRole = 'apoteker' | 'dinkes';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<LoginRole>('apoteker');
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!identity || !password) { setError('Masukkan kredensial untuk melanjutkan.'); return; }
    window.localStorage.setItem('tilik-role', role);
    window.localStorage.setItem('tilik-user', identity);
    router.push(role === 'dinkes' ? '/dashboard' : '/apoteker');
  };
  const loginDemo = (demoRole: LoginRole) => {
    window.localStorage.setItem('tilik-role', demoRole);
    window.localStorage.setItem('tilik-user', demoRole === 'dinkes' ? 'Demo Regulator Dinkes' : 'Demo Apoteker Faskes');
    router.push(demoRole === 'dinkes' ? '/dashboard' : '/apoteker');
  };
  const loginWithSatuSehat = () => { window.localStorage.setItem('tilik-role', 'dinkes'); window.localStorage.setItem('tilik-user', 'SatuSehat Demo Regulator'); router.push('/dashboard'); };
  return <main className="login-page"><section className="login-intro"><div className="login-brand"><span className="login-mark"><ShieldCheck size={19} /></span><div><strong>TILIK</strong><small>2026</small></div></div><div className="intro-copy"><h1>Teknologi Informasi Lacak dan Kendali Antibiotik</h1><p>Prototipe Local Aggregator Hub untuk simulasi pencatatan, pengawasan, dan analisis penggunaan antibiotik di fasilitas kesehatan.</p></div><div className="network-card"><span className="network-label">SURVEILLANCE DATA DEMO</span><div className="network-lines"><i className="network-node one" /><i className="network-node two" /><i className="network-node three" /><i className="network-node four" /></div><div className="network-footer"><span>Simulasi apotek & klinik</span><b><i /> DATA SINTETIS</b></div></div></section><section className="login-panel"><div className="login-form-wrap"><div className="eyebrow">Prototipe / akses demo</div><h2>Masuk ke Sistem</h2><p className="login-subtitle">Pilih akses demo untuk menjelajahi dashboard Apoteker atau Dinkes. Kredensial pada formulir belum diverifikasi oleh server.</p><div className="role-switch"><button className={role === 'apoteker' ? 'selected' : ''} onClick={() => setRole('apoteker')}>Apoteker (Faskes)</button><button className={role === 'dinkes' ? 'selected' : ''} onClick={() => setRole('dinkes')}>Regulator (Dinkes)</button></div><div className="demo-login"><span>COBA DEMO</span><button type="button" onClick={() => loginDemo('apoteker')}>Apoteker demo</button><button type="button" onClick={() => loginDemo('dinkes')}>Dinkes demo</button></div><form onSubmit={submit}><label>Kredensial Pengguna<div className="input-icon"><UserRound size={18} /><input value={identity} onChange={event => setIdentity(event.target.value)} placeholder={role === 'apoteker' ? 'NIP / Nomor SIPA / ID Pengguna' : 'NIP / ID Otoritas Dinkes'} /></div></label><label>Kata Sandi<div className="input-icon"><LockKeyhole size={18} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="Masukkan kata sandi" /><button type="button" className="icon-button" aria-label="Tampilkan kata sandi" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{error && <p className="login-error">{error}</p>}<button className="login-submit" type="submit">MASUK DASHBOARD</button><button className="satu-button" type="button" onClick={loginWithSatuSehat}><ShieldCheck size={17} /> Simulasi akses SATUSEHAT (demo)</button></form><p className="login-footnote">Tidak terhubung ke layanan resmi SATUSEHAT • Data sintetis • Bukan untuk penggunaan klinis</p></div></section></main>;
}
