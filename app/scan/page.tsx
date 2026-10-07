'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  CheckCircle2,
  FileImage,
  ImagePlus,
  Keyboard,
  LoaderCircle,
  ScanLine,
  ShieldCheck,
  TriangleAlert,
  Upload,
  X,
} from 'lucide-react';

type VerificationResult = {
  status: 'valid' | 'used' | 'error';
  message: string;
};

export default function ScanPage() {
  const [code, setCode] = useState('');
  const [documentType, setDocumentType] = useState('Resep antibiotik');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannerMessage, setScannerMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!photo) {
      setPhotoUrl('');
      return;
    }

    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  useEffect(() => () => {
    const scanner = scannerRef.current;
    if (scanner?.isScanning) {
      void scanner.stop().catch(() => undefined);
    }
  }, []);

  const verify = async (source: 'manual' | 'camera' | 'photo', enteredCode = code) => {
    const normalizedCode = enteredCode.trim();
    if (!normalizedCode) {
      setResult({ status: 'error', message: 'Masukkan kode QR atau nomor resep terlebih dahulu.' });
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrCode: normalizedCode,
          source,
          documentType,
          imageName: source === 'photo' ? photo?.name : undefined,
        }),
      });
      const payload = await response.json();

      if (response.status === 409) {
        setResult({ status: 'used', message: payload.message });
      } else if (!response.ok) {
        setResult({ status: 'error', message: payload.message ?? 'Resep belum dapat diverifikasi.' });
      } else {
        setResult({
          status: 'valid',
          message: 'Kode tercatat untuk pemeriksaan lanjutan. Pastikan data resep dan pasien cocok sebelum penyerahan.',
        });
      }
    } catch {
      setResult({ status: 'error', message: 'Layanan verifikasi tidak dapat dihubungi. Periksa koneksi lalu coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  const startScanner = async () => {
    if (scannerActive && scannerRef.current) {
      await scannerRef.current.stop();
      setScannerActive(false);
      setScannerMessage('Kamera dihentikan.');
      return;
    }

    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      setScannerMessage('Meminta izin kamera…');
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (value) => {
          setCode(value);
          setScannerMessage('QR berhasil terbaca. Verifikasi sedang dijalankan.');
          void scanner.stop().then(() => setScannerActive(false)).catch(() => setScannerActive(false));
          void verify('camera', value);
        },
        () => undefined,
      );
      setScannerActive(true);
      setScannerMessage('Kamera aktif. Arahkan ke QR pada resep atau dokumen.');
    } catch {
      setScannerActive(false);
      setScannerMessage('Kamera tidak tersedia atau izin belum diberikan. Gunakan foto atau input manual.');
    }
  };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setResult({ status: 'error', message: 'Pilih berkas gambar resep dengan format gambar yang didukung.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setResult({ status: 'error', message: 'Ukuran gambar maksimal 10 MB.' });
      return;
    }
    setPhoto(file);
    setResult(null);
  };

  const submitManual = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void verify(photo ? 'photo' : 'manual');
  };

  return (
    <div className="page scan-page">
      <div className="scan-mobile-head">
        <a href="/apoteker" aria-label="Kembali ke dashboard">←</a>
        <strong>TILIK · Verifikasi</strong>
        <ScanLine size={22} />
      </div>

      <div className="eyebrow">Input / Verifikasi resep dan dokumen</div>
      <h1>Verifikasi resep antibiotik</h1>
      <p className="subtitle">
        Pindai QR, ambil foto atau unggah dokumen resep, maupun masukkan kode secara manual.
        Mendukung pemeriksaan resep pasien dan dokumentasi dispensasi fasilitas.
      </p>

      <div className="grid two-col scan-workspace">
        <section className="card scan-camera-card">
          <div className="section-title">
            <span>Pindai atau foto dokumen</span>
            <ShieldCheck size={19} color="#0f9f9a" />
          </div>

          <div id="qr-reader" className="scanner-box scanner-box-live">
            <div className="scanner-placeholder">
              <Camera size={48} strokeWidth={1.3} />
              <p>Kamera pemindai siap digunakan</p>
              <span className="meta">QR resep atau dokumen antibiotik</span>
            </div>
          </div>
          <p className="scanner-message" aria-live="polite">
            {scannerMessage || 'Kamera hanya aktif setelah Anda memberikan izin.'}
          </p>

          <div className="scan-capture-actions">
            <button className="btn teal" type="button" onClick={() => void startScanner()}>
              <ScanLine size={17} />
              {scannerActive ? 'Hentikan kamera' : 'Aktifkan kamera'}
            </button>
            <label className="btn ghost photo-picker">
              <ImagePlus size={17} />
              Ambil / unggah foto
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhoto}
                aria-label="Ambil atau unggah foto resep"
              />
            </label>
          </div>

          {photoUrl && photo && (
            <div className="prescription-photo">
              <img src={photoUrl} alt="Pratinjau foto dokumen resep" />
              <div className="prescription-photo-info">
                <FileImage size={17} />
                <span title={photo.name}>{photo.name}</span>
                <button type="button" aria-label="Hapus foto" onClick={() => setPhoto(null)}>
                  <X size={17} />
                </button>
              </div>
              <p className="meta">
                Foto ditampilkan sementara di perangkat ini. OCR dan unggah ke server belum diaktifkan.
              </p>
            </div>
          )}

          {!photoUrl && (
            <div className="photo-privacy-note">
              <Upload size={15} />
              <span>Gambar hanya dipratinjau di browser; tidak disimpan atau dikirim ke server demo.</span>
            </div>
          )}
        </section>

        <section className="card scan-manual-card">
          <div className="section-title">
            <span>Verifikasi kode atau detail</span>
            <Keyboard size={18} color="#718295" />
          </div>

          <form onSubmit={submitManual}>
            <label>
              Jenis dokumen
              <select value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
                <option>Resep antibiotik</option>
                <option>Dokumen resep pasien</option>
                <option>Bukti dispensasi fasilitas</option>
                <option>Dokumen pendukung verifikasi</option>
              </select>
            </label>
            <label className="scan-code-label">
              Kode QR atau nomor resep
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Contoh: RX-2026-0912"
                autoComplete="off"
                maxLength={100}
              />
              <span className="meta">Kode diperlukan untuk memeriksa status penebusan resep.</span>
            </label>
            <button className="btn scan-submit" type="submit" disabled={submitting}>
              {submitting ? <LoaderCircle size={17} className="spin" /> : <CheckCircle2 size={17} />}
              {submitting ? 'Memverifikasi…' : 'Verifikasi dokumen'}
            </button>
          </form>

          {result && (
            <div className={`card scan-result ${result.status === 'valid' ? 'valid-result' : result.status === 'used' ? 'used-result' : 'error-result'}`} role="status">
              {result.status === 'valid'
                ? <CheckCircle2 size={20} />
                : <TriangleAlert size={20} />}
              <strong>
                {result.status === 'valid'
                  ? 'KODE TERCATAT UNTUK VERIFIKASI'
                  : result.status === 'used'
                    ? 'PERINGATAN: RESEP SUDAH DITEBUS!'
                    : 'VERIFIKASI BELUM BERHASIL'}
              </strong>
              <p className="meta">{result.message}</p>
            </div>
          )}

          <div className="scan-demo-hint">
            Uji demo: <button type="button" onClick={() => { setCode('RX-USED-001'); setResult(null); }}>RX-USED-001</button>
            {' '}menampilkan resep yang sudah ditebus.
          </div>
        </section>
      </div>
    </div>
  );
}
