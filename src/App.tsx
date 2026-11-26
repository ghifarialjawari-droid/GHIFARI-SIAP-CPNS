import React, { useState, useEffect, useMemo } from 'react';
import {
  Award, BookOpen, Brain, Calendar, ChevronRight, Clock,
  Compass, Download, FileText, LayoutDashboard,
  Menu, Play, Settings, Trophy, X,
  BarChart3, Database, Zap, RotateCcw, Shuffle
} from 'lucide-react';
import { QUESTION_BANK, Question } from './questions';

// --- TYPES ---
interface UserProfile {
  nama: string;
  pendidikan: string;
  jurusan: string;
  universitas: string;
  lokasiMinat: string;
  targetSkor: number;
  targetSoalHarian: number;
}

interface FormasiItem {
  id: string;
  tahun: number;
  instansi: string;
  jenisInstansi: 'Kementerian/Lembaga' | 'Instansi Daerah';
  provinsi: string;
  kabKota: string;
  jabatan: string;
  jenisJabatan: 'Jabatan Fungsional' | 'Jabatan Pelaksana';
  pendidikanMin: string[];
  jurusanList: string[];
  kuota: number;
  pelamarHistoris: number;
  sumberData: 'Data Historis Resmi BKN' | 'Simulasi Proyeksi';
  persyaratan: string[];
}

interface TryoutRecord {
  id: string;
  tanggal: string;
  paket: string;
  twk: number;
  tiu: number;
  tkp: number;
  total: number;
  lulusPG: boolean;
  peringkatSimulasi: number;
  totalPesertaSimulasi: number;
  detailSubMateri: Record<string, { benar: number; total: number }>;
}

interface SelectionConfig {
  tahun: number;
  regulasi: string;
  jumlahTwk: number;
  jumlahTiu: number;
  jumlahTkp: number;
  durasiMenit: number;
  pgTwk: number;
  pgTiu: number;
  pgTkp: number;
  bobotBenarTwkTiu: number;
  jadwalPendaftaran: string;
  jadwalSkd: string;
  gasUrl: string;
  geminiApiKey: string;
}

// --- INITIAL DATA ---
const INITIAL_PROFILE: UserProfile = {
  nama: 'Mochammad Djawari Al Ghifari',
  pendidikan: 'S1 / D-IV',
  jurusan: 'Teknik Mesin',
  universitas: 'Universitas Pendidikan Indonesia',
  lokasiMinat: 'Jawa Barat',
  targetSkor: 435,
  targetSoalHarian: 30
};

const INITIAL_CONFIG: SelectionConfig = {
  tahun: 2026,
  regulasi: 'KepmenPANRB No. 321 Tahun 2024 (Acuan Aktif Multi-Tahun)',
  jumlahTwk: 30,
  jumlahTiu: 35,
  jumlahTkp: 45,
  durasiMenit: 100,
  pgTwk: 65,
  pgTiu: 80,
  pgTkp: 166,
  bobotBenarTwkTiu: 5,
  jadwalPendaftaran: 'Agustus – September 2026 (Proyeksi BKN)',
  jadwalSkd: 'Oktober – November 2026 (Proyeksi BKN)',
  gasUrl: 'https://script.google.com/macros/s/AKfycbxhBU8H4qysXgHbqm4j5Zi1cz9fZPT8Ti2--PUGM299lnIWYJyEkVKQ4nLIv8eIazK6/exec',
  geminiApiKey: ''
};

const INITIAL_FORMASI: FormasiItem[] = [
  {
    id: 'FRM-001',
    tahun: 2026,
    instansi: 'Kementerian Perindustrian',
    jenisInstansi: 'Kementerian/Lembaga',
    provinsi: 'DKI Jakarta / Jawa Barat',
    kabKota: 'Jakarta Selatan / Bandung',
    jabatan: 'Pembina Industri Ahli Pertama',
    jenisJabatan: 'Jabatan Fungsional',
    pendidikanMin: ['S1 / D-IV'],
    jurusanList: ['Teknik Mesin', 'Teknik Industri', 'Teknik Metalurgi', 'Teknik Material'],
    kuota: 18,
    pelamarHistoris: 412,
    sumberData: 'Data Historis Resmi BKN',
    persyaratan: ['IPK minimal 3.00 dari PTN/PTS Terakreditasi', 'TOEFL ITP minimal 450', 'Bersedia ditempatkan di unit kerja Kemenperin'],
  },
  {
    id: 'FRM-002',
    tahun: 2026,
    instansi: 'Kementerian Energi dan Sumber Daya Mineral (ESDM)',
    jenisInstansi: 'Kementerian/Lembaga',
    provinsi: 'Jawa Barat',
    kabKota: 'Bandung',
    jabatan: 'Inspektur Ketenagalistrikan / Perekayasa Ahli Pertama',
    jenisJabatan: 'Jabatan Fungsional',
    pendidikanMin: ['S1 / D-IV'],
    jurusanList: ['Teknik Mesin', 'Teknik Elektro', 'Teknik Fisika'],
    kuota: 12,
    pelamarHistoris: 345,
    sumberData: 'Data Historis Resmi BKN',
    persyaratan: ['IPK minimal 3.00', 'Sehat jasmani dan rohani', 'Tidak buta warna'],
  },
  {
    id: 'FRM-003',
    tahun: 2026,
    instansi: 'Pemerintah Provinsi Jawa Barat',
    jenisInstansi: 'Instansi Daerah',
    provinsi: 'Jawa Barat',
    kabKota: 'Kota Bandung / Tasikmalaya',
    jabatan: 'Pengawas Ketenagakerjaan Ahli Pertama',
    jenisJabatan: 'Jabatan Fungsional',
    pendidikanMin: ['S1 / D-IV'],
    jurusanList: ['Teknik Mesin', 'Teknik Industri', 'Teknik Kimia', 'Keselamatan dan Kesehatan Kerja'],
    kuota: 15,
    pelamarHistoris: 289,
    sumberData: 'Data Historis Resmi BKN',
    persyaratan: ['IPK minimal 2.85', 'KTP/Domisili Nasional', 'Siap ditugaskan di UPTD Pengawasan Ketenagakerjaan Wilayah'],
  },
  {
    id: 'FRM-004',
    tahun: 2026,
    instansi: 'Badan Riset dan Inovasi Nasional (BRIN)',
    jenisInstansi: 'Kementerian/Lembaga',
    provinsi: 'Jawa Barat',
    kabKota: 'Cibinong / Bandung',
    jabatan: 'Perekayasa Ahli Pertama (Manufaktur & Material)',
    jenisJabatan: 'Jabatan Fungsional',
    pendidikanMin: ['S1 / D-IV'],
    jurusanList: ['Teknik Mesin', 'Teknik Material', 'Teknik Aeronautika'],
    kuota: 10,
    pelamarHistoris: 215,
    sumberData: 'Simulasi Proyeksi',
    persyaratan: ['IPK minimal 3.10', 'Memiliki portofolio tugas akhir/riset rekayasa'],
  },
  {
    id: 'FRM-005',
    tahun: 2026,
    instansi: 'Pemerintah Kabupaten Tasikmalaya',
    jenisInstansi: 'Instansi Daerah',
    provinsi: 'Jawa Barat',
    kabKota: 'Kabupaten Tasikmalaya',
    jabatan: 'Penata Kelola Jalan dan Jembatan / Peralatan',
    jenisJabatan: 'Jabatan Pelaksana',
    pendidikanMin: ['S1 / D-IV', 'D-III'],
    jurusanList: ['Teknik Mesin', 'Teknik Sipil', 'Teknik Otomotif'],
    kuota: 6,
    pelamarHistoris: 98,
    sumberData: 'Simulasi Proyeksi',
    persyaratan: ['IPK minimal 2.75', 'Diutamakan menguasai manajemen alat berat & pemeliharaan'],
  },
  {
    id: 'FRM-006',
    tahun: 2026,
    instansi: 'Kementerian Keuangan',
    jenisInstansi: 'Kementerian/Lembaga',
    provinsi: 'DKI Jakarta',
    kabKota: 'Jakarta Pusat',
    jabatan: 'Analis Keuangan Pusat dan Daerah Ahli Pertama',
    jenisJabatan: 'Jabatan Fungsional',
    pendidikanMin: ['S1 / D-IV'],
    jurusanList: ['Akuntansi', 'Manajemen', 'Ilmu Ekonomi'],
    kuota: 40,
    pelamarHistoris: 1840,
    sumberData: 'Data Historis Resmi BKN',
    persyaratan: ['IPK minimal 3.25', 'Kualifikasi khusus rumpun Ekonomi/Akuntansi'],
  }
];

const LEARNING_MODULES = [
  {
    kategori: 'TWK',
    judul: 'Tes Wawasan Kebangsaan (TWK)',
    targetPG: '65 Poin (30 Soal)',
    subTopik: [
      { nama: 'Pancasila', ringkasan: 'Kedudukan Pancasila sebagai dasar negara, pandangan hidup, ideologi terbuka, serta implementasi 45 butir pengamalan sila ke-1 hingga ke-5 dalam studi kasus pelayanan publik.', tips: 'Identifikasi kata kunci perilaku: Ketuhanan (toleransi), Kemanusiaan (empati/HAM), Persatuan (rela berkorban/cinta tanah air), Kerakyatan (musyawarah/mufakat), Keadilan (hak & kewajiban seimbang).' },
      { nama: 'UUD 1945 & Sistem Ketatanegaraan', ringkasan: 'Batang tubuh UUD 1945 pasca-amandemen (I–IV), tugas & wewenang MPR, DPR, DPD, Presiden, BPK, MA, MK, dan KY.', tips: 'Hafalkan pasal kunci: Pasal 1 (Bentuk negara), Pasal 7A-7B (Pemakzulan), Pasal 20 (Legislasi), Pasal 24A-24C (Kekuasaan Kehakiman).' },
      { nama: 'NKRI & Bhinneka Tunggal Ika', ringkasan: 'Wawasan Nusantara, otonomi daerah (UU No. 23/2014), pengelolaan keberagaman suku, agama, ras, dan antargolongan.', tips: 'Fokus pada konsep persatuan dalam keberagaman dan 6 urusan absolut pemerintah pusat vs urusan konkuren daerah.' },
      { nama: 'Nasionalisme, Integritas & Bela Negara', ringkasan: 'Sejarah pergerakan nasional, nilai dasar ASN BerAKHLAK, pencegahan gratifikasi/korupsi (UU Tipikor), serta 5 nilai dasar Bela Negara.', tips: 'Soal TWK modern berbentuk penalaran kasus. Pilih jawaban yang paling mencerminkan kepatuhan regulasi dan kepentingan bangsa.' }
    ]
  },
  {
    kategori: 'TIU',
    judul: 'Tes Intelegensia Umum (TIU)',
    targetPG: '80 Poin (35 Soal)',
    subTopik: [
      { nama: 'Kemampuan Verbal (Analogi, Silogisme, Analitis)', ringkasan: 'Hubungan padanan kata, penarikan kesimpulan logis (Modus Ponens, Tollens, Silogisme), serta pemecahan masalah urutan/posisi.', tips: 'Untuk silogisme, gunakan aturan: Premis partikular (sebagian) selalu menghasilkan kesimpulan partikular.' },
      { nama: 'Kemampuan Numerik (Berhitung, Deret, Perbandingan)', ringkasan: 'Operasi pecahan/desimal cepat, pola deret aritmetika/geometri bertingkat, perbandingan senilai/berbalik nilai, serta soal cerita kuantitatif.', tips: 'Ubah desimal berulang menjadi pecahan istimewa (misal 0,125 = 1/8; 0,375 = 3/8; 0,1667 = 1/6) untuk menghemat 30 detik per soal.' },
      { nama: 'Kemampuan Figural & Spasial', ringkasan: 'Rotasi bangun datar dan ruang 3D (kubus/jaring-jaring), pencerminan (refleksi), penambahan/pengurangan elemen visual.', tips: 'Amati pergerakan satu sisi kunci secara bertahap dan eliminasi opsi yang arah rotasinya berlawanan.' }
    ]
  },
  {
    kategori: 'TKP',
    judul: 'Tes Karakteristik Pribadi (TKP)',
    targetPG: '166 Poin (45 Soal)',
    subTopik: [
      { nama: 'Pelayanan Publik & Profesionalisme', ringkasan: 'Orientasi kepuasan masyarakat sesuai SOP, akuntabilitas kerja, dan ketangguhan menyelesaikan tugas di bawah tekanan.', tips: 'Selalu pilih opsi yang menunjukkan inisiatif membantu pemohon secara ramah NAMUN tetap patuh pada prosedur resmi.' },
      { nama: 'Jejaring Kerja, Sosial Budaya & TIK', ringkasan: 'Kolaborasi lintas unit, adaptasi budaya lokal, serta pemanfaatan teknologi informasi & keamanan siber.', tips: 'Pilih opsi yang membangun sinergi tim, mentransfer ilmu teknologi kepada rekan kerja, dan waspada terhadap ancaman siber.' },
      { nama: 'Anti Radikalisme', ringkasan: 'Deteksi dini paham intoleran/radikal di lingkungan kerja, menjaga netralitas ASN, dan kesetiaan pada konstitusi.', tips: 'Hindari sikap apatis (diam saja) maupun reaktif emosional. Pilih sikap edukatif berbasis aturan kepegawaian.' }
    ]
  }
];

const INITIAL_HISTORY: TryoutRecord[] = [
  {
    id: 'TO-2026-01',
    tanggal: '2026-10-12',
    paket: 'Tryout Nasional Mingguan #1',
    twk: 85,
    tiu: 105,
    tkp: 184,
    total: 374,
    lulusPG: true,
    peringkatSimulasi: 412,
    totalPesertaSimulasi: 5400,
    detailSubMateri: {
      'Pancasila & Pengamalan': { benar: 4, total: 5 },
      'UUD 1945 & Konstitusi': { benar: 3, total: 5 },
      'Penalaran Logis (Silogisme)': { benar: 5, total: 6 },
      'Numerik (Deret & Perbandingan)': { benar: 4, total: 6 },
      'Pelayanan Publik': { benar: 8, total: 9 }
    }
  },
  {
    id: 'TO-2026-02',
    tanggal: '2026-10-28',
    paket: 'Tryout Nasional Bulanan #2',
    twk: 95,
    tiu: 120,
    tkp: 192,
    total: 407,
    lulusPG: true,
    peringkatSimulasi: 198,
    totalPesertaSimulasi: 6150,
    detailSubMateri: {
      'Pancasila & Pengamalan': { benar: 5, total: 5 },
      'UUD 1945 & Konstitusi': { benar: 4, total: 5 },
      'Penalaran Logis (Silogisme)': { benar: 5, total: 6 },
      'Numerik (Deret & Perbandingan)': { benar: 5, total: 6 },
      'Pelayanan Publik': { benar: 9, total: 9 }
    }
  }
];

function pickRandomSubset(pool: Question[], count: number): Question[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persistent States
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gsc_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [config, setConfig] = useState<SelectionConfig>(() => {
    const saved = localStorage.getItem('gsc_config');
    return saved ? { ...INITIAL_CONFIG, ...JSON.parse(saved), gasUrl: JSON.parse(saved).gasUrl || INITIAL_CONFIG.gasUrl } : INITIAL_CONFIG;
  });

  const [formasiList, setFormasiList] = useState<FormasiItem[]>(() => {
    const saved = localStorage.getItem('gsc_formasi');
    return saved ? JSON.parse(saved) : INITIAL_FORMASI;
  });

  const [history, setHistory] = useState<TryoutRecord[]>(() => {
    const saved = localStorage.getItem('gsc_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [studyLogs, setStudyLogs] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('gsc_study_logs');
    return saved ? JSON.parse(saved) : {
      '2026-11-20': 35,
      '2026-11-21': 30,
      '2026-11-22': 40,
      '2026-11-23': 25,
      '2026-11-24': 32,
      '2026-11-25': 30,
      '2026-11-26': 15
    };
  });

  // Track answered question IDs so user never repeats solved questions unless reset
  const [solvedIds, setSolvedIds] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('gsc_solved_ids');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => { localStorage.setItem('gsc_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('gsc_config', JSON.stringify(config)); }, [config]);
  useEffect(() => { localStorage.setItem('gsc_formasi', JSON.stringify(formasiList)); }, [formasiList]);
  useEffect(() => { localStorage.setItem('gsc_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('gsc_study_logs', JSON.stringify(studyLogs)); }, [studyLogs]);
  useEffect(() => { localStorage.setItem('gsc_solved_ids', JSON.stringify(solvedIds)); }, [solvedIds]);

  // --- QUICK PRACTICE (LATIHAN CEPAT TWK / TIU / TKP) ---
  const [quickCat, setQuickCat] = useState<'TWK' | 'TIU' | 'TKP'>('TWK');
  const [quickSubFilter, setQuickSubFilter] = useState<string>('Semua');
  const [quickIdx, setQuickIdx] = useState<number>(0);
  const [quickSelectedOpt, setQuickSelectedOpt] = useState<number | null>(null);
  const [jumpNumber, setJumpNumber] = useState<string>('1');
  const [quickStats, setQuickStats] = useState<{ dijawab: number; skorTotal: number; benar: number }>({
    dijawab: 0,
    skorTotal: 0,
    benar: 0
  });

  const quickQuestions = useMemo(() => {
    return QUESTION_BANK.filter((q) => {
      if (q.kategori !== quickCat) return false;
      if (quickSubFilter !== 'Semua' && q.subMateri !== quickSubFilter) return false;
      return true;
    });
  }, [quickCat, quickSubFilter]);

  const quickSubTopics = useMemo(() => {
    const subs = new Set(QUESTION_BANK.filter((q) => q.kategori === quickCat).map((q) => q.subMateri));
    return ['Semua', ...Array.from(subs)];
  }, [quickCat]);

  const countByCat = useMemo(() => {
    const twk = QUESTION_BANK.filter((q) => q.kategori === 'TWK');
    const tiu = QUESTION_BANK.filter((q) => q.kategori === 'TIU');
    const tkp = QUESTION_BANK.filter((q) => q.kategori === 'TKP');
    return {
      twkTotal: twk.length,
      tiuTotal: tiu.length,
      tkpTotal: tkp.length,
      twkSolved: twk.filter((q) => solvedIds[q.id] !== undefined).length,
      tiuSolved: tiu.filter((q) => solvedIds[q.id] !== undefined).length,
      tkpSolved: tkp.filter((q) => solvedIds[q.id] !== undefined).length
    };
  }, [solvedIds]);

  const startQuickDrill = (cat: 'TWK' | 'TIU' | 'TKP') => {
    setQuickCat(cat);
    setQuickSubFilter('Semua');
    const pool = QUESTION_BANK.filter((q) => q.kategori === cat);
    const firstUnsolved = pool.findIndex((q) => solvedIds[q.id] === undefined);
    setQuickIdx(firstUnsolved >= 0 ? firstUnsolved : 0);
    setQuickSelectedOpt(null);
    setActiveTab('latihan');
  };

  const handleQuickAnswer = (optIdx: number) => {
    if (quickSelectedOpt !== null) return;
    setQuickSelectedOpt(optIdx);
    const currentQ = quickQuestions[quickIdx];
    if (!currentQ) return;
    const earned = currentQ.opsi[optIdx].skor;
    setSolvedIds((prev) => ({ ...prev, [currentQ.id]: earned }));
    setQuickStats((prev) => ({
      dijawab: prev.dijawab + 1,
      skorTotal: prev.skorTotal + earned,
      benar: prev.benar + (earned === 5 ? 1 : 0)
    }));
    const today = new Date().toISOString().split('T')[0];
    setStudyLogs((prev) => ({ ...prev, [today]: (prev[today] || 0) + 1 }));
  };

  const nextQuickQuestion = () => {
    setQuickSelectedOpt(null);
    setQuickIdx((prev) => (prev + 1) % quickQuestions.length);
  };

  const pickRandomUnsolved = () => {
    if (quickQuestions.length === 0) return;
    const unsolvedIndices = quickQuestions
      .map((q, idx) => (solvedIds[q.id] === undefined ? idx : -1))
      .filter((idx) => idx !== -1);
    const targetPool = unsolvedIndices.length > 0 ? unsolvedIndices : quickQuestions.map((_, i) => i);
    const randomIdx = targetPool[Math.floor(Math.random() * targetPool.length)];
    setQuickSelectedOpt(null);
    setQuickIdx(randomIdx);
  };

  // --- MODULE 11: FORMASI FILTER STATE ---
  const [filterJenisInstansi, setFilterJenisInstansi] = useState<string>('Semua');
  const [filterProvinsi, setFilterProvinsi] = useState<string>('');
  const [filterJenisJabatan, setFilterJenisJabatan] = useState<string>('Semua');
  const [hanyaSesuaiJurusan, setHanyaSesuaiJurusan] = useState<boolean>(false);

  const evaluatedFormasi = useMemo(() => {
    return formasiList
      .map((item) => {
        const cocokPendidikan = item.pendidikanMin.includes(profile.pendidikan);
        const cocokJurusan = item.jurusanList.some(
          (j) => j.toLowerCase().trim() === profile.jurusan.toLowerCase().trim()
        );
        const cocokLokasi = profile.lokasiMinat
          ? item.provinsi.toLowerCase().includes(profile.lokasiMinat.toLowerCase()) ||
            item.kabKota.toLowerCase().includes(profile.lokasiMinat.toLowerCase())
          : true;
        const memenuhi = cocokPendidikan && cocokJurusan;
        const skorPrioritas = (memenuhi ? 100 : 0) + (cocokLokasi ? 30 : 0);
        return { ...item, memenuhi, cocokLokasi, skorPrioritas };
      })
      .filter((item) => {
        if (filterJenisInstansi !== 'Semua' && item.jenisInstansi !== filterJenisInstansi) return false;
        if (filterJenisJabatan !== 'Semua' && item.jenisJabatan !== filterJenisJabatan) return false;
        if (filterProvinsi && !(`${item.provinsi} ${item.kabKota}`).toLowerCase().includes(filterProvinsi.toLowerCase())) return false;
        if (hanyaSesuaiJurusan && !item.memenuhi) return false;
        return true;
      })
      .sort((a, b) => b.skorPrioritas - a.skorPrioritas);
  }, [formasiList, profile, filterJenisInstansi, filterProvinsi, filterJenisJabatan, hanyaSesuaiJurusan]);

  // --- MODULE 12: COMPETITION SIMULATOR STATE ---
  const [selectedFormasiId, setSelectedFormasiId] = useState<string>(INITIAL_FORMASI[0].id);
  const [customKuota, setCustomKuota] = useState<number>(18);
  const [customPelamar, setCustomPelamar] = useState<number>(412);
  const [simulasiSkorUser, setSimulasiSkorUser] = useState<number>(407);
  const [kenaikanSkor, setKenaikanSkor] = useState<number>(15);

  const activeFormasiSim = useMemo(
    () => formasiList.find((f) => f.id === selectedFormasiId) || formasiList[0],
    [formasiList, selectedFormasiId]
  );

  useEffect(() => {
    if (activeFormasiSim) {
      setCustomKuota(activeFormasiSim.kuota);
      setCustomPelamar(activeFormasiSim.pelamarHistoris);
    }
  }, [activeFormasiSim]);

  useEffect(() => {
    if (history.length > 0) {
      setSimulasiSkorUser(history[history.length - 1].total);
    }
  }, [history]);

  const simulationResult = useMemo(() => {
    const kuotaSkd = customKuota * 3;
    const rasioKeketatan = customKuota > 0 ? (customPelamar / customKuota).toFixed(1) : '0';
    const zBase = (simulasiSkorUser - 355) / 42;
    const percentileBase = 1 / (1 + Math.exp(-1.7 * zBase));
    const estRankBase = Math.max(1, Math.round((1 - percentileBase) * customPelamar) + 1);

    const skorBoosted = simulasiSkorUser + kenaikanSkor;
    const zBoost = (skorBoosted - 355) / 42;
    const percentileBoost = 1 / (1 + Math.exp(-1.7 * zBoost));
    const estRankBoost = Math.max(1, Math.round((1 - percentileBoost) * customPelamar) + 1);

    const lolosSkdBase = estRankBase <= kuotaSkd;
    const lolosSkdBoost = estRankBoost <= kuotaSkd;
    return { kuotaSkd, rasioKeketatan, estRankBase, estRankBoost, skorBoosted, lolosSkdBase, lolosSkdBoost };
  }, [customKuota, customPelamar, simulasiSkorUser, kenaikanSkor]);

  // --- MODULE 13: TRYOUT CAT ENGINE (ACAK DARI 1.200 SOAL) ---
  const [tryoutMode, setTryoutMode] = useState<'lobby' | 'exam' | 'review'>('lobby');
  const [selectedPaket, setSelectedPaket] = useState<'Mini 30' | 'Standar 60' | 'Full CAT 110'>('Full CAT 110');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(6000);
  const [lastResult, setLastResult] = useState<TryoutRecord | null>(null);

  useEffect(() => {
    if (tryoutMode !== 'exam') return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTryout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [tryoutMode]);

  const startTryout = (paket: 'Mini 30' | 'Standar 60' | 'Full CAT 110') => {
    const twkPool = QUESTION_BANK.filter((q) => q.kategori === 'TWK');
    const tiuPool = QUESTION_BANK.filter((q) => q.kategori === 'TIU');
    const tkpPool = QUESTION_BANK.filter((q) => q.kategori === 'TKP');

    let qs: Question[] = [];
    let durasiDetik = 6000;
    if (paket === 'Mini 30') {
      qs = [...pickRandomSubset(twkPool, 8), ...pickRandomSubset(tiuPool, 10), ...pickRandomSubset(tkpPool, 12)];
      durasiDetik = 27 * 60;
    } else if (paket === 'Standar 60') {
      qs = [...pickRandomSubset(twkPool, 16), ...pickRandomSubset(tiuPool, 20), ...pickRandomSubset(tkpPool, 24)];
      durasiDetik = 55 * 60;
    } else {
      qs = [...pickRandomSubset(twkPool, 30), ...pickRandomSubset(tiuPool, 35), ...pickRandomSubset(tkpPool, 45)];
      durasiDetik = config.durasiMenit * 60;
    }

    setSelectedPaket(paket);
    setExamQuestions(qs);
    setCurrentIdx(0);
    setAnswers({});
    setFlagged({});
    setSecondsLeft(durasiDetik);
    setTryoutMode('exam');
  };

  const finishTryout = () => {
    let twk = 0, tiu = 0, tkp = 0;
    const detailSubMateri: Record<string, { benar: number; total: number }> = {};

    examQuestions.forEach((q) => {
      const chosenIdx = answers[q.id];
      const skor = chosenIdx !== undefined ? q.opsi[chosenIdx].skor : 0;
      if (q.kategori === 'TWK') twk += skor;
      if (q.kategori === 'TIU') tiu += skor;
      if (q.kategori === 'TKP') tkp += skor;

      if (!detailSubMateri[q.subMateri]) detailSubMateri[q.subMateri] = { benar: 0, total: 0 };
      detailSubMateri[q.subMateri].total += 1;
      if (skor === 5) detailSubMateri[q.subMateri].benar += 1;
    });

    const countTwk = examQuestions.filter((q) => q.kategori === 'TWK').length || 1;
    const countTiu = examQuestions.filter((q) => q.kategori === 'TIU').length || 1;
    const countTkp = examQuestions.filter((q) => q.kategori === 'TKP').length || 1;

    const scaledTwk = Math.round((twk / (countTwk * 5)) * (config.jumlahTwk * 5));
    const scaledTiu = Math.round((tiu / (countTiu * 5)) * (config.jumlahTiu * 5));
    const scaledTkp = Math.round((tkp / (countTkp * 5)) * (config.jumlahTkp * 5));
    const total = scaledTwk + scaledTiu + scaledTkp;

    const lulusPG = scaledTwk >= config.pgTwk && scaledTiu >= config.pgTiu && scaledTkp >= config.pgTkp;
    const totalPeserta = 6420;
    const estRank = Math.max(1, Math.round(((550 - total) / 550) * totalPeserta));

    const record: TryoutRecord = {
      id: `TO-${Date.now().toString().slice(-6)}`,
      tanggal: new Date().toISOString().split('T')[0],
      paket: `Tryout CAT Acak (${selectedPaket})`,
      twk: scaledTwk,
      tiu: scaledTiu,
      tkp: scaledTkp,
      total,
      lulusPG,
      peringkatSimulasi: estRank,
      totalPesertaSimulasi: totalPeserta,
      detailSubMateri
    };

    setHistory((prev) => [...prev, record]);
    setLastResult(record);
    const today = new Date().toISOString().split('T')[0];
    setStudyLogs((prev) => ({ ...prev, [today]: (prev[today] || 0) + examQuestions.length }));
    setTryoutMode('review');
  };

  // --- MODULE 14: AI TUTOR CPNS ---
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: `Halo ${profile.nama}! Saya AI Tutor Ghifari Siap CPNS. Sekarang bank soal sudah berisi 1.200 soal unik (400 TWK, 400 TIU, 400 TKP). Tanyakan pembahasan materi, trik cepat TIU, atau jadwal latihan sesuai target skor ${profile.targetSkor}.`
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskAi = async (customPrompt?: string) => {
    const promptText = customPrompt || aiInput;
    if (!promptText.trim()) return;
    setAiMessages((prev) => [...prev, { role: 'user', text: promptText }]);
    setAiInput('');
    setAiLoading(true);

    const latestScore = history[history.length - 1];
    const systemContext = `Anda adalah AI Tutor CPNS profesional pada aplikasi "Ghifari Siap CPNS". Peserta bernama ${profile.nama}, lulusan ${profile.pendidikan} ${profile.jurusan}, target skor ${profile.targetSkor}. Skor tryout terakhir: TWK ${latestScore?.twk || 0}, TIU ${latestScore?.tiu || 0}, TKP ${latestScore?.tkp || 0}. Aturan wajib: Jawab akurat berdasarkan UUD 1945, UU ASN No. 20/2023, dan KepmenPANRB No. 321/2024.`;

    try {
      if (config.geminiApiKey) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${systemContext}\n\nPertanyaan peserta: ${promptText}` }] }]
            })
          }
        );
        const data = await res.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, respons AI tidak tersedia.';
        setAiMessages((prev) => [...prev, { role: 'ai', text: reply }]);
      } else {
        await new Promise((r) => setTimeout(r, 350));
        let reply = '';
        const low = promptText.toLowerCase();
        if (low.includes('analisis') || low.includes('kelemahan')) {
          reply = `**Analisis Kelemahan Berbasis Skor Terakhir (${latestScore?.total || 0}):**\n• **TWK (${latestScore?.twk || 0}/${config.pgTwk}):** Perbanyak latihan pada studi kasus Pasal UUD 1945, Otonomi Daerah & EYD Edisi V.\n• **TIU (${latestScore?.tiu || 0}/${config.pgTiu}):** Latih kecepatan Deret Tingkat 2, Pecahan Istimewa, dan Waktu Berpapasan.\n• **TKP (${latestScore?.tkp || 0}/${config.pgTkp}):** Fokus membedakan opsi poin 4 dan 5 pada aspek Anti-Radikalisme dan Pelayanan Publik berbasis SOP.`;
        } else if (low.includes('trik') || low.includes('tiu')) {
          reply = `**Trik Cepat TIU (Metode Eliminasi & Pecahan Istimewa):**\n1. **Deret Angka:** Cek selisih 1 tingkat dulu. Jika tidak konstan, cek selisih 2 tingkat atau pola lompat 1 suku.\n2. **Silogisme:** Jika salah satu premis memuat kata *"Sebagian/Beberapa"*, kesimpulan WAJIB memuat *"Sebagian/Beberapa"*.\n3. **Pecahan:** Hafalkan 1/8 = 12,5%, 3/8 = 37,5%, 5/8 = 62,5%, 1/6 = 16,67%.`;
        } else if (low.includes('jadwal')) {
          reply = `**Rekomendasi Jadwal Latihan (Target ${profile.targetSoalHarian} Soal/Hari dari 1.200 Bank Soal):**\n• **Senin & Kamis:** 30 soal Latihan TWK.\n• **Selasa & Jumat:** 30 soal Latihan TIU.\n• **Rabu & Sabtu:** 30 soal Latihan TKP.\n• **Minggu:** Tryout CAT Full 110 Soal Acak.`;
        } else {
          reply = `Berdasarkan regulasi **${config.regulasi}**, seleksi SKD terdiri dari **TWK (${config.jumlahTwk} soal, PG ${config.pgTwk})**, **TIU (${config.jumlahTiu} soal, PG ${config.pgTiu})**, dan **TKP (${config.jumlahTkp} soal, PG ${config.pgTkp})** dalam waktu **${config.durasiMenit} menit**. Anda sudah menyelesaikan **${Object.keys(solvedIds).length} dari ${QUESTION_BANK.length} soal** di bank soal latihan.`;
        }
        setAiMessages((prev) => [...prev, { role: 'ai', text: reply }]);
      }
    } catch {
      setAiMessages((prev) => [...prev, { role: 'ai', text: 'Terjadi kendala koneksi saat menghubungi layanan AI.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  // --- MODULE 16: READINESS ANALYTICS ---
  const readiness = useMemo(() => {
    if (history.length === 0) {
      return {
        avgTwk: 0, avgTiu: 0, avgTkp: 0, avgTotal: 0,
        pgRate: 0, status: 'Belum siap',
        strongest: '-', weakest: '-', prediksiSkor: 350
      };
    }
    const avgTwk = Math.round(history.reduce((s, h) => s + h.twk, 0) / history.length);
    const avgTiu = Math.round(history.reduce((s, h) => s + h.tiu, 0) / history.length);
    const avgTkp = Math.round(history.reduce((s, h) => s + h.tkp, 0) / history.length);
    const avgTotal = avgTwk + avgTiu + avgTkp;
    const lulusCount = history.filter((h) => h.lulusPG).length;
    const pgRate = Math.round((lulusCount / history.length) * 100);

    const ratios = [
      { name: 'TWK (Wawasan Kebangsaan)', ratio: avgTwk / (config.jumlahTwk * 5) },
      { name: 'TIU (Intelegensia Umum)', ratio: avgTiu / (config.jumlahTiu * 5) },
      { name: 'TKP (Karakteristik Pribadi)', ratio: avgTkp / (config.jumlahTkp * 5) }
    ].sort((a, b) => b.ratio - a.ratio);

    let status = 'Belum siap';
    if (avgTotal >= 410 && pgRate === 100) {
      status = 'Siap mengikuti simulasi seleksi';
    } else if (avgTotal >= 370 && pgRate >= 50) {
      status = 'Hampir siap';
    } else if (avgTotal >= 320) {
      status = 'Perlu peningkatan';
    }

    const trend = history.length >= 2 ? history[history.length - 1].total - history[0].total : 10;
    const prediksiSkor = Math.min(550, Math.round(avgTotal + Math.max(5, trend * 0.4)));

    return {
      avgTwk, avgTiu, avgTkp, avgTotal, pgRate,
      status,
      strongest: ratios[0].name,
      weakest: ratios[ratios.length - 1].name,
      prediksiSkor
    };
  }, [history, config]);

  // --- MODULE 17: STREAK & STUDY LOGS ---
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySolved = studyLogs[todayStr] || 0;
  const streakDays = useMemo(() => {
    const dates = Object.keys(studyLogs).filter((d) => studyLogs[d] > 0).sort().reverse();
    return dates.length;
  }, [studyLogs]);

  const logExtraPractice = (count: number) => {
    setStudyLogs((prev) => ({ ...prev, [todayStr]: (prev[todayStr] || 0) + count }));
  };

  // --- MODULE 19: ADMIN ADD FORMASI & SYNC GAS ---
  const [newFormasi, setNewFormasi] = useState({
    instansi: '',
    jenisInstansi: 'Kementerian/Lembaga' as 'Kementerian/Lembaga' | 'Instansi Daerah',
    provinsi: 'Jawa Barat',
    kabKota: '',
    jabatan: '',
    jurusan: 'Teknik Mesin',
    kuota: 5,
    pelamarHistoris: 100
  });
  const [syncStatus, setSyncStatus] = useState<string>('');

  const handleAddFormasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormasi.instansi || !newFormasi.jabatan) return;
    const item: FormasiItem = {
      id: `FRM-${Date.now().toString().slice(-4)}`,
      tahun: config.tahun,
      instansi: newFormasi.instansi,
      jenisInstansi: newFormasi.jenisInstansi,
      provinsi: newFormasi.provinsi,
      kabKota: newFormasi.kabKota || newFormasi.provinsi,
      jabatan: newFormasi.jabatan,
      jenisJabatan: 'Jabatan Fungsional',
      pendidikanMin: ['S1 / D-IV'],
      jurusanList: newFormasi.jurusan.split(',').map((s) => s.trim()),
      kuota: Number(newFormasi.kuota),
      pelamarHistoris: Number(newFormasi.pelamarHistoris),
      sumberData: 'Simulasi Proyeksi',
      persyaratan: ['IPK minimal 3.00', 'Kualifikasi pendidikan sesuai pengumuman instansi']
    };
    setFormasiList((prev) => [item, ...prev]);
    setNewFormasi({ ...newFormasi, instansi: '', jabatan: '', kabKota: '' });
  };

  const syncToGoogleSheets = async () => {
    if (!config.gasUrl) {
      setSyncStatus('Masukkan URL Web App Google Apps Script terlebih dahulu.');
      return;
    }
    setSyncStatus('Menyinkronkan data ke Google Sheets...');
    try {
      await fetch(config.gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SYNC_ALL',
          profile,
          config,
          history,
          formasiList
        })
      });
      setSyncStatus('Berhasil mengirim data ke Google Apps Script!');
    } catch {
      setSyncStatus('Gagal menyinkronkan. Pastikan URL Web App aktif.');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Beranda & Pilih Subtes', icon: LayoutDashboard },
    { id: 'latihan', label: 'Latihan 1.200 Soal', icon: Zap },
    { id: 'tryout', label: 'Tryout Nasional CAT', icon: Award },
    { id: 'formasi', label: 'Rekomendasi Formasi', icon: Compass },
    { id: 'simulasi', label: 'Simulasi Peringkat', icon: BarChart3 },
    { id: 'tutor', label: 'AI Tutor CPNS', icon: Brain },
    { id: 'materi', label: 'Materi Pembelajaran', icon: BookOpen },
    { id: 'target', label: 'Target & Kalender', icon: Calendar },
    { id: 'laporan', label: 'Laporan & Sertifikat PDF', icon: FileText },
    { id: 'pengaturan', label: 'Pengaturan & Sinkronisasi', icon: Settings }
  ];

  const latestReport = history[history.length - 1] || INITIAL_HISTORY[0];
  const currentQuickQ = quickQuestions[quickIdx];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* MOBILE HEADER */}
      <header className="lg:hidden no-print bg-gradient-to-r from-cyan-600 to-sky-700 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">G</div>
          <div>
            <h1 className="font-bold text-base leading-tight">Ghifari Siap CPNS</h1>
            <p className="text-[11px] text-cyan-100">{QUESTION_BANK.length.toLocaleString('id-ID')} Soal Bervariasi • SKD {config.tahun}</p>
          </div>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-white/10">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`no-print lg:w-72 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between ${mobileMenuOpen ? 'fixed inset-0 top-14 z-30 overflow-y-auto' : 'hidden lg:flex'}`}>
        <div>
          <div className="hidden lg:flex items-center gap-3 p-6 border-b border-slate-100 bg-gradient-to-br from-cyan-600 to-sky-700 text-white">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center font-extrabold text-xl shadow-inner">
              G
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight leading-tight">Ghifari Siap CPNS</h1>
              <span className="inline-block mt-0.5 text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-medium">
                {QUESTION_BANK.length.toLocaleString('id-ID')} Soal • {config.tahun}
              </span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 m-3 rounded-2xl bg-sky-50 border border-sky-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-sky-900">
            <span>Progres Bank Soal</span>
            <span>{Object.keys(solvedIds).length}/{QUESTION_BANK.length}</span>
          </div>
          <div className="w-full h-2 bg-sky-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-sky-600 transition-all"
              style={{ width: `${Math.min(100, Math.round((Object.keys(solvedIds).length / QUESTION_BANK.length) * 100))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Hari ini: <strong>{todaySolved}/{profile.targetSoalHarian}</strong> • Streak: <strong className="text-orange-600">{streakDays} hr</strong>
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* TAB 1: DASHBOARD SIMPLE & PILIH LATIHAN TWK / TIU / TKP */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* HERO BANNER */}
            <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
              <div>
                <span className="text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full font-semibold">
                  Bank Soal Bervariasi • {QUESTION_BANK.length.toLocaleString('id-ID')} Soal Unik
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold mt-2">Halo, {profile.nama}!</h2>
                <p className="text-sky-100 text-sm mt-1">
                  Tinggal pilih subtes TWK, TIU, atau TKP di bawah ini untuk langsung berlatih soal yang berbeda setiap nomor.
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[240px]">
                <p className="text-xs text-sky-100">Soal Selesai Dikerjakan</p>
                <p className="text-2xl font-extrabold mt-0.5">
                  {Object.keys(solvedIds).length} <span className="text-sm font-normal text-sky-100">/ {QUESTION_BANK.length} Soal</span>
                </p>
                <p className="text-[11px] text-sky-100 mt-1">Status SKD: <strong>{readiness.status}</strong></p>
              </div>
            </div>

            {/* SIMPLE QUICK-START CARDS: PILIH TWK, TIU, ATAU TKP */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Pilih Kategori Latihan (1.200 Soal Unik)</h3>
                  <p className="text-xs text-slate-500">Sistem otomatis melanjutkan dari nomor soal yang belum pernah Anda kerjakan.</p>
                </div>
                <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
                  400 TWK • 400 TIU • 400 TKP
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* KARTU TWK */}
                <button
                  onClick={() => startQuickDrill('TWK')}
                  className="group text-left p-6 rounded-2xl border-2 border-sky-100 bg-gradient-to-br from-sky-50 to-white hover:border-sky-500 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-sky-600 text-white text-xs font-extrabold">TWK</span>
                      <span className="text-xs font-semibold text-sky-700">PG: {config.pgTwk} Poin</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-900 mt-3 group-hover:text-sky-700">
                      Tes Wawasan Kebangsaan
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      80 Pancasila, 80 UUD 1945, 80 Integritas & BerAKHLAK, 80 NKRI & Bela Negara, 80 Bahasa Indonesia EYD V.
                    </p>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-sky-100">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-700">
                      <span>Selesai: {countByCat.twkSolved} / {countByCat.twkTotal} Soal</span>
                      <span className="flex items-center gap-1">Latih TWK <ChevronRight size={16} /></span>
                    </div>
                    <div className="w-full h-1.5 bg-sky-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-600" style={{ width: `${Math.round((countByCat.twkSolved / countByCat.twkTotal) * 100)}%` }} />
                    </div>
                  </div>
                </button>

                {/* KARTU TIU */}
                <button
                  onClick={() => startQuickDrill('TIU')}
                  className="group text-left p-6 rounded-2xl border-2 border-cyan-100 bg-gradient-to-br from-cyan-50 to-white hover:border-cyan-500 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-cyan-600 text-white text-xs font-extrabold">TIU</span>
                      <span className="text-xs font-semibold text-cyan-700">PG: {config.pgTiu} Poin</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-900 mt-3 group-hover:text-cyan-700">
                      Tes Intelegensia Umum
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      50 Analogi, 50 Silogisme, 80 Deret Angka, 60 Pecahan Cepat, 60 Perbandingan Mesin, 50 Jarak/Waktu, 50 Analitis & Spasial.
                    </p>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-cyan-100">
                    <div className="flex items-center justify-between text-xs font-bold text-cyan-700">
                      <span>Selesai: {countByCat.tiuSolved} / {countByCat.tiuTotal} Soal</span>
                      <span className="flex items-center gap-1">Latih TIU <ChevronRight size={16} /></span>
                    </div>
                    <div className="w-full h-1.5 bg-cyan-100 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-600" style={{ width: `${Math.round((countByCat.tiuSolved / countByCat.tiuTotal) * 100)}%` }} />
                    </div>
                  </div>
                </button>

                {/* KARTU TKP */}
                <button
                  onClick={() => startQuickDrill('TKP')}
                  className="group text-left p-6 rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-xs font-extrabold">TKP</span>
                      <span className="text-xs font-semibold text-indigo-700">PG: {config.pgTkp} Poin</span>
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-900 mt-3 group-hover:text-indigo-700">
                      Tes Karakteristik Pribadi
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      400 Studi Kasus Pelayanan Publik, Jejaring Kerja, Sosial Budaya, TIK & Keamanan Siber, Profesionalisme, Anti Radikalisme.
                    </p>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-indigo-100">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-700">
                      <span>Selesai: {countByCat.tkpSolved} / {countByCat.tkpTotal} Soal</span>
                      <span className="flex items-center gap-1">Latih TKP <ChevronRight size={16} /></span>
                    </div>
                    <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600" style={{ width: `${Math.round((countByCat.tkpSolved / countByCat.tkpTotal) * 100)}%` }} />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* RINGKASAN STATISTIK SINGKAT */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Rata-rata Total SKD</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{readiness.avgTotal}</p>
                <p className="text-[11px] text-sky-600 mt-1">Prediksi: {readiness.prediksiSkor} poin</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Kelulusan Passing Grade</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">{readiness.pgRate}%</p>
                <p className="text-[11px] text-slate-400 mt-1">Dari {history.length}x Tryout CAT</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Formasi Cocok Jurusan</p>
                <p className="text-2xl font-extrabold text-cyan-600 mt-1">
                  {evaluatedFormasi.filter((f) => f.memenuhi).length} Formasi
                </p>
                <p className="text-[11px] text-slate-400 mt-1">{profile.jurusan}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500">Progres Belajar Hari Ini</p>
                <p className="text-2xl font-extrabold text-orange-500 mt-1">{todaySolved} / {profile.targetSoalHarian}</p>
                <p className="text-[11px] text-slate-400 mt-1">Streak: {streakDays} hari aktif</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LATIHAN CEPAT INTERAKTIF (1.200 SOAL TWK / TIU / TKP) */}
        {activeTab === 'latihan' && (
          <div className="space-y-5">
            {/* TOP SWITCHER PILIH KATEGORI */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {(['TWK', 'TIU', 'TKP'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setQuickCat(cat);
                      setQuickSubFilter('Semua');
                      setQuickIdx(0);
                      setQuickSelectedOpt(null);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all ${
                      quickCat === cat
                        ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat} ({cat === 'TWK' ? countByCat.twkTotal : cat === 'TIU' ? countByCat.tiuTotal : countByCat.tkpTotal})
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={pickRandomUnsolved}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold hover:bg-amber-100 flex items-center gap-1.5"
                >
                  <Shuffle size={14} /> Acak Soal Baru
                </button>
                <span className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold">
                  Sesi: {quickStats.dijawab} Soal • {quickStats.skorTotal} Poin
                </span>
                <button
                  onClick={() => setQuickStats({ dijawab: 0, skorTotal: 0, benar: 0 })}
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800"
                  title="Reset Skor Sesi"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            {/* FILTER SUB-MATERI */}
            <div className="flex flex-wrap gap-2">
              {quickSubTopics.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    setQuickSubFilter(sub);
                    setQuickIdx(0);
                    setQuickSelectedOpt(null);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    quickSubFilter === sub
                      ? 'bg-sky-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* KARTU SOAL INTERAKTIF */}
            {currentQuickQ ? (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs font-extrabold">
                      {currentQuickQ.id} • {currentQuickQ.subMateri}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                      {currentQuickQ.tingkat}
                    </span>
                    {solvedIds[currentQuickQ.id] !== undefined && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                        ✓ Pernah Dikerjakan (+{solvedIds[currentQuickQ.id]})
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    Soal {quickIdx + 1} dari {quickQuestions.length}
                  </span>
                </div>

                <p className="text-base md:text-lg text-slate-900 font-medium leading-relaxed">
                  {currentQuickQ.soal}
                </p>

                <div className="space-y-3">
                  {currentQuickQ.opsi.map((opt, idx) => {
                    const isPicked = quickSelectedOpt === idx;
                    const isAnswered = quickSelectedOpt !== null;
                    const isBest = opt.skor === 5;

                    let cardStyle = 'border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-slate-800';
                    if (isAnswered) {
                      if (isBest) {
                        cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                      } else if (isPicked) {
                        cardStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                      } else {
                        cardStyle = 'border-slate-200 opacity-70 text-slate-600';
                      }
                    }

                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleQuickAnswer(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-2xl border-2 text-sm flex items-start justify-between gap-3 transition-all ${cardStyle}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                            isAnswered && isBest
                              ? 'bg-emerald-600 text-white'
                              : isPicked
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {opt.label}
                          </span>
                          <span className="pt-0.5">{opt.text}</span>
                        </div>
                        {isAnswered && (
                          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${
                            opt.skor === 5 ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                          }`}>
                            +{opt.skor} Poin
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* PEMBAHASAN LANGSUNG SETELAH MENJAWAB */}
                {quickSelectedOpt !== null && (
                  <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-sky-800">
                      Pembahasan & Kunci Jawaban
                    </p>
                    <p className="text-sm text-slate-800 leading-relaxed">{currentQuickQ.pembahasan}</p>
                    <p className="text-xs font-semibold text-sky-700 pt-1">
                      Referensi: {currentQuickQ.referensi}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-semibold">Lompat ke nomor (1–{quickQuestions.length}):</span>
                    <input
                      type="number"
                      min={1}
                      max={quickQuestions.length}
                      value={jumpNumber}
                      onChange={(e) => setJumpNumber(e.target.value)}
                      className="w-20 rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs font-bold"
                    />
                    <button
                      onClick={() => {
                        const target = Math.max(1, Math.min(quickQuestions.length, Number(jumpNumber) || 1)) - 1;
                        setQuickIdx(target);
                        setQuickSelectedOpt(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                    >
                      Buka
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={quickIdx === 0}
                      onClick={() => {
                        setQuickIdx((prev) => Math.max(0, prev - 1));
                        setQuickSelectedOpt(null);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 disabled:opacity-40"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={nextQuickQuestion}
                      className="px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 flex items-center gap-1.5"
                    >
                      Soal Berikutnya <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
                Tidak ada soal pada filter sub-materi ini.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRYOUT NASIONAL CAT (ACAK DARI 1.200 SOAL) */}
        {activeTab === 'tryout' && (
          <div className="space-y-6">
            {tryoutMode === 'lobby' && (
              <>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h2 className="text-xl font-extrabold text-slate-900">Tryout Nasional CAT BKN (Soal Acak dari 1.200 Bank Soal)</h2>
                  <p className="text-xs text-slate-500">
                    Setiap sesi tryout mengambil kombinasi soal berbeda secara acak dengan proporsi TWK, TIU, dan TKP sesuai standar BKN.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {([
                      { id: 'Mini 30' as const, title: 'Sprint CAT 30 Soal', desc: '8 TWK • 10 TIU • 12 TKP (27 Menit)' },
                      { id: 'Standar 60' as const, title: 'Tryout Menengah 60 Soal', desc: '16 TWK • 20 TIU • 24 TKP (55 Menit)' },
                      { id: 'Full CAT 110' as const, title: 'Simulasi Akbar SKD 110 Soal', desc: '30 TWK • 35 TIU • 45 TKP (100 Menit Resmi)' }
                    ]).map((pkt) => (
                      <div key={pkt.id} className="p-5 rounded-2xl border border-sky-100 bg-sky-50/50 flex flex-col justify-between gap-4">
                        <div>
                          <span className="text-[11px] font-bold uppercase text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                            {pkt.id}
                          </span>
                          <h3 className="font-bold text-slate-900 mt-2">{pkt.title}</h3>
                          <p className="text-xs text-slate-500 mt-1">{pkt.desc}</p>
                        </div>
                        <button
                          onClick={() => startTryout(pkt.id)}
                          className="w-full py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 flex items-center justify-center gap-1.5"
                        >
                          <Play size={14} /> Mulai Simulasi CAT
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LEADERBOARD & RIWAYAT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <Trophy size={18} className="text-amber-500" /> Leaderboard Nasional (Simulasi Peserta)
                    </h3>
                    <div className="space-y-2.5 text-sm">
                      {[
                        { rank: 1, nama: 'Rizky Pratama (ITB)', skor: 468, instansi: 'Kemenkeu' },
                        { rank: 2, nama: 'Aulia Rahmawati (UGM)', skor: 454, instansi: 'Kemenperin' },
                        { rank: 3, nama: 'Dimas Saputra (UI)', skor: 441, instansi: 'BRIN' },
                        { rank: latestReport.peringkatSimulasi, nama: `${profile.nama} (Anda)`, skor: latestReport.total, instansi: profile.lokasiMinat, isUser: true }
                      ].map((row, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3 rounded-xl border ${
                            row.isUser ? 'bg-sky-50 border-sky-300 font-bold' : 'bg-slate-50 border-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-white border flex items-center justify-center text-xs font-extrabold">
                              #{row.rank}
                            </span>
                            <div>
                              <p className="text-slate-900 text-xs sm:text-sm">{row.nama}</p>
                              <p className="text-[11px] text-slate-500 font-normal">Target: {row.instansi}</p>
                            </div>
                          </div>
                          <span className="text-sky-700 font-extrabold">{row.skor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Riwayat Peringkat & Hasil Tryout Anda</h3>
                    <div className="space-y-2.5">
                      {history.map((h) => (
                        <div key={h.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{h.paket}</p>
                            <p className="text-slate-500">{h.tanggal} • TWK {h.twk} | TIU {h.tiu} | TKP {h.tkp}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-sm text-sky-700">{h.total} Poin</p>
                            <p className="text-slate-500">Rank #{h.peringkatSimulasi}/{h.totalPesertaSimulasi}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {tryoutMode === 'exam' && examQuestions[currentIdx] && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800">
                      {examQuestions[currentIdx].kategori} — {examQuestions[currentIdx].subMateri}
                    </span>
                    <span className="ml-2 text-xs text-slate-500">
                      Soal {currentIdx + 1} dari {examQuestions.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold flex items-center gap-1.5">
                      <Clock size={14} /> {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
                    </span>
                    <button
                      onClick={finishTryout}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                    >
                      Selesai & Kumpulkan
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm md:text-base text-slate-900 leading-relaxed font-medium">
                    {examQuestions[currentIdx].soal}
                  </p>
                  <div className="space-y-2.5">
                    {examQuestions[currentIdx].opsi.map((opt, idx) => {
                      const selected = answers[examQuestions[currentIdx].id] === idx;
                      return (
                        <button
                          key={opt.label}
                          onClick={() => setAnswers({ ...answers, [examQuestions[currentIdx].id]: idx })}
                          className={`w-full text-left p-3.5 rounded-xl border text-sm flex items-start gap-3 transition-all ${
                            selected
                              ? 'bg-sky-50 border-sky-500 text-sky-950 font-semibold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            selected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {opt.label}
                          </span>
                          <span>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button
                      disabled={currentIdx === 0}
                      onClick={() => setCurrentIdx((i) => i - 1)}
                      className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold disabled:opacity-40"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setFlagged({ ...flagged, [examQuestions[currentIdx].id]: !flagged[examQuestions[currentIdx].id] })}
                      className="px-3.5 py-2 rounded-xl bg-amber-100 text-amber-800 text-xs font-semibold"
                    >
                      {flagged[examQuestions[currentIdx].id] ? 'Hapus Ragu-Ragu' : 'Tandai Ragu-Ragu'}
                    </button>
                    <button
                      disabled={currentIdx === examQuestions.length - 1}
                      onClick={() => setCurrentIdx((i) => i + 1)}
                      className="px-3.5 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold disabled:opacity-40"
                    >
                      Selanjutnya
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto">
                    {examQuestions.map((q, idx) => {
                      const isAns = answers[q.id] !== undefined;
                      const isFlag = flagged[q.id];
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIdx(idx)}
                          className={`w-7 h-7 rounded-lg text-[11px] font-bold ${
                            currentIdx === idx
                              ? 'ring-2 ring-sky-600 bg-white text-sky-700'
                              : isFlag
                              ? 'bg-amber-400 text-white'
                              : isAns
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {tryoutMode === 'review' && lastResult && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${lastResult.lulusPG ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {lastResult.lulusPG ? 'MEMENUHI AMBANG BATAS (PASSING GRADE)' : 'BELUM MEMENUHI AMBANG BATAS'}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                      Skor Total: {lastResult.total} Poin (Peringkat #{lastResult.peringkatSimulasi})
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      TWK: {lastResult.twk} (PG {config.pgTwk}) • TIU: {lastResult.tiu} (PG {config.pgTiu}) • TKP: {lastResult.tkp} (PG {config.pgTkp})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('laporan')}
                      className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700"
                    >
                      Unduh Sertifikat & Laporan PDF
                    </button>
                    <button
                      onClick={() => setTryoutMode('lobby')}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    >
                      Kembali ke Lobby
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900">Pembahasan Detail & Dasar Regulasi</h4>
                  {examQuestions.map((q, idx) => {
                    const userOptIdx = answers[q.id];
                    const userOpt = userOptIdx !== undefined ? q.opsi[userOptIdx] : null;
                    const bestOpt = [...q.opsi].sort((a, b) => b.skor - a.skor)[0];
                    return (
                      <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 text-sm">
                        <p className="font-bold text-slate-900">
                          {idx + 1}. [{q.kategori}] {q.soal}
                        </p>
                        <p className="text-xs">
                          Jawaban Anda: <strong>{userOpt ? `${userOpt.label}. ${userOpt.text} (Skor ${userOpt.skor})` : 'Tidak dijawab (0)'}</strong>
                        </p>
                        <p className="text-xs text-emerald-700 font-semibold">
                          Kunci Skor Tertinggi (5): {bestOpt.label}. {bestOpt.text}
                        </p>
                        <div className="p-3 rounded-xl bg-sky-50 text-xs text-slate-700">
                          <strong>Pembahasan:</strong> {q.pembahasan}
                          <br />
                          <span className="text-sky-700 font-medium">Referensi: {q.referensi}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REKOMENDASI FORMASI BERDASARKAN JURUSAN */}
        {activeTab === 'formasi' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Rekomendasi Formasi CPNS {config.tahun}</h2>
                <p className="text-xs text-slate-500">
                  Pencocokan otomatis kualifikasi pendidikan & prioritas jurusan. Data ditandai jelas antara historis BKN dan simulasi proyeksi.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Pendidikan Terakhir</label>
                  <select
                    value={profile.pendidikan}
                    onChange={(e) => setProfile({ ...profile, pendidikan: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="SLTA / SMK">SLTA / SMK</option>
                    <option value="D-III">D-III</option>
                    <option value="S1 / D-IV">S1 / D-IV</option>
                    <option value="S2">S2</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Program Studi / Jurusan</label>
                  <input
                    type="text"
                    value={profile.jurusan}
                    onChange={(e) => setProfile({ ...profile, jurusan: e.target.value })}
                    placeholder="Contoh: Teknik Mesin"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Universitas (Opsional)</label>
                  <input
                    type="text"
                    value={profile.universitas}
                    onChange={(e) => setProfile({ ...profile, universitas: e.target.value })}
                    placeholder="Nama Perguruan Tinggi"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Lokasi Penempatan Diinginkan</label>
                  <input
                    type="text"
                    value={profile.lokasiMinat}
                    onChange={(e) => setProfile({ ...profile, lokasiMinat: e.target.value })}
                    placeholder="Contoh: Jawa Barat"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                <select
                  value={filterJenisInstansi}
                  onChange={(e) => setFilterJenisInstansi(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-medium"
                >
                  <option value="Semua">Semua Jenis Instansi</option>
                  <option value="Kementerian/Lembaga">Kementerian / Lembaga</option>
                  <option value="Instansi Daerah">Instansi Daerah (Pemda)</option>
                </select>
                <select
                  value={filterJenisJabatan}
                  onChange={(e) => setFilterJenisJabatan(e.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-medium"
                >
                  <option value="Semua">Semua Jenis Jabatan</option>
                  <option value="Jabatan Fungsional">Jabatan Fungsional</option>
                  <option value="Jabatan Pelaksana">Jabatan Pelaksana</option>
                </select>
                <input
                  type="text"
                  value={filterProvinsi}
                  onChange={(e) => setFilterProvinsi(e.target.value)}
                  placeholder="Filter Provinsi / Kab / Kota..."
                  className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs"
                />
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer ml-auto">
                  <input
                    type="checkbox"
                    checked={hanyaSesuaiJurusan}
                    onChange={(e) => setHanyaSesuaiJurusan(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  Hanya tampilkan yang memenuhi kualifikasi
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluatedFormasi.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-all ${
                    item.memenuhi ? 'border-emerald-200' : 'border-slate-200 opacity-85'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.memenuhi ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {item.memenuhi ? '✓ Memenuhi Kualifikasi' : '✕ Tidak Memenuhi Kualifikasi'}
                      </span>
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                          item.sumberData === 'Data Historis Resmi BKN'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.sumberData}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-sky-600">{item.instansi} ({item.jenisInstansi})</p>
                      <h3 className="text-base font-extrabold text-slate-900">{item.jabatan}</h3>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p><strong>Penempatan:</strong> {item.kabKota}, {item.provinsi}</p>
                      <p><strong>Kualifikasi:</strong> {item.pendidikanMin.join('/')} — {item.jurusanList.join(', ')}</p>
                      <p><strong>Kuota Formasi:</strong> {item.kuota} kursi • <strong>Pelamar Acuan:</strong> {item.pelamarHistoris} orang</p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600">
                      <p className="font-semibold text-slate-700 mb-1">Persyaratan Umum & Khusus:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {item.persyaratan.map((p, idx) => <li key={idx}>{p}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Rasio: 1 : {(item.pelamarHistoris / item.kuota).toFixed(1)}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedFormasiId(item.id);
                        setActiveTab('simulasi');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 flex items-center gap-1"
                    >
                      Simulasikan Peringkat <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SIMULASI PERINGKAT & PERSAINGAN */}
        {activeTab === 'simulasi' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Simulasi Peringkat & Keketatan Formasi</h2>
                  <p className="text-xs text-slate-500">
                    Proyeksi posisi peringkat SKD menggunakan aturan pemeringkatan 3x formasi menuju tahap SKB.
                  </p>
                </div>
                <span className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl">
                  Catatan: Proyeksi simulasi statistik, bukan peringkat resmi SSCASN BKN
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="lg:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Pilih Formasi Tujuan</label>
                  <select
                    value={selectedFormasiId}
                    onChange={(e) => setSelectedFormasiId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  >
                    {formasiList.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.instansi} — {f.jabatan} ({f.sumberData})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Jumlah Kuota Formasi (Asumsi)</label>
                  <input
                    type="number"
                    min={1}
                    value={customKuota}
                    onChange={(e) => setCustomKuota(Math.max(1, Number(e.target.value)))}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Jumlah Pelamar (Historis/Asumsi)</label>
                  <input
                    type="number"
                    min={1}
                    value={customPelamar}
                    onChange={(e) => setCustomPelamar(Math.max(1, Number(e.target.value)))}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Skor SKD Anda Saat Ini: <strong>{simulasiSkorUser} Poin</strong>
                  </label>
                  <input
                    type="range"
                    min={250}
                    max={520}
                    value={simulasiSkorUser}
                    onChange={(e) => setSimulasiSkorUser(Number(e.target.value))}
                    className="w-full mt-2 accent-sky-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">
                    Skenario Kenaikan Skor Latihan: <strong>+{kenaikanSkor} Poin (Menjadi {simulationResult.skorBoosted})</strong>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={kenaikanSkor}
                    onChange={(e) => setKenaikanSkor(Number(e.target.value))}
                    className="w-full mt-2 accent-emerald-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                  {activeFormasiSim.sumberData}
                </span>
                <p className="text-xs text-slate-500 mt-2">Rasio Keketatan & Kuota SKB (3x)</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">1 : {simulationResult.rasioKeketatan}</p>
                <p className="text-xs text-slate-600 mt-1">
                  Batas aman peringkat SKD: <strong>Top {simulationResult.kuotaSkd}</strong> dari {customPelamar} pelamar.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  Asumsi Distribusi Skor Saat Ini ({simulasiSkorUser})
                </span>
                <p className="text-xs text-slate-500 mt-2">Perkiraan Posisi Peringkat</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">
                  Peringkat #{simulationResult.estRankBase}
                </p>
                <p className={`text-xs font-bold mt-1 ${simulationResult.lolosSkdBase ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {simulationResult.lolosSkdBase
                    ? '✓ Masuk Zona Aman Perangkingan 3x Formasi'
                    : '✕ Di Luar Kuota 3x Formasi (Perlu Kenaikan Skor)'}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Skenario Kenaikan +{kenaikanSkor} Poin ({simulationResult.skorBoosted})
                </span>
                <p className="text-xs text-slate-500 mt-2">Proyeksi Peringkat Setelah Optimasi</p>
                <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                  Peringkat #{simulationResult.estRankBoost}
                </p>
                <p className={`text-xs font-bold mt-1 ${simulationResult.lolosSkdBoost ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {simulationResult.lolosSkdBoost
                    ? '✓ Lolos Pemeringkatan SKD ke Tahap SKB'
                    : 'Masih perlu tambahan poin lebih tinggi'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: AI TUTOR CPNS */}
        {activeTab === 'tutor' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[620px]">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Brain size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">AI Tutor Ghifari Siap CPNS</h2>
                  <p className="text-[11px] text-slate-500">Berbasis Regulasi Resmi ASN & 1.200 Bank Soal</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleAskAi('Analisis kelemahan nilai tryout terakhir saya dan materi prioritasnya')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-semibold hover:bg-sky-100"
                >
                  Analisis Kelemahan Saya
                </button>
                <button
                  onClick={() => handleAskAi('Berikan trik cepat mengerjakan soal TIU silogisme dan deret')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-700 font-semibold hover:bg-cyan-100"
                >
                  Trik Cepat TIU
                </button>
                <button
                  onClick={() => handleAskAi('Buatkan jadwal belajar harian sesuai target skor saya')}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold hover:bg-indigo-100"
                >
                  Buat Jadwal Belajar
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {aiMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-sky-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {aiLoading && <p className="text-xs text-slate-400 italic">AI Tutor sedang menyusun penjelasan...</p>}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAi();
              }}
              className="p-3 border-t border-slate-100 flex gap-2"
            >
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Tanyakan pasal UUD 1945, trik TIU, contoh soal TKP, atau progres bank soal..."
                className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
              >
                Kirim
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: MATERI PEMBELAJARAN */}
        {activeTab === 'materi' && (
          <div className="space-y-6">
            {LEARNING_MODULES.map((mod) => (
              <div key={mod.kategori} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                      Modul {mod.kategori}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">{mod.judul}</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                    Ambang Batas: {mod.targetPG}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mod.subTopik.map((sub, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sm">{sub.nama}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{sub.ringkasan}</p>
                      <div className="p-2.5 rounded-lg bg-cyan-50 border border-cyan-100 text-[11px] text-cyan-900">
                        <strong>Tips Mengingat & Strategi:</strong> {sub.tips}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 8: TARGET & KALENDER BELAJAR */}
        {activeTab === 'target' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900">Pengaturan Target Belajar</h3>
              <div>
                <label className="text-xs font-semibold text-slate-600">Target Skor Total SKD</label>
                <input
                  type="number"
                  value={profile.targetSkor}
                  onChange={(e) => setProfile({ ...profile, targetSkor: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600">Target Jumlah Soal Harian</label>
                <input
                  type="number"
                  value={profile.targetSoalHarian}
                  onChange={(e) => setProfile({ ...profile, targetSoalHarian: Number(e.target.value) })}
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => logExtraPractice(10)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  + Tambah 10 Soal Selesai Hari Ini
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Reset riwayat penanda soal yang sudah dikerjakan?')) {
                      setSolvedIds({});
                    }
                  }}
                  className="w-full py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                >
                  Reset Penanda 1.200 Bank Soal
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Kalender & Grafik Konsistensi Belajar</h3>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  Streak: {streakDays} Hari Aktif
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-2">
                {Object.entries(studyLogs).slice(-14).map(([date, count]) => {
                  const achieved = count >= profile.targetSoalHarian;
                  return (
                    <div
                      key={date}
                      className={`p-3 rounded-xl border text-center ${
                        achieved ? 'bg-emerald-50 border-emerald-200' : 'bg-sky-50 border-sky-200'
                      }`}
                    >
                      <p className="text-[11px] text-slate-500">{date.slice(5)}</p>
                      <p className="text-lg font-extrabold text-slate-900 mt-1">{count}</p>
                      <p className="text-[10px] font-semibold text-slate-600">
                        {achieved ? '✓ Tercapai' : 'Progres'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: HASIL & LAPORAN PDF */}
        {activeTab === 'laporan' && (
          <div className="space-y-4">
            <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h2 className="font-bold text-slate-900">Pratinjau Laporan Hasil & Sertifikat Simulasi</h2>
                <p className="text-xs text-slate-500">Klik tombol cetak untuk menyimpan sebagai dokumen PDF resmi.</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 flex items-center gap-2"
              >
                <Download size={16} /> Unduh / Cetak PDF
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm space-y-6 max-w-4xl mx-auto">
              <div className="border-b-2 border-sky-700 pb-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-extrabold text-sky-900">GHIFARI SIAP CPNS</h1>
                  <p className="text-xs text-slate-500">Laporan Evaluasi Hasil Simulasi Seleksi Kompetensi Dasar (SKD) Tahun {config.tahun}</p>
                </div>
                <div className="text-right text-xs text-slate-600">
                  <p>ID Laporan: <strong>{latestReport.id}</strong></p>
                  <p>Tanggal: <strong>{latestReport.tanggal}</strong></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500">Nama Peserta</p>
                  <p className="font-bold text-slate-900">{profile.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Kualifikasi Pendidikan</p>
                  <p className="font-bold text-slate-900">{profile.pendidikan} — {profile.jurusan}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Paket Simulasi</p>
                  <p className="font-bold text-slate-900">{latestReport.paket}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status Ambang Batas</p>
                  <p className={`font-bold ${latestReport.lulusPG ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {latestReport.lulusPG ? 'MEMENUHI AMBANG BATAS (LULUS PG)' : 'BELUM MEMENUHI AMBANG BATAS'}
                  </p>
                </div>
              </div>

              <table className="w-full text-sm border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-sky-700 text-white">
                    <th className="border border-slate-300 p-2.5 text-left">Subtes SKD</th>
                    <th className="border border-slate-300 p-2.5 text-center">Skor Peserta</th>
                    <th className="border border-slate-300 p-2.5 text-center">Passing Grade</th>
                    <th className="border border-slate-300 p-2.5 text-center">Keterangan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2.5">Tes Wawasan Kebangsaan (TWK)</td>
                    <td className="border border-slate-300 p-2.5 text-center font-bold">{latestReport.twk}</td>
                    <td className="border border-slate-300 p-2.5 text-center">{config.pgTwk}</td>
                    <td className="border border-slate-300 p-2.5 text-center">{latestReport.twk >= config.pgTwk ? 'Memenuhi' : 'Kurang'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2.5">Tes Intelegensia Umum (TIU)</td>
                    <td className="border border-slate-300 p-2.5 text-center font-bold">{latestReport.tiu}</td>
                    <td className="border border-slate-300 p-2.5 text-center">{config.pgTiu}</td>
                    <td className="border border-slate-300 p-2.5 text-center">{latestReport.tiu >= config.pgTiu ? 'Memenuhi' : 'Kurang'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2.5">Tes Karakteristik Pribadi (TKP)</td>
                    <td className="border border-slate-300 p-2.5 text-center font-bold">{latestReport.tkp}</td>
                    <td className="border border-slate-300 p-2.5 text-center">{config.pgTkp}</td>
                    <td className="border border-slate-300 p-2.5 text-center">{latestReport.tkp >= config.pgTkp ? 'Memenuhi' : 'Kurang'}</td>
                  </tr>
                  <tr className="bg-slate-100 font-extrabold">
                    <td className="border border-slate-300 p-2.5">TOTAL NILAI SKD</td>
                    <td className="border border-slate-300 p-2.5 text-center text-sky-800">{latestReport.total}</td>
                    <td className="border border-slate-300 p-2.5 text-center">{config.pgTwk + config.pgTiu + config.pgTkp}</td>
                    <td className="border border-slate-300 p-2.5 text-center">Rank Simulasi #{latestReport.peringkatSimulasi}</td>
                  </tr>
                </tbody>
              </table>

              <div className="space-y-2 text-xs text-slate-700">
                <p><strong>Bank Soal Latihan Selesai:</strong> {Object.keys(solvedIds).length} dari {QUESTION_BANK.length} soal unik</p>
                <p><strong>Analisis Kekuatan:</strong> {readiness.strongest}</p>
                <p><strong>Materi Perlu Ditingkatkan:</strong> {readiness.weakest}</p>
                <p>
                  <strong>Rekomendasi Formasi Sesuai Kualifikasi:</strong>{' '}
                  {evaluatedFormasi.filter((f) => f.memenuhi).map((f) => `${f.jabatan} (${f.instansi})`).join('; ') || 'Sesuaikan filter jurusan'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: PENGATURAN TAHUN SELEKSI & APPS SCRIPT */}
        {activeTab === 'pengaturan' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900">Pengaturan Tahun Seleksi & Regulasi SKD</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Tahun Seleksi Berjalan</label>
                  <input
                    type="number"
                    value={config.tahun}
                    onChange={(e) => setConfig({ ...config, tahun: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Sumber Regulasi Resmi</label>
                  <input
                    type="text"
                    value={config.regulasi}
                    onChange={(e) => setConfig({ ...config, regulasi: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Passing Grade TWK</label>
                  <input
                    type="number"
                    value={config.pgTwk}
                    onChange={(e) => setConfig({ ...config, pgTwk: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Passing Grade TIU</label>
                  <input
                    type="number"
                    value={config.pgTiu}
                    onChange={(e) => setConfig({ ...config, pgTiu: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Passing Grade TKP</label>
                  <input
                    type="number"
                    value={config.pgTkp}
                    onChange={(e) => setConfig({ ...config, pgTkp: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Durasi Ujian (Menit)</label>
                  <input
                    type="number"
                    value={config.durasiMenit}
                    onChange={(e) => setConfig({ ...config, durasiMenit: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Jadwal Pendaftaran SSCASN</label>
                  <input
                    type="text"
                    value={config.jadwalPendaftaran}
                    onChange={(e) => setConfig({ ...config, jadwalPendaftaran: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Jadwal Pelaksanaan SKD</label>
                  <input
                    type="text"
                    value={config.jadwalSkd}
                    onChange={(e) => setConfig({ ...config, jadwalSkd: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="text-xs font-semibold text-slate-600">URL Web App Google Apps Script (Terhubung Otomatis)</label>
                  <input
                    type="url"
                    value={config.gasUrl}
                    onChange={(e) => setConfig({ ...config, gasUrl: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-sky-50/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Gemini API Key (Opsional untuk AI Tutor Dinamis)</label>
                  <input
                    type="password"
                    value={config.geminiApiKey}
                    onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={syncToGoogleSheets}
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 flex items-center gap-2"
                >
                  <Database size={15} /> Sinkronkan ke Google Sheets
                </button>
                {syncStatus && <span className="text-xs font-semibold text-sky-700">{syncStatus}</span>}
              </div>
            </div>

            <form onSubmit={handleAddFormasi} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900">Tambah Data Formasi CPNS Tahun {config.tahun}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nama Instansi (misal: Kemenhub)"
                  value={newFormasi.instansi}
                  onChange={(e) => setNewFormasi({ ...newFormasi, instansi: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  required
                  placeholder="Nama Jabatan"
                  value={newFormasi.jabatan}
                  onChange={(e) => setNewFormasi({ ...newFormasi, jabatan: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Jurusan (pisahkan dengan koma)"
                  value={newFormasi.jurusan}
                  onChange={(e) => setNewFormasi({ ...newFormasi, jurusan: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Provinsi / Kabupaten / Kota"
                  value={newFormasi.kabKota}
                  onChange={(e) => setNewFormasi({ ...newFormasi, kabKota: e.target.value })}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min={1}
                  placeholder="Jumlah Kuota"
                  value={newFormasi.kuota}
                  onChange={(e) => setNewFormasi({ ...newFormasi, kuota: Number(e.target.value) })}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
                >
                  + Simpan ke Database Formasi
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
