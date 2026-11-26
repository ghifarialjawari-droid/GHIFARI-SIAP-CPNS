import React, { useState, useEffect, useMemo } from 'react';
import {
  Award, BookOpen, Brain, Calendar, CheckCircle2, ChevronRight, Clock,
  Compass, Download, FileText, Filter, Flame, GraduationCap, LayoutDashboard,
  Medal, Menu, MessageSquare, Play, Plus, RefreshCw, Search, Settings,
  ShieldCheck, Sparkles, Target, TrendingUp, Trophy, Users, X, AlertTriangle,
  BarChart3, Database, Save, Check, HelpCircle
} from 'lucide-react';

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
  passingGradeKhusus?: { twk: number; tiu: number; tkp: number };
}

interface Question {
  id: string;
  kategori: 'TWK' | 'TIU' | 'TKP';
  subMateri: string;
  tingkat: 'Dasar' | 'Menengah' | 'HOTS';
  paket: 'Harian' | 'Mingguan' | 'Bulanan';
  soal: string;
  opsi: { label: string; text: string; skor: number }[];
  pembahasan: string;
  referensi: string;
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

const QUESTION_BANK: Question[] = [
  // TWK
  {
    id: 'TWK-01', kategori: 'TWK', subMateri: 'Pancasila & Pengamalan', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Dalam rapat musyawarah desa untuk menentukan prioritas pembangunan infrastruktur, terjadi perbedaan pendapat yang tajam antarwarga. Pimpinan rapat mengajak seluruh peserta untuk tetap mengutamakan kepentingan bersama di atas kepentingan golongan serta menerima keputusan akhir dengan lapang dada. Sikap tersebut mencerminkan pengamalan Pancasila khususnya sila ke-...',
    opsi: [
      { label: 'A', text: 'Sila kedua dan ketiga', skor: 0 },
      { label: 'B', text: 'Sila ketiga dan keempat', skor: 5 },
      { label: 'C', text: 'Sila keempat dan kelima', skor: 0 },
      { label: 'D', text: 'Sila pertama dan keempat', skor: 0 },
      { label: 'E', text: 'Sila kedua dan kelima', skor: 0 }
    ],
    pembahasan: 'Mengutamakan kepentingan bersama di atas golongan merupakan butir Sila ke-3 (Persatuan Indonesia), sedangkan musyawarah mufakat dan menerima keputusan bersama dengan lapang dada adalah butir Sila ke-4.',
    referensi: 'Tap MPR No. I/MPR/2003 tentang Butir-Butir Pengamalan Pancasila'
  },
  {
    id: 'TWK-02', kategori: 'TWK', subMateri: 'UUD 1945 & Konstitusi', tingkat: 'HOTS', paket: 'Harian',
    soal: 'Berdasarkan Pasal 24C ayat (1) UUD NRI Tahun 1945 setelah amandemen, salah satu kewenangan Mahkamah Konstitusi yang memutus pada tingkat pertama dan terakhir yang putusannya bersifat final adalah...',
    opsi: [
      { label: 'A', text: 'Menguji peraturan perundang-undangan di bawah undang-undang terhadap undang-undang', skor: 0 },
      { label: 'B', text: 'Memutus sengketa kewenangan lembaga negara yang kewenangannya diberikan oleh UUD 1945', skor: 5 },
      { label: 'C', text: 'Memberikan pertimbangan hukum kepada Presiden dalam pemberian grasi dan rehabilitasi', skor: 0 },
      { label: 'D', text: 'Mengusulkan pengangkatan hakim agung kepada Dewan Perwakilan Rakyat', skor: 0 },
      { label: 'E', text: 'Mengawasi perilaku hakim agung dan hakim konstitusi secara independen', skor: 0 }
    ],
    pembahasan: 'Pasal 24C ayat (1) UUD 1945 menegaskan MK berwenang mengadili pada tingkat pertama dan terakhir yang putusannya bersifat final untuk: (1) menguji UU terhadap UUD, (2) memutus sengketa kewenangan lembaga negara yang kewenangannya diberikan UUD, (3) memutus pembubaran parpol, dan (4) memutus perselisihan hasil pemilu.',
    referensi: 'UUD NRI Tahun 1945 Pasal 24C Ayat (1)'
  },
  {
    id: 'TWK-03', kategori: 'TWK', subMateri: 'Integritas & Antikorupsi', tingkat: 'HOTS', paket: 'Mingguan',
    soal: 'Seorang pejabat pembuat komitmen (PPK) menolak pemberian paket liburan keluarga dari vendor pemenang tender proyek pengadaan mesin industri meskipun seluruh proses lelang telah selesai dilaksanakan sesuai prosedur. Tindakan PPK tersebut merupakan wujud nilai dasar ASN BerAKHLAK khususnya pada aspek...',
    opsi: [
      { label: 'A', text: 'Kompeten dan Adaptif', skor: 0 },
      { label: 'B', text: 'Akuntabel (tidak menyalahgunakan kewenangan jabatan)', skor: 5 },
      { label: 'C', text: 'Harmonis dan Kolaboratif', skor: 0 },
      { label: 'D', text: 'Loyal kepada pimpinan instansi', skor: 0 },
      { label: 'E', text: 'Berorientasi Pelayanan prima', skor: 0 }
    ],
    pembahasan: 'Gratifikasi pasca-tender tetap berpotensi konflik kepentingan dan dilarang dalam UU Tipikor serta panduan perilaku ASN "Akuntabel": melaksanakan tugas dengan jujur, bertanggung jawab, cermat, disiplin, dan berintegritas tinggi serta tidak menyalahgunakan kewenangan jabatan.',
    referensi: 'SE MenPANRB No. 20 Tahun 2021 & UU No. 20 Tahun 2001 Pasal 12B'
  },
  {
    id: 'TWK-04', kategori: 'TWK', subMateri: 'Bela Negara & NKRI', tingkat: 'Menengah', paket: 'Bulanan',
    soal: 'Ancaman nonmiliter di era transformasi digital berupa penyebaran disinformasi yang memecah belah persatuan bangsa dapat ditangkal oleh ASN melalui implementasi nilai dasar Bela Negara yaitu...',
    opsi: [
      { label: 'A', text: 'Kemampuan awal bela negara secara fisik di garis perbatasan', skor: 0 },
      { label: 'B', text: 'Sadar berbangsa dan bernegara dengan literasi digital serta verifikasi informasi', skor: 5 },
      { label: 'C', text: 'Rela berkorban harta benda untuk pembangunan alutsista', skor: 0 },
      { label: 'D', text: 'Cinta tanah air dengan membatasi seluruh akses teknologi asing', skor: 0 },
      { label: 'E', text: 'Setia pada Pancasila sebagai ideologi tertutup', skor: 0 }
    ],
    pembahasan: 'Lima nilai dasar bela negara meliputi: cinta tanah air, sadar berbangsa dan bernegara, setia pada Pancasila sebagai ideologi negara, rela berkorban untuk bangsa dan negara, serta kemampuan awal bela negara. Menjaga ruang digital dari hoaks adalah bagian dari kesadaran berbangsa dan bernegara.',
    referensi: 'UU No. 23 Tahun 2019 tentang Pengelolaan Sumber Daya Nasional untuk Pertahanan Negara'
  },
  // TIU
  {
    id: 'TIU-01', kategori: 'TIU', subMateri: 'Penalaran Logis (Silogisme)', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Semua insinyur yang lulus uji kompetensi berhak menandatangani dokumen rancangan teknis. Sebagian pegawai di Direktorat Industri adalah insinyur yang lulus uji kompetensi. Simpulan yang paling tepat adalah...',
    opsi: [
      { label: 'A', text: 'Semua pegawai di Direktorat Industri berhak menandatangani dokumen rancangan teknis.', skor: 0 },
      { label: 'B', text: 'Sebagian pegawai di Direktorat Industri berhak menandatangani dokumen rancangan teknis.', skor: 5 },
      { label: 'C', text: 'Sebagian insinyur yang lulus uji kompetensi bukan pegawai Direktorat Industri.', skor: 0 },
      { label: 'D', text: 'Semua yang berhak menandatangani dokumen rancangan teknis adalah pegawai Direktorat Industri.', skor: 0 },
      { label: 'E', text: 'Tidak ada pegawai Direktorat Industri yang berhak menandatangani dokumen rancangan teknis.', skor: 0 }
    ],
    pembahasan: 'Premis 1: Semua A adalah B. Premis 2: Sebagian C adalah A. Dengan aturan silogisme kategorik (Modus Barbara parsial), kesimpulan sahnya adalah: Sebagian C adalah B (Sebagian pegawai di Direktorat Industri berhak menandatangani dokumen rancangan teknis).',
    referensi: 'Logika Deduktif - Silogisme Kategorik'
  },
  {
    id: 'TIU-02', kategori: 'TIU', subMateri: 'Numerik (Deret & Perbandingan)', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Perhatikan pola deret bilangan berikut: 4, 7, 13, 25, 49, ... Bilangan selanjutnya yang tepat untuk melengkapi deret tersebut adalah...',
    opsi: [
      { label: 'A', text: '85', skor: 0 },
      { label: 'B', text: '93', skor: 0 },
      { label: 'C', text: '97', skor: 5 },
      { label: 'D', text: '98', skor: 0 },
      { label: 'E', text: '101', skor: 0 }
    ],
    pembahasan: 'Selisih antar suku: 7-4 = +3; 13-7 = +6; 25-13 = +12; 49-25 = +24. Pola selisih selalu dikali 2 (+3, +6, +12, +24, +48). Maka bilangan berikutnya = 49 + 48 = 97 (atau rumus 2n - 1).',
    referensi: 'TIU Numerik - Pola Deret Geometri Bertingkat'
  },
  {
    id: 'TIU-03', kategori: 'TIU', subMateri: 'Numerik (Perbandingan Kuantitatif)', tingkat: 'HOTS', paket: 'Mingguan',
    soal: 'Sebuah mesin produksi mampu mencetak 240 komponen presisi dalam waktu 40 menit. Jika ditambahkan 2 mesin identik yang bekerja bersamaan dengan kecepatan sama, berapa menit waktu yang dibutuhkan untuk mencetak 900 komponen?',
    opsi: [
      { label: 'A', text: '45 menit', skor: 0 },
      { label: 'B', text: '50 menit', skor: 5 },
      { label: 'C', text: '60 menit', skor: 0 },
      { label: 'D', text: '75 menit', skor: 0 },
      { label: 'E', text: '90 menit', skor: 0 }
    ],
    pembahasan: 'Kecepatan 1 mesin = 240 / 40 = 6 komponen/menit. Jika ditambah 2 mesin identik, total ada 1 + 2 = 3 mesin. Kecepatan total = 3 × 6 = 18 komponen/menit. Waktu untuk 900 komponen = 900 / 18 = 50 menit.',
    referensi: 'TIU Numerik - Perbandingan Senilai & Berbalik Nilai'
  },
  {
    id: 'TIU-04', kategori: 'TIU', subMateri: 'Penalaran Analitis', tingkat: 'HOTS', paket: 'Bulanan',
    soal: 'Lima peserta seleksi (A, B, C, D, E) memperoleh nilai SKD berbeda. Nilai A lebih tinggi dari B tetapi lebih rendah dari C. Nilai D lebih tinggi dari C, sedangkan nilai E berada tepat di antara nilai A dan B. Peserta dengan peringkat nilai tertinggi kedua adalah...',
    opsi: [
      { label: 'A', text: 'A', skor: 0 },
      { label: 'B', text: 'B', skor: 0 },
      { label: 'C', text: 'C', skor: 5 },
      { label: 'D', text: 'D', skor: 0 },
      { label: 'E', text: 'E', skor: 0 }
    ],
    pembahasan: 'Urutan dari tertinggi ke terendah: D > C > A > E > B. Peringkat 1 = D, peringkat 2 = C, peringkat 3 = A, peringkat 4 = E, peringkat 5 = B.',
    referensi: 'TIU Penalaran Analitis - Pemeringkatan'
  },
  // TKP
  {
    id: 'TKP-01', kategori: 'TKP', subMateri: 'Pelayanan Publik', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Anda bertugas di loket pelayanan perizinan terpadu. Menjelang jam istirahat siang, seorang warga lansia datang dari desa terpencil dengan berkas permohonan yang belum lengkap, padahal sistem antrean daring sudah ditutup. Sikap Anda adalah...',
    opsi: [
      { label: 'A', text: 'Menjelaskan dengan sopan prosedur kelengkapan berkas, membantu memeriksa kekurangan dokumennya saat itu juga, dan mengarahkan jadwal pengajuan prioritas berikutnya.', skor: 5 },
      { label: 'B', text: 'Meminta warga tersebut pulang dan kembali besok pagi sesuai jam operasional standar loket.', skor: 2 },
      { label: 'C', text: 'Tetap memproses permohonannya meskipun berkas belum lengkap karena merasa kasihan.', skor: 1 },
      { label: 'D', text: 'Menyarankan warga tersebut meminta bantuan petugas keamanan untuk mengisi formulir daring.', skor: 3 },
      { label: 'E', text: 'Mencatat nomor teleponnya dan berjanji akan menghubunginya jika ada waktu luang minggu depan.', skor: 4 }
    ],
    pembahasan: 'Dalam TKP Pelayanan Publik, skor 5 menggabungkan empati tinggi tanpa melanggar aturan/SOP (tetap mensyaratkan kelengkapan berkas, namun proaktif membantu memeriksa dan memberi solusi terukur).',
    referensi: 'Kisi-kisi TKP PermenPANRB - Aspek Pelayanan Publik'
  },
  {
    id: 'TKP-02', kategori: 'TKP', subMateri: 'Teknologi Informasi & Komunikasi', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Instansi Anda baru saja meluncurkan sistem pelaporan kinerja digital untuk menggantikan pelaporan manual berbasis kertas. Beberapa rekan senior di unit Anda kesulitan beradaptasi sehingga progres laporan divisi melambat. Langkah yang Anda ambil adalah...',
    opsi: [
      { label: 'A', text: 'Fokus menyelesaikan laporan bagian saya sendiri tepat waktu agar kinerja pribadi tetap dinilai baik.', skor: 2 },
      { label: 'B', text: 'Membuat panduan ringkas langkah demi langkah dan menawarkan pendampingan praktik langsung di sela waktu kerja.', skor: 5 },
      { label: 'C', text: 'Melaporkan kepada atasan bahwa rekan senior menghambat digitalisasi unit kerja.', skor: 1 },
      { label: 'D', text: 'Mengambil alih seluruh penginputan data rekan senior agar laporan divisi cepat selesai.', skor: 3 },
      { label: 'E', text: 'Menyarankan mereka mengikuti pelatihan mandiri melalui video tutorial di internet.', skor: 4 }
    ],
    pembahasan: 'Aspek TIK & Jejaring Kerja mengutamakan kemauan berbagi pengetahuan teknologi secara solutif dan memberdayakan rekan kerja (bukan mengambil alih tugas atau membiarkan).',
    referensi: 'Kisi-kisi TKP PermenPANRB - Aspek TIK'
  },
  {
    id: 'TKP-03', kategori: 'TKP', subMateri: 'Profesionalisme & Anti Radikalisme', tingkat: 'HOTS', paket: 'Mingguan',
    soal: 'Di grup percakapan internal pegawai, seorang rekan membagikan tautan artikel yang mempertanyakan keabsahan dasar negara dan mengajak anggota grup menolak kebijakan resmi pemerintah dengan alasan ideologi kelompok tertentu. Respons Anda adalah...',
    opsi: [
      { label: 'A', text: 'Keluar dari grup secara diam-diam agar tidak terlibat polemik.', skor: 2 },
      { label: 'B', text: 'Mengingatkan secara objektif di grup mengenai netralitas serta kode etik ASN untuk setia pada Pancasila dan UUD 1945, lalu melaporkan konten tersebut sesuai mekanisme pembinaan internal.', skor: 5 },
      { label: 'C', text: 'Membalas dengan kemarahan dan memperdebatkan pandangan tersebut secara emosional di grup.', skor: 1 },
      { label: 'D', text: 'Mengabaikan pesan tersebut karena menganggapnya hanya candaan atau opini pribadi.', skor: 3 },
      { label: 'E', text: 'Menghubungi rekan tersebut secara pribadi untuk menyarankan agar menghapus tautannya saja.', skor: 4 }
    ],
    pembahasan: 'Aspek Anti-Radikalisme menuntut ketegasan sikap ASN dalam menjaga keutuhan ideologi negara secara elegan, edukatif, dan sesuai prosedur pelaporan pembinaan kepegawaian.',
    referensi: 'SKB Penanganan Radikalisme ASN & UU No. 20 Tahun 2023 tentang ASN'
  },
  {
    id: 'TKP-04', kategori: 'TKP', subMateri: 'Sosial Budaya & Jejaring Kerja', tingkat: 'Menengah', paket: 'Bulanan',
    soal: 'Anda dipindahtugaskan ke unit kerja di daerah dengan latar belakang bahasa dan adat istiadat yang berbeda dari daerah asal Anda. Pada minggu pertama, komunikasi tim terasa kaku. Upaya terbaik yang Anda lakukan adalah...',
    opsi: [
      { label: 'A', text: 'Tetap bekerja seperti biasa dan menunggu rekan kerja mengajak berbicara terlebih dahulu.', skor: 2 },
      { label: 'B', text: 'Aktif mempelajari etika budaya setempat, bersikap terbuka dalam berdialog, dan membangun kolaborasi kerja yang inklusif.', skor: 5 },
      { label: 'C', text: 'Hanya berinteraksi secara formal sebatas urusan pekerjaan agar terhindar dari salah paham budaya.', skor: 3 },
      { label: 'D', text: 'Meminta rekan kerja menyesuaikan diri menggunakan kebiasaan komunikasi dari daerah asal Anda.', skor: 1 },
      { label: 'E', text: 'Mengikuti kegiatan informal kantor sesekali sambil mengamati kebiasaan mereka.', skor: 4 }
    ],
    pembahasan: 'Aspek Sosial Budaya mengukur kemampuan beradaptasi dan bekerja efektif dalam masyarakat majemuk dengan sikap menghargai keragaman secara aktif.',
    referensi: 'Kisi-kisi TKP PermenPANRB - Aspek Sosial Budaya'
  }
];

const LEARNING_MODULES = [
  {
    kategori: 'TWK',
    judul: 'Tes Wawasan Kebangsaan (TWK)',
    targetPG: '65 Poin (30 Soal)',
    subTopik: [
      { nama: 'Pancasila', ringkasan: 'Kedudukan Pancasila sebagai dasar negara, pandangan hidup, ideologi terbuka, serta implementasi 45 butir pengamalan sila ke-1 hingga ke-5 dalam studi kasus pelayanan publik.', tips: 'Identifikasi kata kunci perilaku: Ketuhanan (toleransi), Kemanusiaan (empati/HAM), Persatuan (rela berkorban/cinta tanah air), Kerakyatan (musyawarah/mufakat), Keadilan (hak & kewajiban seimbang).' },
      { nama: 'UUD 1945 & Sistem Ketatanegaraan', ringkasan: 'Batang tubuh UUD 1945 pasca-amandemen (I–IV), tugas & wewenang MPR, DPR, DPD, Presiden, BPK, MA, MK, dan KY.', tips: 'Hafalkan pasal kunci: Pasal 1 (Bentuk negara), Pasal 7A-7B (Pemakzulan), Pasal 24A-24C (Kekuasaan Kehakiman), Pasal 27-34 (Warga Negara & Kesra).' },
      { nama: 'NKRI & Bhinneka Tunggal Ika', ringkasan: 'Wawasan Nusantara, otonomi daerah (UU No. 23/2014), pengelolaan keberagaman suku, agama, ras, dan antargolongan.', tips: 'Fokus pada konsep persatuan dalam keberagaman dan batas kewenangan pemerintah pusat vs daerah (absolut vs konkuren).' },
      { nama: 'Nasionalisme, Integritas & Bela Negara', ringkasan: 'Sejarah pergerakan nasional, nilai dasar ASN BerAKHLAK, pencegahan gratifikasi/korupsi (UU Tipikor), serta 5 nilai dasar Bela Negara.', tips: 'Soal TWK modern berbentuk penalaran kasus. Pilih jawaban yang paling mencerminkan kepatuhan regulasi dan kepentingan bangsa.' }
    ]
  },
  {
    kategori: 'TIU',
    judul: 'Tes Intelegensia Umum (TIU)',
    targetPG: '80 Poin (35 Soal)',
    subTopik: [
      { nama: 'Kemampuan Verbal (Analogi, Silogisme, Analitis)', ringkasan: 'Hubungan padanan kata, penarikan kesimpulan logis (Modus Ponens, Tollens, Silogisme), serta pemecahan masalah urutan/posisi.', tips: 'Untuk silogisme, gunakan diagram Venn atau aturan: Premis partikular (sebagian) selalu menghasilkan kesimpulan partikular.' },
      { nama: 'Kemampuan Numerik (Berhitung, Deret, Perbandingan)', ringkasan: 'Operasi pecahan/desimal cepat, pola deret aritmetika/geometri bertingkat, perbandingan senilai/berbalik nilai, serta soal cerita kuantitatif.', tips: 'Ubah desimal berulang menjadi pecahan istimewa (misal 0,125 = 1/8; 0,375 = 3/8; 0,1667 = 1/6) untuk menghemat 30 detik per soal.' },
      { nama: 'Kemampuan Figural (Analogi, Ketidaksamaan, Serial)', ringkasan: 'Rotasi bangun datar, pencerminan (refleksi), penambahan/pengurangan elemen visual, dan perubahan warna pola gambar.', tips: 'Amati satu elemen kecil terlebih dahulu (misal arah jarum/titik sudut) dan eliminasi 3 opsi yang arah rotasinya salah.' }
    ]
  },
  {
    kategori: 'TKP',
    judul: 'Tes Karakteristik Pribadi (TKP)',
    targetPG: '166 Poin (45 Soal)',
    subTopik: [
      { nama: 'Pelayanan Publik & Profesionalisme', ringkasan: 'Orientasi kepuasan masyarakat sesuai SOP, akuntabilitas kerja, dan ketangguhan menyelesaikan tugas di bawah tekanan.', tips: 'Selalu pilih opsi yang menunjukkan inisiatif membantu pemohon secara ramah NAMUN tetap patuh pada prosedur resmi.' },
      { nama: 'Jejaring Kerja, Sosial Budaya & TIK', ringkasan: 'Kolaborasi lintas unit, adaptasi budaya lokal, serta pemanfaatan teknologi informasi untuk efisiensi birokrasi.', tips: 'Pilih opsi yang membangun sinergi tim, mentransfer ilmu teknologi kepada rekan kerja, dan menghormati kearifan lokal.' },
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
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
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

  useEffect(() => { localStorage.setItem('gsc_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('gsc_config', JSON.stringify(config)); }, [config]);
  useEffect(() => { localStorage.setItem('gsc_formasi', JSON.stringify(formasiList)); }, [formasiList]);
  useEffect(() => { localStorage.setItem('gsc_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('gsc_study_logs', JSON.stringify(studyLogs)); }, [studyLogs]);

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
    const kuotaSkd = customKuota * 3; // Aturan 3x formasi ke SKB
    const rasioKeketatan = customKuota > 0 ? (customPelamar / customKuota).toFixed(1) : '0';
    // Distribusi skor pembanding berbasis kurva normal simulasi (mean 355, std 42)
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

  // --- MODULE 13: TRYOUT CAT ENGINE ---
  const [tryoutMode, setTryoutMode] = useState<'lobby' | 'exam' | 'review'>('lobby');
  const [selectedPaket, setSelectedPaket] = useState<'Semua' | 'Harian' | 'Mingguan' | 'Bulanan'>('Semua');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(1800);
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

  const startTryout = (paket: 'Semua' | 'Harian' | 'Mingguan' | 'Bulanan') => {
    const filtered = paket === 'Semua' ? QUESTION_BANK : QUESTION_BANK.filter((q) => q.paket === paket);
    const qs = filtered.length > 0 ? filtered : QUESTION_BANK;
    setSelectedPaket(paket);
    setExamQuestions(qs);
    setCurrentIdx(0);
    setAnswers({});
    setFlagged({});
    setSecondsLeft(qs.length * 90);
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

    // Skala proporsional jika paket mini agar selaras dengan standar PG 110 soal
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
      paket: `Tryout CAT (${selectedPaket})`,
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
      text: `Halo ${profile.nama}! Saya AI Tutor Ghifari Siap CPNS. Saya siap membantu menjelaskan konsep TWK/TIU/TKP berbasis regulasi resmi, memberi trik cepat berhitung TIU, membuat latihan soal baru, atau menyusun jadwal belajar sesuai target skor ${profile.targetSkor}. Apa yang ingin kita bahas hari ini?`
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
    const systemContext = `Anda adalah AI Tutor CPNS profesional pada aplikasi "Ghifari Siap CPNS". Peserta bernama ${profile.nama}, lulusan ${profile.pendidikan} ${profile.jurusan}, target skor ${profile.targetSkor}. Skor tryout terakhir: TWK ${latestScore?.twk || 0}, TIU ${latestScore?.tiu || 0}, TKP ${latestScore?.tkp || 0}. Aturan wajib: Jawab akurat berdasarkan UUD 1945, UU ASN No. 20/2023, dan KepmenPANRB No. 321/2024. Jangan mengarang aturan atau regulasi.`;

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
        // Offline / Fallback Rule-Based Academic Engine
        await new Promise((r) => setTimeout(r, 500));
        let reply = '';
        const low = promptText.toLowerCase();
        if (low.includes('analisis') || low.includes('kelemahan')) {
          reply = `**Analisis Kelemahan Berbasis Skor Terakhir (${latestScore?.total || 0}):**\n• **TWK (${latestScore?.twk || 0}/${config.pgTwk}):** Sudah melampaui ambang batas, namun perlu pendalaman pada studi kasus Pasal UUD 1945 & Integritas ASN.\n• **TIU (${latestScore?.tiu || 0}/${config.pgTiu}):** Tingkatkan kecepatan pada Penalaran Analitis & Perbandingan Kuantitatif (targetkan < 50 detik/soal).\n• **TKP (${latestScore?.tkp || 0}/${config.pgTkp}):** Fokus membedakan opsi poin 4 dan 5 pada aspek Anti-Radikalisme dan Pelayanan Publik berbasis SOP.`;
        } else if (low.includes('trik') || low.includes('tiu')) {
          reply = `**Trik Cepat TIU (Metode Eliminasi & Pecahan Istimewa):**\n1. **Deret Angka:** Cek selisih 1 tingkat dulu. Jika tidak konstan, cek selisih 2 tingkat atau pola lompat 1 suku (ganjil-genap terpisah).\n2. **Silogisme:** Coret term tengah yang sama. Jika salah satu premis memuat kata *"Sebagian/Beberapa"*, maka kesimpulan WAJIB memuat kata *"Sebagian/Beberapa"*.\n3. **Pecahan:** Hafalkan konversi 1/8 = 12,5%, 3/8 = 37,5%, 5/8 = 62,5%, 1/6 = 16,67%.`;
        } else if (low.includes('jadwal')) {
          reply = `**Rekomendasi Jadwal Belajar Harian (${profile.targetSoalHarian} Soal/Hari):**\n• **Senin & Kamis (TWK - 45 Menit):** Bedah 15 soal studi kasus Pancasila, UUD 1945 & BerAKHLAK + catat pasal kunci.\n• **Selasa & Jumat (TIU - 50 Menit):** Latihan 15 soal Numerik & Silogisme menggunakan stopwatch (maksimal 60 detik/soal).\n• **Rabu & Sabtu (TKP - 40 Menit):** Latihan 20 soal TKP dan evaluasi mengapa sebuah opsi bernilai 5 vs 4.\n• **Minggu (Simulasi CAT):** Ikuti paket Tryout Mingguan di menu Tryout Nasional.`;
        } else {
          reply = `Berdasarkan regulasi **${config.regulasi}**, seleksi SKD terdiri dari **TWK (${config.jumlahTwk} soal, PG ${config.pgTwk})**, **TIU (${config.jumlahTiu} soal, PG ${config.pgTiu})**, dan **TKP (${config.jumlahTkp} soal, PG ${config.pgTkp})** dalam waktu **${config.durasiMenit} menit**.\n\nUntuk jawaban AI generatif dinamis (pembuatan soal baru tak terbatas), Anda dapat memasukkan **Gemini API Key** pada menu *Pengaturan Tahun Seleksi*.`;
        }
        setAiMessages((prev) => [...prev, { role: 'ai', text: reply }]);
      }
    } catch {
      setAiMessages((prev) => [...prev, { role: 'ai', text: 'Terjadi kendala koneksi saat menghubungi layanan AI. Periksa API Key atau koneksi internet Anda.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  // --- MODULE 16: READINESS ANALYTICS ---
  const readiness = useMemo(() => {
    if (history.length === 0) {
      return {
        avgTwk: 0, avgTiu: 0, avgTkp: 0, avgTotal: 0,
        pgRate: 0, status: 'Belum siap', badgeColor: 'bg-rose-100 text-rose-700',
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
    let badgeColor = 'bg-rose-100 text-rose-700';
    if (avgTotal >= 410 && pgRate === 100) {
      status = 'Siap mengikuti simulasi seleksi';
      badgeColor = 'bg-emerald-100 text-emerald-700';
    } else if (avgTotal >= 370 && pgRate >= 50) {
      status = 'Hampir siap';
      badgeColor = 'bg-sky-100 text-sky-700';
    } else if (avgTotal >= 320) {
      status = 'Perlu peningkatan';
      badgeColor = 'bg-amber-100 text-amber-700';
    }

    const trend = history.length >= 2 ? history[history.length - 1].total - history[0].total : 10;
    const prediksiSkor = Math.min(550, Math.round(avgTotal + Math.max(5, trend * 0.4)));

    return {
      avgTwk, avgTiu, avgTkp, avgTotal, pgRate,
      status, badgeColor,
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
    { id: 'dashboard', label: 'Ringkasan & Kesiapan', icon: LayoutDashboard },
    { id: 'formasi', label: 'Rekomendasi Formasi', icon: Compass },
    { id: 'simulasi', label: 'Simulasi Peringkat', icon: BarChart3 },
    { id: 'tryout', label: 'Tryout Nasional CAT', icon: Award },
    { id: 'tutor', label: 'AI Tutor CPNS', icon: Brain },
    { id: 'materi', label: 'Materi Pembelajaran', icon: BookOpen },
    { id: 'target', label: 'Target & Kalender', icon: Calendar },
    { id: 'laporan', label: 'Laporan & Sertifikat PDF', icon: FileText },
    { id: 'pengaturan', label: 'Pengaturan Tahun Seleksi', icon: Settings }
  ];

  const latestReport = history[history.length - 1] || INITIAL_HISTORY[0];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* MOBILE HEADER */}
      <header className="lg:hidden no-print bg-gradient-to-r from-cyan-600 to-sky-700 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">G</div>
          <div>
            <h1 className="font-bold text-base leading-tight">Ghifari Siap CPNS</h1>
            <p className="text-[11px] text-cyan-100">Seleksi ASN Tahun {config.tahun}</p>
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
                Tahun Seleksi {config.tahun}
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

        <div className="p-4 m-3 rounded-2xl bg-sky-50 border border-sky-100">
          <div className="flex items-center justify-between text-xs font-semibold text-sky-900 mb-1">
            <span>Target Harian</span>
            <span>{todaySolved}/{profile.targetSoalHarian} Soal</span>
          </div>
          <div className="w-full h-2 bg-sky-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-sky-600 transition-all"
              style={{ width: `${Math.min(100, Math.round((todaySolved / profile.targetSoalHarian) * 100))}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Streak aktif: <strong className="text-orange-600">{streakDays} hari</strong>
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* TOP NOTIFICATION IF TARGET UNMET */}
        {todaySolved < profile.targetSoalHarian && (
          <div className="no-print bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-sm text-amber-900">
              <AlertTriangle size={18} className="text-amber-600 shrink-0" />
              <span>
                Target latihan harian belum tercapai ({todaySolved}/{profile.targetSoalHarian} soal). Selesaikan minimal{' '}
                <strong>{profile.targetSoalHarian - todaySolved} soal</strong> lagi hari ini!
              </span>
            </div>
            <button
              onClick={() => {
                setActiveTab('tryout');
                startTryout('Harian');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700"
            >
              Mulai Tryout Harian
            </button>
          </div>
        )}

        {/* TAB 1: DASHBOARD & ANALISIS KESIAPAN (MODUL 16) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
              <div>
                <span className="text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full font-semibold">
                  Dashboard Kesiapan SKD {config.tahun}
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold mt-2">{profile.nama}</h2>
                <p className="text-sky-100 text-sm mt-1">
                  {profile.pendidikan} {profile.jurusan} • Minat Lokasi: {profile.lokasiMinat}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[230px]">
                <p className="text-xs text-sky-100">Status Kesiapan Saat Ini</p>
                <p className="text-lg font-bold mt-0.5">{readiness.status}</p>
                <p className="text-[11px] text-sky-100 mt-1">*Indikator latihan, bukan jaminan kelulusan resmi BKN.</p>
              </div>
            </div>

            {/* METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Rata-rata Total SKD</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-extrabold text-slate-900">{readiness.avgTotal}</span>
                  <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg">
                    Target: {profile.targetSkor}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Prediksi realistis berikutnya: <strong>{readiness.prediksiSkor}</strong></p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Kelulusan Passing Grade</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-extrabold text-emerald-600">{readiness.pgRate}%</span>
                  <span className="text-xs text-slate-500">{history.length}x Tryout</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">PG: TWK {config.pgTwk} | TIU {config.pgTiu} | TKP {config.pgTkp}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Formasi Memenuhi Kualifikasi</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-extrabold text-cyan-600">
                    {evaluatedFormasi.filter((f) => f.memenuhi).length}
                  </span>
                  <span className="text-xs text-slate-500">dari {formasiList.length} formasi</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Jurusan: {profile.jurusan}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Streak Belajar Harian</p>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-extrabold text-orange-500 flex items-center gap-1">
                    <Flame size={26} /> {streakDays} Hari
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Hari ini: {todaySolved} soal dikerjakan</p>
              </div>
            </div>

            {/* ANALISIS KEKUATAN & KELEMAHAN + KONSISTENSI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-sky-600" />
                  Grafik Konsistensi Skor Tryout & Rata-Rata Kategori
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100">
                    <p className="text-xs text-slate-500">Rata-rata TWK</p>
                    <p className="text-xl font-extrabold text-sky-700">{readiness.avgTwk} <span className="text-xs font-normal text-slate-500">/ PG {config.pgTwk}</span></p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-100">
                    <p className="text-xs text-slate-500">Rata-rata TIU</p>
                    <p className="text-xl font-extrabold text-cyan-700">{readiness.avgTiu} <span className="text-xs font-normal text-slate-500">/ PG {config.pgTiu}</span></p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100">
                    <p className="text-xs text-slate-500">Rata-rata TKP</p>
                    <p className="text-xl font-extrabold text-indigo-700">{readiness.avgTkp} <span className="text-xs font-normal text-slate-500">/ PG {config.pgTkp}</span></p>
                  </div>
                </div>

                {/* VISUAL BAR HISTORY */}
                <div className="space-y-2 pt-2">
                  {history.map((h) => (
                    <div key={h.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{h.tanggal} — {h.paket}</span>
                        <span className="font-bold text-slate-800">{h.total} Poin ({h.lulusPG ? 'Lulus PG' : 'Belum PG'})</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-sky-600 rounded-full"
                          style={{ width: `${Math.min(100, Math.round((h.total / 550) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900">Diagnostik Materi & Rekomendasi</h3>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-800">Materi Paling Dikuasai</p>
                  <p className="text-sm font-bold text-emerald-950 mt-0.5">{readiness.strongest}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100">
                  <p className="text-xs font-semibold text-rose-800">Materi Perlu Ditingkatkan</p>
                  <p className="text-sm font-bold text-rose-950 mt-0.5">{readiness.weakest}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <p className="font-semibold text-slate-800">Rekomendasi Latihan Berikutnya:</p>
                  <p>1. Kerjakan paket latihan terfokus pada <strong>{readiness.weakest}</strong>.</p>
                  <p>2. Simulasikan peningkatan skor +15 poin pada formasi prioritas Anda.</p>
                </div>
                <button
                  onClick={() => setActiveTab('laporan')}
                  className="w-full py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Unduh Laporan Kesiapan PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REKOMENDASI FORMASI BERDASARKAN JURUSAN (MODUL 11) */}
        {activeTab === 'formasi' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Rekomendasi Formasi CPNS {config.tahun}</h2>
                  <p className="text-xs text-slate-500">
                    Pencocokan otomatis kualifikasi pendidikan & prioritas jurusan. Data ditandai jelas antara historis BKN dan simulasi proyeksi.
                  </p>
                </div>
              </div>

              {/* INPUT PROFIL KUALIFIKASI */}
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

              {/* FILTER BAR */}
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

            {/* LIST FORMASI */}
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

        {/* TAB 3: SIMULASI PERINGKAT & PERSAINGAN (MODUL 12) */}
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

            {/* HASIL SIMULASI */}
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

        {/* TAB 4: TRYOUT NASIONAL CAT (MODUL 13) */}
        {activeTab === 'tryout' && (
          <div className="space-y-6">
            {tryoutMode === 'lobby' && (
              <>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h2 className="text-xl font-extrabold text-slate-900">Tryout Nasional CAT BKN</h2>
                  <p className="text-xs text-slate-500">
                    Pilih paket simulasi berbasis waktu dengan sistem pemeringkatan nasional, pembahasan lengkap, dan sertifikat hasil.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    {(['Harian', 'Mingguan', 'Bulanan', 'Semua'] as const).map((pkt) => (
                      <div key={pkt} className="p-4 rounded-2xl border border-sky-100 bg-sky-50/50 flex flex-col justify-between gap-4">
                        <div>
                          <span className="text-[11px] font-bold uppercase text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                            Paket {pkt}
                          </span>
                          <h3 className="font-bold text-slate-900 mt-2">
                            {pkt === 'Semua' ? 'Simulasi Gabungan Lengkap' : `Tryout ${pkt} Terjadwal`}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            TWK, TIU, TKP • Sistem CAT Timer & Pembahasan Otomatis
                          </p>
                        </div>
                        <button
                          onClick={() => startTryout(pkt)}
                          className="w-full py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 flex items-center justify-center gap-1.5"
                        >
                          <Play size={14} /> Mulai Kerjakan
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

                {/* QUESTION BODY */}
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

                {/* NAVIGATION */}
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

                  <div className="flex flex-wrap gap-1.5">
                    {examQuestions.map((q, idx) => {
                      const isAns = answers[q.id] !== undefined;
                      const isFlag = flagged[q.id];
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIdx(idx)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold ${
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

                {/* PEMBAHASAN SOAL */}
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

        {/* TAB 5: AI TUTOR CPNS (MODUL 14) */}
        {activeTab === 'tutor' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[620px]">
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                  <Brain size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">AI Tutor Ghifari Siap CPNS</h2>
                  <p className="text-[11px] text-slate-500">Berbasis Regulasi Resmi ASN & Kisi-Kisi SKD</p>
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
                placeholder="Tanyakan pasal UUD 1945, trik TIU, contoh soal TKP, atau rekomendasi materi..."
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

        {/* TAB 6: MATERI PEMBELAJARAN (MODUL 15) */}
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

        {/* TAB 7: TARGET & KALENDER BELAJAR (MODUL 17) */}
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
              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-2">Catat latihan mandiri hari ini:</p>
                <button
                  onClick={() => logExtraPractice(10)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  + Tambah 10 Soal Selesai Hari Ini
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

        {/* TAB 8: HASIL & LAPORAN PDF (MODUL 18) */}
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

            {/* PRINTABLE REPORT SHEET */}
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

        {/* TAB 9: PENGATURAN TAHUN SELEKSI & APPS SCRIPT (MODUL 19) */}
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
                  <label className="text-xs font-semibold text-slate-600">URL Web App Google Apps Script (Code.gs)</label>
                  <input
                    type="url"
                    value={config.gasUrl}
                    onChange={(e) => setConfig({ ...config, gasUrl: e.target.value })}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
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

            {/* TAMBAH FORMASI TAHUN BARU */}
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
