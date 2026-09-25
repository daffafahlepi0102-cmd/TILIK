'use client';

import { Bell, CalendarDays, ClipboardList, FileCheck2, LayoutDashboard, LogOut, ScanLine, ShieldAlert, ShieldCheck, UserRound, Warehouse, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Profile = { role: 'APOTEKER' | 'DINKES'; name: string; title: string; id: string; facility: string; location: string; license: string };
const profiles: Record<string, Profile> = {
  apoteker: { role: 'APOTEKER', name: 'Apt. Sari Dewi, S.Farm', title: 'Apoteker Penanggung Jawab', id: 'SIPA-JBR-2026-00418', facility: 'Apotek Sehat Sentosa', location: 'Bandung, Jawa Barat', license: 'SIPA aktif sampai 31 Desember 2026' },
  dinkes: { role: 'DINKES', name: 'Dr. Aditya Pranoto', title: 'Administrator Regulator Nasional', id: 'NIP-19870412-2026', facility: 'Dinas Kesehatan Provinsi Jawa Barat', location: 'Bandung, Jawa Barat', license: 'Akses regulator tingkat provinsi' },
};

export default function Shell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessionRole, setSessionRole] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const role = window.localStorage.getItem('tilik-role');
    if (!role && pathname !== '/') router.replace('/');
    setSessionRole(role);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [pathname, router]);
  if (pathname === '/') return <>{children}</>;
  if (!sessionRole) return <div className="session-loading">Memeriksa akses TILIK...</div>;
  const pharmacist = sessionRole === 'apoteker';
  const profile = profiles[pharmacist ? 'apoteker' : 'dinkes'];
  const dateLabel = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(now);
  const timeLabel = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
  const logout = () => { window.localStorage.removeItem('tilik-role'); window.localStorage.removeItem('tilik-user'); router.push('/'); };
  const navItems = pharmacist ? [{ href: '/apoteker', label: 'Dashboard', icon: LayoutDashboard }, { href: '/apoteker', label: 'Transaksi', icon: FileCheck2 }, { href: '/scan', label: 'Pindai', icon: ScanLine }, { href: '/stok', label: 'Stok', icon: Warehouse }, { href: '/laporan', label: 'Laporan', icon: ClipboardList }] : [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }, { href: '/anomali', label: 'Anomali', icon: ShieldAlert }, { href: '/investigasi', label: 'Investigasi', icon: ShieldCheck }, { href: '/stok', label: 'Stok', icon: Warehouse }, { href: '/laporan', label: 'Laporan', icon: ClipboardList }];
  return <div className="shell"><aside className="sidebar"><div className="brand"><span className="brand-mark"><ShieldCheck size={18}/></span><span>TILIK<small>2026</small></span></div><div className="nav-label">{pharmacist ? 'Fasilitas Kesehatan' : 'Surveillance'}</div><a className={`nav-item ${pathname === '/dashboard' || (pharmacist && pathname === '/apoteker') ? 'active' : ''}`} href={pharmacist ? '/apoteker' : '/dashboard'}><LayoutDashboard size={17} /> Dashboard</a>{!pharmacist && <><a className={`nav-item ${pathname === '/anomali' ? 'active' : ''}`} href="/anomali"><ShieldAlert size={17} /> Anomali</a><a className={`nav-item ${pathname.startsWith('/investigasi') ? 'active' : ''}`} href="/investigasi"><ShieldCheck size={17} /> Investigasi</a><a className={`nav-item ${pathname === '/laporan' ? 'active' : ''}`} href="/laporan"><ClipboardList size={17} /> Laporan Wilayah</a></>}<a className={`nav-item ${pathname === '/apoteker' ? 'active' : ''}`} href="/apoteker"><FileCheck2 size={17} /> Resep & Transaksi</a><a className={`nav-item ${pathname === '/scan' ? 'active' : ''}`} href="/scan"><ScanLine size={17} /> Pindai Resep</a><a className={`nav-item ${pathname === '/stok' ? 'active' : ''}`} href="/stok"><Warehouse size={17} /> Stok Antibiotik</a><button className="nav-item nav-logout" onClick={logout}><LogOut size={17} /> Keluar</button></aside><main className="content"><header className="topbar"><div className="topbar-date"><CalendarDays size={15}/><span>{dateLabel} • {timeLabel} WIB</span></div><div className="user-area"><Bell size={18} color="#607486"/><button className="profile-trigger" onClick={() => setProfileOpen(true)}><span className="profile-avatar"><UserRound size={16}/></span><span className="profile-copy"><strong>{profile.name}</strong><small>{profile.facility}</small></span><span className="badge green">{profile.role}</span></button></div></header>{children}<nav className="mobile-nav">{navItems.map(({ href, label, icon: Icon }) => <a className={pathname === href ? 'active' : ''} href={href} key={`${href}-${label}`}><Icon size={18}/><span>{label}</span></a>)}</nav>{profileOpen && <div className="profile-overlay" onClick={() => setProfileOpen(false)}><section className="profile-panel" onClick={event => event.stopPropagation()}><button className="profile-close" aria-label="Tutup profil" onClick={() => setProfileOpen(false)}><X size={18}/></button><div className="profile-hero"><span className="profile-avatar large"><UserRound size={25}/></span><div><span className="badge green">{profile.role} DEMO</span><h2>{profile.name}</h2><p>{profile.title}</p></div></div><div className="profile-details"><ProfileDetail label="ID pengguna" value={profile.id}/><ProfileDetail label="Fasilitas" value={profile.facility}/><ProfileDetail label="Wilayah kerja" value={profile.location}/><ProfileDetail label="Status akses" value={profile.license}/></div><button className="btn ghost profile-done" onClick={() => setProfileOpen(false)}>Tutup profil</button></section></div>}</main></div>;
}
function ProfileDetail({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
