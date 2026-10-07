export type Role = 'dinkes' | 'apoteker';
export type Flag = 'Red Flag' | 'Yellow Flag';
export type AwareCategory = 'Access' | 'Watch' | 'Reserve';

export const provinceNames = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi',
  'Sumatera Selatan', 'Kepulauan Bangka Belitung', 'Bengkulu', 'Lampung',
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur',
  'Banten', 'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur',
  'Kalimantan Utara', 'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan',
  'Sulawesi Tenggara', 'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara',
  'Papua', 'Papua Barat', 'Papua Selatan', 'Papua Tengah', 'Papua Pegunungan',
  'Papua Barat Daya',
];

const provinceCodes = [
  'AC', 'SU', 'SB', 'RI', 'KR', 'JA', 'SS', 'BB', 'BE', 'LA', 'DKI', 'JB',
  'JT', 'DIY', 'JI', 'BA', 'BI', 'NTB', 'NTT', 'KB', 'KT', 'KS', 'KI', 'KU',
  'SN', 'ST', 'SS', 'SG', 'GO', 'SW', 'MA', 'MU', 'PA', 'PB', 'PS', 'PT',
  'PG', 'PD',
];

export const allProvinces = provinceNames.map((name, index) => ({
  name,
  code: `${provinceCodes[index]}${index + 1}`,
  prescriptions: (3280 + (index * 731) % 11200).toLocaleString('id-ID'),
  compliance: `${(89.2 + ((index * 7) % 82) / 10).toFixed(1).replace('.', ',')}%`,
  anomalies: 4 + ((index * 5) % 24),
  level: index % 7 === 0 ? 'Waspada' : index % 5 === 0 ? 'Tinggi' : 'Stabil',
}));
export const provinces = allProvinces;

const pharmacySeeds = [
  { name: 'Apotek Sehat Sentosa', city: 'Bandung', prescriptions: 482, compliance: 96, flag: 'Red Flag' as Flag, detail: 'Penjualan Amoxicillin 2.4x di atas baseline' },
  { name: 'Apotek Kimia Farma 04', city: 'Bekasi', prescriptions: 361, compliance: 88, flag: 'Yellow Flag' as Flag, detail: 'Kelengkapan resep menurun 7% minggu ini' },
  { name: 'Klinik Medika Utama', city: 'Bogor', prescriptions: 247, compliance: 91, flag: 'Yellow Flag' as Flag, detail: 'Rasio stok dan resep tidak seimbang' },
  { name: 'Apotek Bina Sehat', city: 'Depok', prescriptions: 226, compliance: 86, flag: 'Red Flag' as Flag, detail: 'Dispensing tanpa resep meningkat 31%' },
  { name: 'Apotek Nusantara', city: 'Cirebon', prescriptions: 194, compliance: 90, flag: 'Yellow Flag' as Flag, detail: 'Klaim stok tidak sesuai mutasi' },
  { name: 'RSUD Harapan Mulya', city: 'Sukabumi', prescriptions: 178, compliance: 93, flag: 'Yellow Flag' as Flag, detail: 'Cefixime melewati ambang historis' },
  { name: 'Apotek Prima Medika', city: 'Tasikmalaya', prescriptions: 162, compliance: 84, flag: 'Red Flag' as Flag, detail: 'Pola resep berulang dari pasien sama' },
  { name: 'Klinik Pratama Sejahtera', city: 'Garut', prescriptions: 151, compliance: 95, flag: 'Yellow Flag' as Flag, detail: 'Pelaporan transaksi terlambat 2 hari' },
  { name: 'Apotek Citra Husada', city: 'Karawang', prescriptions: 139, compliance: 89, flag: 'Yellow Flag' as Flag, detail: 'Rasio Watch terhadap Access meningkat' },
  { name: 'Apotek Mitra Keluarga', city: 'Purwakarta', prescriptions: 121, compliance: 87, flag: 'Red Flag' as Flag, detail: 'Lonjakan stok keluar tanpa diagnosis' },
];

export const pharmacies = Array.from({ length: 300 }, (_, index) => {
  const seed = pharmacySeeds[index];
  const province = provinceNames[index % provinceNames.length];
  const flag: Flag = index % 5 === 0 || index % 7 === 0 ? 'Red Flag' : 'Yellow Flag';
  return seed ?? {
    name: `${index % 3 === 0 ? 'Apotek' : index % 3 === 1 ? 'Klinik' : 'RSUD'} ${['Sehat Nusantara', 'Medika Utama', 'Husada Jaya', 'Farma Sentosa'][index % 4]} ${String(index + 1).padStart(3, '0')}`,
    city: province,
    prescriptions: 70 + ((index * 47) % 560),
    compliance: 78 + ((index * 13) % 22),
    flag,
    detail: [
      'Lonjakan penggunaan antibiotik di atas baseline wilayah',
      'Kelengkapan resep perlu diverifikasi',
      'Selisih mutasi stok dan transaksi terdeteksi',
      'Rasio antibiotik Watch meningkat pada periode pemantauan',
    ][index % 4],
  };
});

export const metrics = {
  prescriptions: '128.470',
  compliance: '94,8%',
  anomalies: String(pharmacies.length),
  pharmacies: pharmacies.length.toLocaleString('id-ID'),
};
export const trend = [42, 58, 51, 70, 63, 82, 76, 92, 73, 84, 68, 79];

export const antibioticCatalog: { name: string; aware: AwareCategory }[] = [
  { name: 'Amoxicillin 250mg', aware: 'Access' }, { name: 'Amoxicillin 500mg', aware: 'Access' },
  { name: 'Amoxicillin 1g', aware: 'Access' }, { name: 'Ampicillin 500mg', aware: 'Access' },
  { name: 'Benzathine benzylpenicillin 1.2 juta IU', aware: 'Access' }, { name: 'Benzylpenicillin 1 juta IU', aware: 'Access' },
  { name: 'Phenoxymethylpenicillin 500mg', aware: 'Access' }, { name: 'Cloxacillin 500mg', aware: 'Access' },
  { name: 'Piperacillin/tazobactam 4.5g', aware: 'Watch' }, { name: 'Cefalexin 500mg', aware: 'Access' },
  { name: 'Cefazolin 1g', aware: 'Access' }, { name: 'Cefadroxil 500mg', aware: 'Access' },
  { name: 'Cefuroxime 500mg', aware: 'Watch' }, { name: 'Cefaclor 500mg', aware: 'Watch' },
  { name: 'Cefixime 200mg', aware: 'Watch' }, { name: 'Cefpodoxime 200mg', aware: 'Watch' },
  { name: 'Cefotaxime 1g', aware: 'Watch' }, { name: 'Ceftriaxone 1g', aware: 'Watch' },
  { name: 'Ceftazidime 1g', aware: 'Watch' }, { name: 'Cefepime 1g', aware: 'Watch' },
  { name: 'Ceftaroline 600mg', aware: 'Reserve' }, { name: 'Meropenem 1g', aware: 'Watch' },
  { name: 'Imipenem/cilastatin 500mg', aware: 'Watch' }, { name: 'Ertapenem 1g', aware: 'Watch' },
  { name: 'Azithromycin 250mg', aware: 'Watch' }, { name: 'Azithromycin 500mg', aware: 'Watch' },
  { name: 'Clarithromycin 500mg', aware: 'Watch' }, { name: 'Erythromycin 500mg', aware: 'Watch' },
  { name: 'Doxycycline 100mg', aware: 'Access' }, { name: 'Tetracycline 500mg', aware: 'Access' },
  { name: 'Ciprofloxacin 500mg', aware: 'Watch' }, { name: 'Levofloxacin 500mg', aware: 'Watch' },
  { name: 'Moxifloxacin 400mg', aware: 'Watch' }, { name: 'Ofloxacin 200mg', aware: 'Watch' },
  { name: 'Gentamicin 80mg', aware: 'Access' }, { name: 'Amikacin 500mg', aware: 'Access' },
  { name: 'Tobramycin 80mg', aware: 'Access' }, { name: 'Clindamycin 300mg', aware: 'Access' },
  { name: 'Metronidazole 500mg', aware: 'Access' }, { name: 'Trimethoprim/sulfamethoxazole 400/80mg', aware: 'Access' },
  { name: 'Nitrofurantoin 100mg', aware: 'Access' }, { name: 'Fosfomycin 3g', aware: 'Access' },
  { name: 'Chloramphenicol 500mg', aware: 'Access' }, { name: 'Linezolid 600mg', aware: 'Reserve' },
  { name: 'Vancomycin 1g', aware: 'Watch' }, { name: 'Teicoplanin 400mg', aware: 'Watch' },
  { name: 'Daptomycin 500mg', aware: 'Reserve' }, { name: 'Colistin 1 juta IU', aware: 'Reserve' },
  { name: 'Tigecycline 50mg', aware: 'Reserve' }, { name: 'Rifampicin 300mg', aware: 'Watch' },
  { name: 'Isoniazid 300mg', aware: 'Watch' }, { name: 'Ethambutol 400mg', aware: 'Watch' },
  { name: 'Pyrazinamide 500mg', aware: 'Watch' }, { name: 'Cotrimoxazole 800/160mg', aware: 'Access' },
  { name: 'Cefoperazone/sulbactam 1.5g', aware: 'Watch' }, { name: 'Amoxicillin/clavulanate 625mg', aware: 'Access' },
  { name: 'Cefixime 100mg', aware: 'Watch' }, { name: 'Doxycycline 100mg kapsul', aware: 'Access' },
];

const samplePatients = ['P•••••• R••••', 'A•••••• S••••', 'D•••••• K••••', 'S•••••• M••••', 'F•••••• A••••', 'N•••••• H••••'];
export const recentTransactions = Array.from({ length: 240 }, (_, index) => {
  const medicine = antibioticCatalog[(index * 7) % antibioticCatalog.length];
  return {
    id: `RX-2026-${String(912 - index).padStart(4, '0')}`,
    patient: samplePatients[index % samplePatients.length],
    medicine: medicine.name,
    category: medicine.aware,
    status: index % 11 === 1 ? 'Karantina' : 'Terverifikasi',
    scannedAt: new Date(Date.UTC(2026, 9, 6, 7, 0) - index * 17 * 60000).toISOString(),
  };
});

export const stockInventory = [
  { province: 'Jawa Barat', medicine: 'Amoxicillin 500mg', aware: 'Access', stock: 18420, monthlyOut: 9230, reorderPoint: 5000, status: 'Aman' },
  { province: 'Jawa Timur', medicine: 'Cefixime 200mg', aware: 'Watch', stock: 3820, monthlyOut: 4140, reorderPoint: 4500, status: 'Kritis' },
  { province: 'Jawa Tengah', medicine: 'Azithromycin 500mg', aware: 'Watch', stock: 6740, monthlyOut: 2980, reorderPoint: 4000, status: 'Waspada' },
  { province: 'DKI Jakarta', medicine: 'Amoxicillin 500mg', aware: 'Access', stock: 22100, monthlyOut: 11020, reorderPoint: 6000, status: 'Aman' },
  { province: 'Banten', medicine: 'Ciprofloxacin 500mg', aware: 'Watch', stock: 2940, monthlyOut: 2510, reorderPoint: 3000, status: 'Waspada' },
  { province: 'Sumatera Utara', medicine: 'Ceftriaxone 1g', aware: 'Watch', stock: 1280, monthlyOut: 1640, reorderPoint: 1800, status: 'Kritis' },
  { province: 'Sulawesi Selatan', medicine: 'Doxycycline 100mg', aware: 'Access', stock: 4860, monthlyOut: 1920, reorderPoint: 2500, status: 'Aman' },
  { province: 'DI Yogyakarta', medicine: 'Meropenem 1g', aware: 'Watch', stock: 210, monthlyOut: 420, reorderPoint: 300, status: 'Kritis' },
  { province: 'Bali', medicine: 'Clindamycin 300mg', aware: 'Access', stock: 2140, monthlyOut: 1180, reorderPoint: 1500, status: 'Aman' },
  { province: 'Kalimantan Timur', medicine: 'Linezolid 600mg', aware: 'Reserve', stock: 98, monthlyOut: 27, reorderPoint: 60, status: 'Aman' },
  { province: 'Sumatera Barat', medicine: 'Gentamicin 80mg', aware: 'Access', stock: 1760, monthlyOut: 880, reorderPoint: 1000, status: 'Aman' },
  { province: 'Nusa Tenggara Barat', medicine: 'Cefixime 200mg', aware: 'Watch', stock: 920, monthlyOut: 1340, reorderPoint: 1200, status: 'Kritis' },
];
export const nationalStockInventory = provinceNames.flatMap((province, provinceIndex) =>
  antibioticCatalog.map((medicine, medicineIndex) => {
    const monthlyOut = 180 + ((provinceIndex * 911 + medicineIndex * 173) % 8500);
    const reorderPoint = Math.round(monthlyOut * (0.55 + (medicineIndex % 4) * 0.08));
    const stock = 120 + ((provinceIndex * 1731 + medicineIndex * 347) % 19000);
    const status = stock < reorderPoint ? 'Kritis' : stock < reorderPoint * 1.35 ? 'Waspada' : 'Aman';
    return { province, medicine: medicine.name, aware: medicine.aware, stock, monthlyOut, reorderPoint, status };
  }),
);

export const awareReport = [
  { category: 'Access', count: 84260, percentage: 68.4, examples: 'Amoxicillin, Doxycycline' },
  { category: 'Watch', count: 37320, percentage: 30.3, examples: 'Cefixime, Ciprofloxacin' },
  { category: 'Reserve', count: 1605, percentage: 1.3, examples: 'Meropenem, Linezolid' },
];
export const reportMetrics = { reused: 342, rejected: 128, realtime: '91,6%', validPrescription: '94,8%', backlog: '8,4%' };
export const complianceReport = [
  { name: 'Klinik Pratama Sejahtera', province: 'Jawa Barat', realtime: 99.2, validation: 98.8, score: 98.9, status: 'Paling patuh' },
  { name: 'Apotek Sehat Sentosa', province: 'Jawa Barat', realtime: 97.5, validation: 96.2, score: 96.8, status: 'Paling patuh' },
  { name: 'RSUD Harapan Mulya', province: 'Jawa Tengah', realtime: 95.8, validation: 94.4, score: 95.1, status: 'Paling patuh' },
  { name: 'Apotek Nusantara', province: 'Banten', realtime: 88.2, validation: 86.4, score: 87.3, status: 'Pengawasan' },
  { name: 'Apotek Bina Sehat', province: 'Jawa Barat', realtime: 84.7, validation: 82.1, score: 83.4, status: 'Pengawasan' },
  { name: 'Apotek Prima Medika', province: 'Jawa Barat', realtime: 81.6, validation: 79.4, score: 80.5, status: 'Pengawasan' },
];
const complianceNames = [
  'Apotek Aceh Sehat', 'Klinik Medika Utara', 'Apotek Minang Jaya', 'RSUD Lancang Kuning',
  'Apotek Kepri Farma', 'Apotek Batanghari', 'Klinik Sriwijaya', 'Apotek Babel Sehat',
  'Apotek Rafflesia', 'Apotek Lampung Medika', 'Apotek Sehat Jakarta', 'Apotek Sehat Sentosa',
  'Klinik Pratama Sejahtera', 'RSUD Harapan Mulya', 'Apotek Prima Medika', 'Apotek Bina Sehat',
  'Apotek Bali Husada', 'Apotek Sasambo', 'Klinik Flobamora', 'Apotek Borneo Sehat',
  'Apotek Etam Farma', 'Apotek Banua Medika', 'Apotek Mahakam', 'Apotek Kaltara Sehat',
  'Apotek Celebes Farma',
];
export const nationalComplianceReport = Array.from({ length: 300 }, (_, index) => {
  const realtime = Number((82.4 + ((index * 13) % 177) / 10).toFixed(1));
  const validation = Number((80.8 + ((index * 17) % 190) / 10).toFixed(1));
  return {
    name: `${complianceNames[index % complianceNames.length]}${index >= complianceNames.length ? ` ${String(index + 1).padStart(3, '0')}` : ''}`,
    province: provinceNames[index % provinceNames.length],
    realtime,
    validation,
    score: Number(((realtime + validation) / 2).toFixed(1)),
    status: realtime > 92 ? 'Paling patuh' : 'Pengawasan',
  };
});

export const atcDddReport = [
  { region: 'Bandung', values: [58, 63, 61, 70, 74, 79] },
  { region: 'Surabaya', values: [64, 67, 72, 76, 82, 88] },
  { region: 'Jakarta', values: [71, 69, 73, 72, 75, 77] },
  { region: 'Medan', values: [52, 58, 61, 65, 69, 73] },
  { region: 'Makassar', values: [44, 48, 53, 55, 59, 62] },
];
export const nationalAtcDddReport = allProvinces.map((province, index) => ({
  region: province.name,
  values: Array.from({ length: 12 }, (_, month) => Number((42 + ((index * 11 + month * (2 + index % 4)) % 61)).toFixed(1))),
}));
export const nationalAtcDddTrend = Array.from({ length: 12 }, (_, month) =>
  Number((nationalAtcDddReport.reduce((total, province) => total + province.values[month], 0) / nationalAtcDddReport.length).toFixed(1)),
);

const seededAnomalies = [
  { pharmacy: 'Apotek Sehat Sentosa', location: 'Kec. Sukarami, Bandung', type: 'Lonjakan Penjualan Irasional', description: 'Penjualan Azithromycin naik 300% dalam 3 hari tanpa resep atau diagnosis yang sesuai.', flag: 'Red Flag' as Flag, created: '23 Sep 2026, 09:14 WIB', score: 92, status: 'Baru Masuk' },
  { pharmacy: 'Apotek Bina Sehat', location: 'Kec. Beji, Depok', type: 'Percobaan Resep Ganda', description: 'Kode QR RX-2026-0901 telah dikunci oleh Apotek Kimia Farma 04.', flag: 'Red Flag' as Flag, created: '23 Sep 2026, 08:42 WIB', score: 88, status: 'Dalam Audit Lapangan' },
  { pharmacy: 'Apotek Prima Medika', location: 'Kec. Cihideung, Tasikmalaya', type: "Dominasi Kategori WHO 'Watch' / 'Reserve'", description: 'Ceftriaxone dan Meropenem terjual tanpa lampiran ICD-10 spesialis.', flag: 'Red Flag' as Flag, created: '22 Sep 2026, 16:20 WIB', score: 86, status: 'Menunggu Klarifikasi' },
  { pharmacy: 'Apotek Kimia Farma 04', location: 'Kec. Bekasi Selatan, Bekasi', type: 'Discrepancy Stok (Off-book sales)', description: 'Stok Cefixime berkurang 86 unit tanpa pencatatan resep terikat.', flag: 'Yellow Flag' as Flag, created: '22 Sep 2026, 14:08 WIB', score: 71, status: 'Baru Masuk' },
  { pharmacy: 'Apotek Nusantara', location: 'Kec. Kesambi, Cirebon', type: 'Discrepancy Stok (Off-book sales)', description: 'Mutasi stok terlambat dilaporkan selama 48 jam.', flag: 'Yellow Flag' as Flag, created: '22 Sep 2026, 11:35 WIB', score: 64, status: 'Menunggu Klarifikasi' },
  { pharmacy: 'Klinik Medika Utama', location: 'Kec. Bogor Tengah, Bogor', type: 'Percobaan Resep Ganda', description: 'Tiga percobaan scan pada QR resep yang sudah ditebus.', flag: 'Yellow Flag' as Flag, created: '21 Sep 2026, 17:48 WIB', score: 62, status: 'Dalam Audit Lapangan' },
  { pharmacy: 'RSUD Harapan Mulya', location: 'Kec. Cikole, Sukabumi', type: 'Lonjakan Penjualan Irasional', description: 'Pengeluaran Cefixime 1,8x di atas baseline mingguan.', flag: 'Yellow Flag' as Flag, created: '21 Sep 2026, 13:02 WIB', score: 59, status: 'Baru Masuk' },
  { pharmacy: 'Apotek Mitra Keluarga', location: 'Kec. Purwakarta, Purwakarta', type: "Dominasi Kategori WHO 'Watch' / 'Reserve'", description: 'Rasio Watch terhadap Access melewati ambang wilayah.', flag: 'Red Flag' as Flag, created: '20 Sep 2026, 10:17 WIB', score: 83, status: 'Menunggu Klarifikasi' },
];
const caseTypes = ['Lonjakan Penjualan Irasional', 'Percobaan Resep Ganda', 'Discrepancy Stok (Off-book sales)', "Dominasi Kategori WHO 'Watch' / 'Reserve'"];
export const anomalyCases = Array.from({ length: 300 }, (_, index) => {
  const seed = seededAnomalies[index];
  if (seed) return { id: `ANM-2026-${String(300 - index).padStart(3, '0')}`, ...seed };
  const pharmacy = pharmacies[index];
  const province = provinceNames[index % provinceNames.length];
  const flag: Flag = pharmacy.flag;
  return {
    id: `ANM-2026-${String(300 - index).padStart(3, '0')}`,
    pharmacy: pharmacy.name,
    location: `${pharmacy.city}, ${province}`,
    type: caseTypes[index % caseTypes.length],
    description: pharmacy.detail,
    flag,
    created: `${String(1 + (index % 28)).padStart(2, '0')} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'][Math.floor(index / 30) % 10]} 2026, ${String(index % 24).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')} WIB`,
    score: 55 + ((index * 17) % 46),
    status: ['Baru Masuk', 'Dalam Audit Lapangan', 'Menunggu Klarifikasi'][index % 3],
  };
});

const auditStart = Date.UTC(2020, 0, 1);
const auditEnd = Date.UTC(2026, 9, 6, 2, 40);
export const auditTrail = Array.from({ length: 300 }, (_, index) => {
  const timestamp = new Date(auditStart + ((auditEnd - auditStart) * index) / 299);
  const date = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta',
  }).format(timestamp);
  return {
    date: `${date} WIB`,
    actor: ['Dinkes Provinsi', 'Sistem TILIK', 'Local Aggregator Hub', 'Auditor Lapangan'][index % 4],
    action: [
      'Memverifikasi catatan penggunaan dan kelengkapan resep antibiotik.',
      'Mencatat hasil sinkronisasi transaksi dan mutasi stok.',
      'Mendeteksi pola penggunaan antibiotik untuk ditinjau petugas.',
      'Memperbarui tindak lanjut dan status pemeriksaan fasilitas.',
    ][index % 4],
  };
});

export const entityRelationship = {
  users: ['id', 'role', 'identity_number', 'facility_id'],
  facilities: ['id', 'name', 'city', 'license_number'],
  prescriptions: ['id', 'qr_code', 'patient_hash', 'diagnosis', 'doctor_id', 'pharmacist_id', 'status', 'dispensed_at'],
  prescription_items: ['id', 'prescription_id', 'medicine_id', 'quantity', 'aware_category', 'atc_code', 'ddd_value'],
  medicines: ['id', 'name', 'atc_code', 'aware_category', 'ddd_standard'],
  stock_movements: ['id', 'facility_id', 'medicine_id', 'movement_type', 'quantity', 'created_at'],
  anomalies: ['id', 'facility_id', 'severity', 'reason', 'status', 'created_at'],
  integration_logs: ['id', 'prescription_id', 'fhir_payload', 'status', 'attempts', 'last_attempt_at'],
};
