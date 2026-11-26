export interface Question {
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

// Seeded PRNG (Mulberry32) agar urutan soal & opsi konsisten dan tidak berulang
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeOptions(
  correctText: string,
  distractors: string[],
  seed: number
): { label: string; text: string; skor: number }[] {
  const raw = [
    { text: correctText, skor: 5 },
    ...distractors.slice(0, 4).map((d) => ({ text: d, skor: 0 }))
  ];
  const shuffled = shuffleWithSeed(raw, seed);
  const labels = ['A', 'B', 'C', 'D', 'E'];
  return shuffled.map((item, idx) => ({
    label: labels[idx],
    text: item.text,
    skor: item.skor
  }));
}

function makeTkpOptions(
  opt5: string,
  opt4: string,
  opt3: string,
  opt2: string,
  opt1: string,
  seed: number
): { label: string; text: string; skor: number }[] {
  const raw = [
    { text: opt5, skor: 5 },
    { text: opt4, skor: 4 },
    { text: opt3, skor: 3 },
    { text: opt2, skor: 2 },
    { text: opt1, skor: 1 }
  ];
  const shuffled = shuffleWithSeed(raw, seed);
  const labels = ['A', 'B', 'C', 'D', 'E'];
  return shuffled.map((item, idx) => ({
    label: labels[idx],
    text: item.text,
    skor: item.skor
  }));
}

// ============================================================================
// GENERATOR 400 SOAL TWK BERVARIASI (Pancasila, UUD 1945, NKRI, Bhinneka,
// Integritas/Antikorupsi, Bela Negara, Nasionalisme, Bahasa Indonesia EYD V)
// ============================================================================
function generateTwkQuestions(): Question[] {
  const list: Question[] = [];
  const pakets: ('Harian' | 'Mingguan' | 'Bulanan')[] = ['Harian', 'Mingguan', 'Bulanan'];
  const tingkats: ('Dasar' | 'Menengah' | 'HOTS')[] = ['Dasar', 'Menengah', 'HOTS'];

  // 1. Bank Kasus Pancasila (80 soal unik)
  const pancasilaCases = [
    {
      sila: 'Sila Pertama (Ketuhanan Yang Maha Esa)',
      pasal: 'Pasal 29 Ayat (2) UUD 1945 & Tap MPR No. I/MPR/2003',
      kasus: 'menjamin kebebasan rekan kerja berbeda keyakinan untuk melaksanakan ibadah di sela jam kerja tanpa diskriminasi jadwal rapat',
      distractor: ['Sila Kedua (Kemanusiaan yang Adil dan Beradab)', 'Sila Ketiga (Persatuan Indonesia)', 'Sila Keempat (Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan)', 'Sila Kelima (Keadilan Sosial bagi Seluruh Rakyat Indonesia)']
    },
    {
      sila: 'Sila Kedua (Kemanusiaan yang Adil dan Beradab)',
      pasal: 'Tap MPR No. I/MPR/2003 Butir Pengamalan Sila ke-2',
      kasus: 'memperlakukan setiap pemohon layanan publik sesuai harkat dan martabat manusia tanpa membeda-bedakan status sosial maupun latar belakang keluarga',
      distractor: ['Sila Pertama (Ketuhanan Yang Maha Esa)', 'Sila Ketiga (Persatuan Indonesia)', 'Sila Keempat (Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan)', 'Sila Kelima (Keadilan Sosial bagi Seluruh Rakyat Indonesia)']
    },
    {
      sila: 'Sila Ketiga (Persatuan Indonesia)',
      pasal: 'Tap MPR No. I/MPR/2003 Butir Pengamalan Sila ke-3',
      kasus: 'menempatkan persatuan, kesatuan, serta kepentingan keselamatan bangsa di atas kepentingan pribadi atau golongan saat terjadi konflik kebijakan antarwilayah',
      distractor: ['Sila Pertama (Ketuhanan Yang Maha Esa)', 'Sila Kedua (Kemanusiaan yang Adil dan Beradab)', 'Sila Keempat (Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan)', 'Sila Kelima (Keadilan Sosial bagi Seluruh Rakyat Indonesia)']
    },
    {
      sila: 'Sila Keempat (Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan)',
      pasal: 'Tap MPR No. I/MPR/2003 Butir Pengamalan Sila ke-4',
      kasus: 'tidak memaksakan kehendak dalam forum rapat koordinasi dan melaksanakan hasil keputusan musyawarah mufakat dengan penuh itikad baik',
      distractor: ['Sila Pertama (Ketuhanan Yang Maha Esa)', 'Sila Kedua (Kemanusiaan yang Adil dan Beradab)', 'Sila Ketiga (Persatuan Indonesia)', 'Sila Kelima (Keadilan Sosial bagi Seluruh Rakyat Indonesia)']
    },
    {
      sila: 'Sila Kelima (Keadilan Sosial bagi Seluruh Rakyat Indonesia)',
      pasal: 'Tap MPR No. I/MPR/2003 Butir Pengamalan Sila ke-5',
      kasus: 'menjaga keseimbangan antara hak dan kewajiban serta menghindari perilaku pemborosan anggaran maupun gaya hidup mewah sebagai aparatur negara',
      distractor: ['Sila Pertama (Ketuhanan Yang Maha Esa)', 'Sila Kedua (Kemanusiaan yang Adil dan Beradab)', 'Sila Ketiga (Persatuan Indonesia)', 'Sila Keempat (Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan)']
    }
  ];

  const instansiKonteks = [
    'Dinas Perindustrian dan Perdagangan', 'Kantor Pelayanan Perbendaharaan Negara', 'Balai Besar Standardisasi dan Pelayanan Jasa Industri',
    'Dinas Tenaga Kerja dan Transmigrasi', 'Kantor Pertanahan Kabupaten', 'Unit Pelayanan Terpadu Satu Pintu (PTSP)',
    'Balai Pengawasan Ketenagakerjaan Wilayah', 'Dinas Pekerjaan Umum dan Tata Ruang', 'Kantor Imigrasi Kelas I',
    'Sekretariat Daerah Provinsi', 'Badan Perencanaan Pembangunan Daerah', 'Dinas Koperasi dan UKM',
    'Balai Riset Material dan Manufaktur', 'Kantor Pelayanan Pajak Pratama', 'Dinas Lingkungan Hidup Daerah',
    'Inspektorat Jenderal Kementerian'
  ];

  for (let i = 0; i < 80; i++) {
    const c = pancasilaCases[i % pancasilaCases.length];
    const inst = instansiKonteks[i % instansiKonteks.length];
    const aktor = ['seorang analis kebijakan', 'seorang pejabat fungsional', 'seorang ketua tim kerja', 'seorang petugas pelayanan publik', 'seorang auditor internal'][i % 5];
    const nomorKasus = i + 1;
    list.push({
      id: `TWK-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TWK',
      subMateri: 'Pancasila & Pengamalan',
      tingkat: tingkats[i % 3],
      paket: pakets[i % 3],
      soal: `[Studi Kasus Pancasila #${nomorKasus}] Di lingkungan ${inst}, ${aktor} secara konsisten ${c.kasus}. Tindakan nyata tersebut merupakan wujud pengamalan nilai Pancasila khususnya...`,
      opsi: makeOptions(c.sila, c.distractor, 100 + i),
      pembahasan: `Perilaku ${c.kasus} secara langsung mencerminkan butir-butir ${c.sila}.`,
      referensi: c.pasal
    });
  }

  // 2. Bank Pasal & Ketatanegaraan UUD 1945 (80 soal unik)
  const uudFacts = [
    {
      pasal: 'Pasal 1 Ayat (3) UUD 1945',
      tanya: 'penegasan bahwa Negara Indonesia adalah negara hukum (rechtsstaat) dan bukan berdasarkan kekuasaan belaka (machtsstaat)',
      benar: 'Pasal 1 Ayat (3) UUD NRI Tahun 1945',
      salah: ['Pasal 1 Ayat (1) UUD NRI Tahun 1945', 'Pasal 2 Ayat (1) UUD NRI Tahun 1945', 'Pasal 4 Ayat (1) UUD NRI Tahun 1945', 'Pasal 27 Ayat (1) UUD NRI Tahun 1945']
    },
    {
      pasal: 'Pasal 7A & 7B UUD 1945',
      tanya: 'mekanisme pemberhentian Presiden dan/atau Wakil Presiden dalam masa jabatannya oleh MPR atas usul DPR setelah melalui putusan Mahkamah Konstitusi',
      benar: 'Pasal 7A dan Pasal 7B UUD NRI Tahun 1945',
      salah: ['Pasal 6A dan Pasal 7 UUD NRI Tahun 1945', 'Pasal 8 dan Pasal 9 UUD NRI Tahun 1945', 'Pasal 20 dan Pasal 20A UUD NRI Tahun 1945', 'Pasal 24A dan Pasal 24B UUD NRI Tahun 1945']
    },
    {
      pasal: 'Pasal 18B Ayat (2) UUD 1945',
      tanya: 'pengakuan dan penghormatan negara terhadap kesatuan-kesatuan masyarakat hukum adat beserta hak-hak tradisionalnya sepanjang masih hidup dan sesuai prinsip NKRI',
      benar: 'Pasal 18B Ayat (2) UUD NRI Tahun 1945',
      salah: ['Pasal 18 Ayat (1) UUD NRI Tahun 1945', 'Pasal 28I Ayat (3) UUD NRI Tahun 1945', 'Pasal 32 Ayat (1) UUD NRI Tahun 1945', 'Pasal 33 Ayat (3) UUD NRI Tahun 1945']
    },
    {
      pasal: 'Pasal 20 Ayat (5) UUD 1945',
      tanya: 'ketentuan bahwa RUU yang telah disetujui bersama DPR dan Presiden sah menjadi undang-undang dan wajib diundangkan apabila dalam 30 hari tidak disahkan Presiden',
      benar: 'Pasal 20 Ayat (5) UUD NRI Tahun 1945',
      salah: ['Pasal 20 Ayat (2) UUD NRI Tahun 1945', 'Pasal 21 Ayat (1) UUD NRI Tahun 1945', 'Pasal 22 Ayat (1) UUD NRI Tahun 1945', 'Pasal 22D Ayat (2) UUD NRI Tahun 1945']
    },
    {
      pasal: 'Pasal 22E Ayat (1) UUD 1945',
      tanya: 'asas penyelenggaraan pemilihan umum di Indonesia yaitu langsung, umum, bebas, rahasia, jujur, dan adil (Luber Jurdil) setiap lima tahun sekali',
      benar: 'Pasal 22E Ayat (1) UUD NRI Tahun 1945',
      salah: ['Pasal 22D Ayat (1) UUD NRI Tahun 1945', 'Pasal 23E Ayat (1) UUD NRI Tahun 1945', 'Pasal 24C Ayat (1) UUD NRI Tahun 1945', 'Pasal 28E Ayat (3) UUD NRI Tahun 1945']
    },
    {
      pasal: 'Pasal 23E Ayat (1) UUD 1945',
      tanya: 'keberadaan Badan Pemeriksa Keuangan (BPK) yang bebas dan mandiri untuk memeriksa pengelolaan dan tanggung jawab tentang keuangan negara',
      benar: 'Pasal 23E Ayat (1) UUD NRI Tahun 1945',
      salah: ['Pasal 23 Ayat (1) UUD NRI Tahun 1945', 'Pasal 23D UUD NRI Tahun 1945', 'Pasal 24A Ayat (1) UUD NRI Tahun 1945', 'Pasal 33 Ayat (4) UUD NRI Tahun 1945']
    },
    {
      pasal: 'Pasal 24B Ayat (1) UUD 1945',
      tanya: 'kewenangan Komisi Yudisial yang bersifat mandiri untuk mengusulkan pengangkatan hakim agung serta menjaga dan menegakkan kehormatan dan perilaku hakim',
      benar: 'Pasal 24B Ayat (1) UUD NRI Tahun 1945',
      salah: ['Pasal 24A Ayat (2) UUD NRI Tahun 1945', 'Pasal 24C Ayat (2) UUD NRI Tahun 1945', 'Pasal 25 UUD NRI Tahun 1945', 'Pasal 28D Ayat (1) UUD NRI Tahun 1945']
    },
    {
      pasal: 'Pasal 31 Ayat (4) UUD 1945',
      tanya: 'kewajiban negara memprioritaskan anggaran pendidikan sekurang-kurangnya dua puluh persen (20%) dari APBN serta dari APBD',
      benar: 'Pasal 31 Ayat (4) UUD NRI Tahun 1945',
      salah: ['Pasal 31 Ayat (1) UUD NRI Tahun 1945', 'Pasal 32 Ayat (2) UUD NRI Tahun 1945', 'Pasal 33 Ayat (2) UUD NRI Tahun 1945', 'Pasal 34 Ayat (2) UUD NRI Tahun 1945']
    },
    {
      pasal: 'Pasal 33 Ayat (3) UUD 1945',
      tanya: 'prinsip bahwa bumi dan air dan kekayaan alam yang terkandung di dalamnya dikuasai oleh negara dan dipergunakan untuk sebesar-besar kemakmuran rakyat',
      benar: 'Pasal 33 Ayat (3) UUD NRI Tahun 1945',
      salah: ['Pasal 33 Ayat (1) UUD NRI Tahun 1945', 'Pasal 33 Ayat (2) UUD NRI Tahun 1945', 'Pasal 34 Ayat (1) UUD NRI Tahun 1945', 'Pasal 28H Ayat (1) UUD NRI Tahun 1945']
    },
    {
      pasal: 'Pasal 37 Ayat (5) UUD 1945',
      tanya: 'ketentuan khusus bahwa mengenai bentuk Negara Kesatuan Republik Indonesia tidak dapat dilakukan perubahan melalui mekanisme amandemen',
      benar: 'Pasal 37 Ayat (5) UUD NRI Tahun 1945',
      salah: ['Pasal 37 Ayat (1) UUD NRI Tahun 1945', 'Pasal 37 Ayat (3) UUD NRI Tahun 1945', 'Pasal 1 Ayat (1) UUD NRI Tahun 1945', 'Pasal 25A UUD NRI Tahun 1945']
    }
  ];

  const konteksUud = [
    'Dalam penyusunan naskah akademik peraturan daerah',
    'Pada saat uji kompetensi pejabat fungsional analis hukum',
    'Dalam pembahasan rancangan kebijakan publik tingkat kementerian',
    'Pada simulasi sidang ketatanegaraan aparatur sipil negara',
    'Dalam kajian evaluasi regulasi penyelenggaraan pemerintahan',
    'Pada forum diskusi reformasi birokrasi dan konstitusi',
    'Dalam penyusunan pedoman tata kelola kelembagaan negara',
    'Pada evaluasi kepatuhan hukum administrasi pemerintahan'
  ];

  for (let i = 0; i < 80; i++) {
    const f = uudFacts[i % uudFacts.length];
    const k = konteksUud[Math.floor(i / uudFacts.length) % konteksUud.length];
    list.push({
      id: `TWK-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TWK',
      subMateri: 'UUD 1945 & Konstitusi',
      tingkat: tingkats[(i + 1) % 3],
      paket: pakets[(i + 1) % 3],
      soal: `[Konstitusi #${i + 1}] ${k}, dasar konstitusional yang mengatur ${f.tanya} tercantum secara eksplisit pada...`,
      opsi: makeOptions(f.benar, f.salah, 500 + i),
      pembahasan: `Ketentuan mengenai ${f.tanya} diatur secara jelas dalam ${f.pasal}.`,
      referensi: f.pasal
    });
  }

  // 3. Integritas, ASN BerAKHLAK & Antikorupsi (80 soal unik)
  const integritasCases = [
    {
      tema: 'Konflik Kepentingan & Gratifikasi',
      skenario: 'menolak parsel lebaran bernilai jutaan rupiah dari rekanan penyedia barang jasa meskipun dikirim ke alamat rumah pribadi di luar jam kantor',
      benar: 'Melaporkan atau menolak pemberian tersebut karena berhubungan dengan jabatan dan berpotensi menimbulkan konflik kepentingan',
      salah: [
        'Menerimanya secara diam-diam asalkan tidak memengaruhi keputusan proyek berikutnya',
        'Membagikannya kepada seluruh staf kantor agar tidak dinikmati secara pribadi',
        'Menyimpannya terlebih dahulu dan baru melapor jika ada pemeriksaan inspektorat',
        'Menganggapnya sebagai tanda terima kasih wajar atas kerja sama profesional'
      ],
      ref: 'UU No. 20 Tahun 2001 Pasal 12B & Pedoman Pengendalian Gratifikasi KPK'
    },
    {
      tema: 'Core Values ASN BerAKHLAK - Akuntabel',
      skenario: 'menggunakan fasilitas kendaraan dinas dan anggaran perjalanan dinas hanya untuk kepentingan tugas kedinasan sesuai bukti pertanggungjawaban riil',
      benar: 'Akuntabel (menggunakan kekayaan dan barang milik negara secara bertanggung jawab, efektif, dan efisien)',
      salah: [
        'Adaptif terhadap perubahan lingkungan kerja',
        'Harmonis dalam membangun lingkungan kerja kondusif',
        'Kompeten dalam mengembangkan kapabilitas diri',
        'Kolaboratif dengan berbagai pemangku kepentingan'
      ],
      ref: 'SE MenPANRB No. 20 Tahun 2021 tentang Implementasi Core Values ASN BerAKHLAK'
    },
    {
      tema: 'Nilai Antikorupsi KPK - Kemandirian & Tanggung Jawab',
      skenario: 'menyelesaikan seluruh audit lapangan tanpa bergantung pada fasilitas akomodasi yang disediakan pihak terperiksa',
      benar: 'Kemandirian dan integritas untuk menjaga objektivitas serta independensi hasil pemeriksaan',
      salah: [
        'Efisiensi anggaran instansi dengan memanfaatkan fasilitas pihak ketiga',
        'Fleksibilitas kerja sama antara auditor dan objek pemeriksaan',
        'Loyalitas terhadap pimpinan unit kerja setempat',
        'Kepatuhan administratif terhadap jadwal kunjungan lapangan'
      ],
      ref: '9 Nilai Antikorupsi KPK (Jujur, Peduli, Mandiri, Disiplin, Tanggung Jawab, Kerja Keras, Sederhana, Berani, Adil)'
    },
    {
      tema: 'Netralitas ASN dalam Pemilu/Pilkada',
      skenario: 'tidak memberikan tanda suka (like), komentar dukungan, maupun membagikan unggahan kampanye salah satu bakal calon kepala daerah di media sosial pribadi',
      benar: 'Menjaga asas netralitas ASN agar tidak berpihak dari segala bentuk pengaruh manapun dan tidak memihak kepada kepentingan siapapun',
      salah: [
        'Membatasi hak berpendapat warga negara di ruang digital',
        'Menghindari interaksi sosial dengan masyarakat di daerah pemilihan',
        'Menunggu pengumuman resmi masa tenang sebelum menghapus unggahan dukungan',
        'Menggunakan akun anonim agar tetap dapat menyalurkan aspirasi politik secara terbuka'
      ],
      ref: 'UU No. 20 Tahun 2023 tentang ASN Pasal 2 huruf f & SKB Netralitas ASN'
    }
  ];

  const jabatanIntegritas = [
    'Pejabat Pembuat Komitmen (PPK)', 'Auditor Ahli Pertama', 'Pengawas Ketenagakerjaan', 'Pembina Industri',
    'Analis Anggaran', 'Petugas Bea dan Cukai', 'Inspektur Tambang', 'Analis Sumber Daya Manusia Aparatur',
    'Perencana Ahli Pertama', 'Pranata Komputer', 'Pengelola Pengadaan Barang/Jasa', 'Penilai Pajak',
    'Mediator Hubungan Industrial', 'Perekayasa Ahli Pertama', 'Analis Kebijakan', 'Penyuluh Antikorupsi',
    'Kepala Subbagian Umum', 'Bendahara Pengeluaran', 'Verifikator Keuangan', 'Sekretaris Tim Lelang'
  ];

  for (let i = 0; i < 80; i++) {
    const ic = integritasCases[i % integritasCases.length];
    const jab = jabatanIntegritas[i % jabatanIntegritas.length];
    list.push({
      id: `TWK-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TWK',
      subMateri: 'Integritas & Antikorupsi',
      tingkat: tingkats[(i + 2) % 3],
      paket: pakets[(i + 2) % 3],
      soal: `[Integritas ASN #${i + 1}] Sebagai seorang ${jab}, Anda dihadapkan pada situasi untuk ${ic.skenario}. Prinsip utama yang mendasari sikap berintegritas tersebut adalah...`,
      opsi: makeOptions(ic.benar, ic.salah, 900 + i),
      pembahasan: `${ic.benar}. Hal ini sejalan dengan standar etik dan regulasi kepegawaian nasional.`,
      referensi: ic.ref
    });
  }

  // 4. NKRI, Bhinneka Tunggal Ika, Bela Negara & Sejarah (80 soal unik)
  const nkriCases = [
    {
      sub: 'NKRI & Otonomi Daerah',
      tanya: 'urusan pemerintahan absolut yang sepenuhnya menjadi kewenangan Pemerintah Pusat menurut Pasal 10 UU No. 23 Tahun 2014',
      benar: 'Politik luar negeri, pertahanan, keamanan, yustisi, moneter dan fiskal nasional, serta agama',
      salah: [
        'Pendidikan menengah, kesehatan masyarakat, pekerjaan umum, dan perumahan rakyat',
        'Perhubungan daerah, lingkungan hidup, pertanahan, dan pemberdayaan perempuan',
        'Ketenagakerjaan, koperasi dan usaha kecil menengah, penanaman modal, serta pariwisata',
        'Kelautan dan perikanan, pertanian, kehutanan, serta energi dan sumber daya mineral daerah'
      ],
      ref: 'UU No. 23 Tahun 2014 tentang Pemerintahan Daerah Pasal 10'
    },
    {
      sub: 'Bhinneka Tunggal Ika',
      tanya: 'implementasi prinsip persatuan dalam keberagaman (Bhinneka Tunggal Ika) pada perumusan kebijakan pelayanan publik di daerah multikultural',
      benar: 'Menyusun standar pelayanan inklusif yang menghormati kearifan lokal tanpa mendiskriminasi kelompok minoritas maupun pendatang',
      salah: [
        'Mewajibkan penggunaan satu bahasa daerah tertentu dalam seluruh dokumen administrasi resmi',
        'Memberikan kuota layanan khusus hanya bagi penduduk asli daerah setempat',
        'Menyeragamkan seluruh tradisi lokal agar sesuai dengan budaya ibu kota negara',
        'Memisahkan loket pelayanan berdasarkan latar belakang suku dan asal daerah pemohon'
      ],
      ref: 'PP No. 66 Tahun 1951 & Wawasan Kebangsaan NKRI'
    },
    {
      sub: 'Bela Negara',
      tanya: 'wujud nyata nilai dasar Bela Negara "Rela berkorban untuk bangsa dan negara" bagi seorang ASN di era modern',
      benar: 'Bersedia ditempatkan di wilayah tertinggal, terdepan, dan terluar (3T) serta mendahulukan tugas negara di atas kepentingan pribadi saat terjadi darurat publik',
      salah: [
        'Menolak mutasi ke luar pulau karena merasa sudah nyaman dengan unit kerja saat ini',
        'Hanya bersedia bekerja lembur apabila mendapatkan kompensasi honorarium tambahan di luar ketentuan',
        'Membatasi kolaborasi dengan instansi lain demi menjaga rahasia kinerja unit sendiri',
        'Mengutamakan penyelesaian urusan bisnis pribadi di sela jam pelayanan masyarakat'
      ],
      ref: 'UU No. 23 Tahun 2019 tentang Pengelolaan Sumber Daya Nasional untuk Pertahanan Negara'
    },
    {
      sub: 'Nasionalisme & Sejarah',
      tanya: 'makna strategis Sumpah Pemuda 28 Oktober 1928 bagi penguatan birokrasi nasional Indonesia masa kini',
      benar: 'Meneguhkan bahasa Indonesia sebagai bahasa pemersatu administrasi negara dan menanggalkan ego kedaerahan demi kemajuan bangsa',
      salah: [
        'Menghapus seluruh bahasa daerah dari kurikulum pendidikan dan komunikasi masyarakat',
        'Membatasi pertukaran pegawai antarprovinsi agar budaya lokal tetap terjaga murni',
        'Memusatkan seluruh kewenangan pembangunan hanya di Pulau Jawa',
        'Mengutamakan organisasi kepemudaan berbasis kedaerahan dalam rekrutmen aparatur'
      ],
      ref: 'Kongres Pemuda II (28 Oktober 1928)'
    }
  ];

  const wilayahNkri = [
    'Wilayah Perbatasan Kalimantan Utara', 'Kepulauan Natuna dan Anambas', 'Kawasan Timur Indonesia (Papua & Maluku)',
    'Wilayah Pesisir Selatan Jawa Barat', 'Kawasan Industri Cikarang dan Karawang', 'Wilayah Kepulauan Nusa Tenggara',
    'Kawasan Danau Toba Sumatera Utara', 'Wilayah Perbatasan Atambua NTT', 'Kawasan Ibu Kota Nusantara (IKN)',
    'Wilayah Pegunungan Tengah Sulawesi', 'Kawasan Ekonomi Khusus Batam', 'Wilayah Pesisir Utara Jawa',
    'Kepulauan Sangihe dan Talaud', 'Kawasan Wisata Super Prioritas Labuan Bajo', 'Wilayah Transmigrasi Kalimantan Tengah',
    'Kawasan Industri Gresik dan Surabaya', 'Wilayah Sabang Aceh', 'Kawasan Selatan Garut dan Tasikmalaya',
    'Wilayah Kepulauan Bangka Belitung', 'Kawasan Halmahera Maluku Utara'
  ];

  for (let i = 0; i < 80; i++) {
    const nc = nkriCases[i % nkriCases.length];
    const wil = wilayahNkri[i % wilayahNkri.length];
    list.push({
      id: `TWK-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TWK',
      subMateri: nc.sub,
      tingkat: tingkats[i % 3],
      paket: pakets[i % 3],
      soal: `[Wawasan Kebangsaan #${i + 1}] Dalam konteks penguatan tata kelola pemerintahan di ${wil}, hal yang paling tepat menggambarkan ${nc.tanya} adalah...`,
      opsi: makeOptions(nc.benar, nc.salah, 1300 + i),
      pembahasan: `${nc.benar}. Konsep ini menjadi pilar utama keutuhan Negara Kesatuan Republik Indonesia.`,
      referensi: nc.ref
    });
  }

  // 5. Bahasa Indonesia Resmi & EYD Edisi V (80 soal unik)
  const eydCases = [
    {
      topik: 'Penulisan Kata Baku & Serapan',
      benar: 'analisis, sistem, kualitas, risiko, jadwal, teknik, apotek, praktik',
      salah: [
        'analisa, sistim, kwalitas, resiko, jadual, tehnik, apotik, praktek',
        'analisis, sistim, kualitas, risiko, jadual, teknik, apotek, praktek',
        'analisa, sistem, kualitas, resiko, jadwal, tehnik, apotik, praktik',
        'analisis, sistem, kwalitas, risiko, jadwal, teknik, apotik, praktek'
      ]
    },
    {
      topik: 'Penulisan Unsur Terikat & Imbuhan',
      benar: 'pascasarjana, nonaktif, subbagian, antarkementerian, ekstrakurikuler, semiprofesional',
      salah: [
        'pasca sarjana, non aktif, sub bagian, antar kementerian, ekstra kurikuler, semi profesional',
        'pasca-sarjana, non-aktif, sub-bagian, antar-kementerian, ekstra-kurikuler, semi-profesional',
        'pascasarjana, non aktif, sub bagian, antarkementerian, ekstra kurikuler, semiprofesional',
        'pasca sarjana, nonaktif, subbagian, antar kementerian, ekstrakurikuler, semi profesional'
      ]
    },
    {
      topik: 'Penulisan Gelar Akademik & Jabatan',
      benar: 'Dr. Ir. Mochammad Djawari Al Ghifari, S.T., M.T.',
      salah: [
        'Dr. Ir. Mochammad Djawari Al Ghifari, ST., MT.',
        'DR. Ir. Mochammad Djawari Al Ghifari S.T., M.T.',
        'Dr. Ir, Mochammad Djawari Al Ghifari, S.T, M.T',
        'Drs. Ir. Mochammad Djawari Al Ghifari, S.T., M.T'
      ]
    },
    {
      topik: 'Kalimat Efektif dalam Naskah Dinas',
      benar: 'Para kepala dinas diharapkan hadir tepat waktu pada rapat koordinasi besok pagi.',
      salah: [
        'Kepada para kepala-kepala dinas diharapkan kehadirannya tepat waktu pada rapat koordinasi besok pagi.',
        'Bagi para kepala dinas semuanya diharapkan hadir tepat waktu di rapat koordinasi besok pagi.',
        'Para kepala dinas-kepala dinas diharapkan untuk dapat hadir tepat waktu pada rapat besok pagi.',
        'Kepada Yth. para kepala dinas diharapkan hadir tepat waktu pada rapat koordinasi besok pagi hari.'
      ]
    }
  ];

  const nomorNaskah = Array.from({ length: 20 }, (_, idx) => `ND-${101 + idx}/SJ.2/2026`);
  for (let i = 0; i < 80; i++) {
    const ec = eydCases[i % eydCases.length];
    const nd = nomorNaskah[i % nomorNaskah.length];
    list.push({
      id: `TWK-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TWK',
      subMateri: 'Bahasa Indonesia (EYD V)',
      tingkat: tingkats[(i + 1) % 3],
      paket: pakets[(i + 1) % 3],
      soal: `[Tata Bahasa Dinas #${i + 1} | Dokumen ${nd}] Berdasarkan kaidah Ejaan Bahasa Indonesia yang Disempurnakan (EYD Edisi V) dan Pedoman Tata Naskah Dinas (${ec.topik}), penulisan yang paling tepat adalah...`,
      opsi: makeOptions(ec.benar, ec.salah, 1700 + i),
      pembahasan: `Sesuai kaidah EYD Edisi V (Permendikbudristek) dan KBBI V, bentuk yang tepat dan efektif adalah: "${ec.benar}".`,
      referensi: 'EYD Edisi V & Peraturan ANRI No. 5 Tahun 2021'
    });
  }

  return list;
}

// ============================================================================
// GENERATOR 400 SOAL TIU BERVARIASI (Verbal Analogi, Silogisme, Analitis,
// Deret Angka, Berhitung Cepat, Perbandingan Senilai/Berbalik, P vs Q,
// Kecepatan/Jarak, Peluang/Kombinasi, Spasial Kubus 3D)
// ============================================================================
function generateTiuQuestions(): Question[] {
  const list: Question[] = [];
  const pakets: ('Harian' | 'Mingguan' | 'Bulanan')[] = ['Harian', 'Mingguan', 'Bulanan'];
  const tingkats: ('Dasar' | 'Menengah' | 'HOTS')[] = ['Dasar', 'Menengah', 'HOTS'];

  // 1. Analogi Verbal (50 soal unik)
  const analogiPairs = [
    ['KALIBRASI : AKURASI', 'VAKSINASI : IMUNITAS', ['KOROSI : LOGAM', 'INSPEKSI : KERUSAKAN', 'PRODUKSI : DISTRIBUSI', 'ANGGARAN : REALISASI'], 'Hubungan proses dan hasil positifnya'],
    ['ARSITEK : BLUEPRINT', 'SUTRADARA : SKENARIO', ['DOKTER : STETOSKOP', 'HAKIM : PENGADILAN', 'NELAYAN : JARING', 'PETANI : CANGKUL'], 'Hubungan profesi dan rancangan kerja utamanya'],
    ['KATALISATOR : REAKSI', 'PELUMAS : GESEKAN', ['GENERATOR : LISTRIK', 'TERMOMETER : SUHU', 'BAROMETER : TEKANAN', 'KOMPAS : ARAH'], 'Hubungan zat/alat yang memengaruhi laju/hambatan suatu proses'],
    ['FONDASI : GEDUNG', 'KONSTITUSI : NEGARA', ['ATAP : RUMAH', 'JENDELA : KAMAR', 'RODA : KENDARAAN', 'DAUN : POHON'], 'Hubungan dasar utama penopang berdirinya suatu sistem'],
    ['HIPOTESIS : PENELITIAN', 'DIAGNOSIS : PENGOBATAN', ['EKSPERIMEN : LABORATORIUM', 'JURNAL : PUBLIKASI', 'OBAT : APOTEK', 'PENYAKIT : RUMAH SAKIT'], 'Hubungan tahap analisis awal sebelum tindakan lanjutan'],
    ['BAJA : TAHAN KARAT', 'KACA : TEMBUS PANDANG', ['KAYU : TERBAKAR', 'AIR : MENGALIR', 'BESI : BERAT', 'KERTAS : TIPIS'], 'Hubungan material dan sifat fungsional unggulannya'],
    ['AUDITOR : LAPORAN KEUANGAN', 'KURATOR : KARYA SENI', ['KASIR : UANG TUNAI', 'SOPIR : KENDARAAN', 'GURU : SEKOLAH', 'KOKI : RESTORAN'], 'Hubungan profesi penilai/pengelola objek spesifik'],
    ['DEMOKRASI : RAKYAT', 'TEOKRASI : AGAMA', ['MONARKI : PARLEMEN', 'OLIGARKI : MILITER', 'ANARKI : HUKUM', 'BIROKRASI : PARTAI'], 'Hubungan sistem pemerintahan dan sumber otoritasnya'],
    ['PRESISI : TOLERANSI', 'EFISIENSI : PEMBOROSAN', ['AKURASI : KECEPATAN', 'KUALITAS : HARGA', 'VOLUME : MASSA', 'JARAK : WAKTU'], 'Hubungan sifat optimal dan hal yang diminimalkannya'],
    ['DEHIDRASI : CAIRAN', 'INFLASI : DAYA BELI', ['EVAPORASI : UAP', 'KONDENSASI : EMBUN', 'EKSPANSI : PASAR', 'INVESTASI : MODAL'], 'Hubungan fenomena kekurangan/penurunan dan aspek yang terdampak']
  ];

  for (let i = 0; i < 50; i++) {
    const [pair, benar, salah, rel] = analogiPairs[i % analogiPairs.length];
    const variasi = Math.floor(i / analogiPairs.length) + 1;
    list.push({
      id: `TIU-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TIU',
      subMateri: 'Verbal - Analogi Kata',
      tingkat: tingkats[i % 3],
      paket: pakets[i % 3],
      soal: `[Analogi Verbal #${i + 1} - Seri ${variasi}] Pilihlah pasangan kata yang memiliki hubungan analogis paling tepat dengan: ${pair} = ... : ...`,
      opsi: makeOptions(benar, salah, 2100 + i),
      pembahasan: `${rel}: ${pair} sejajar dengan ${benar}.`,
      referensi: 'TIU Verbal - Padanan Hubungan Kata'
    });
  }

  // 2. Silogisme & Logika Matematika (50 soal unik)
  const subjekList = ['insinyur mesin', 'analis kebijakan', 'auditor ahli', 'perencana anggaran', 'pranata komputer', 'pengawas industri', 'perekayasa madya', 'mediator industrial', 'verifikator keuangan', 'peneliti muda'];
  const syaratList = ['lulus uji kompetensi', 'memiliki sertifikat keahlian', 'mengikuti pelatihan dasar ASN', 'lulus evaluasi kinerja tahunan', 'menguasai analisis data'];
  const hakList = ['menandatangani dokumen teknis', 'mengakses sistem audit nasional', 'memimpin tim evaluasi proyek', 'menyusun rekomendasi kebijakan', 'mengajukan usulan anggaran'];
  const unitList = ['Direktorat Industri', 'Inspektorat Jenderal', 'Badan Perencanaan', 'Pusat Riset Manufaktur', 'Kantor Pelayanan Terpadu'];

  for (let i = 0; i < 50; i++) {
    const s = subjekList[i % subjekList.length];
    const sy = syaratList[i % syaratList.length];
    const h = hakList[i % hakList.length];
    const u = unitList[i % unitList.length];

    if (i % 2 === 0) {
      list.push({
        id: `TIU-${String(list.length + 1).padStart(4, '0')}`,
        kategori: 'TIU',
        subMateri: 'Verbal - Silogisme',
        tingkat: 'Menengah',
        paket: pakets[i % 3],
        soal: `[Silogisme #${i + 1}] Semua ${s} yang ${sy} berhak ${h}. Sebagian pegawai di ${u} adalah ${s} yang ${sy}. Simpulan yang paling tepat adalah...`,
        opsi: makeOptions(
          `Sebagian pegawai di ${u} berhak ${h}.`,
          [
            `Semua pegawai di ${u} berhak ${h}.`,
            `Tidak ada pegawai di ${u} yang berhak ${h}.`,
            `Semua yang berhak ${h} adalah pegawai di ${u}.`,
            `Sebagian yang tidak berhak ${h} adalah ${s} yang ${sy}.`
          ],
          2300 + i
        ),
        pembahasan: 'Premis universal (Semua A adalah B) digabung dengan premis partikular (Sebagian C adalah A) menghasilkan kesimpulan partikular: Sebagian C adalah B.',
        referensi: 'TIU Verbal - Silogisme Kategorik'
      });
    } else {
      list.push({
        id: `TIU-${String(list.length + 1).padStart(4, '0')}`,
        kategori: 'TIU',
        subMateri: 'Verbal - Logika Implikasi',
        tingkat: 'HOTS',
        paket: pakets[i % 3],
        soal: `[Logika Ekuivalensi #${i + 1}] Pernyataan: "Jika seluruh pegawai ${u} ${sy}, maka unit tersebut berhak ${h}." Ingkaran (negasi) yang logis dari pernyataan tersebut adalah...`,
        opsi: makeOptions(
          `Seluruh pegawai ${u} ${sy}, tetapi unit tersebut tidak berhak ${h}.`,
          [
            `Jika seluruh pegawai ${u} tidak ${sy}, maka unit tersebut tidak berhak ${h}.`,
            `Jika unit tersebut tidak berhak ${h}, maka seluruh pegawai ${u} tidak ${sy}.`,
            `Seluruh pegawai ${u} tidak ${sy} atau unit tersebut berhak ${h}.`,
            `Unit tersebut berhak ${h} meskipun pegawainya tidak ${sy}.`
          ],
          2400 + i
        ),
        pembahasan: 'Negasi dari implikasi (P → Q) adalah (P ∧ ~Q): premis P terjadi, namun konsekuensi Q tidak terjadi.',
        referensi: 'TIU Verbal - Negasi Implikasi'
      });
    }
  }

  // 3. Deret Angka Matematis Terverifikasi (80 soal unik)
  for (let i = 0; i < 80; i++) {
    const tipe = i % 4;
    let deretStr = '';
    let ans = 0;
    let exp = '';

    if (tipe === 0) {
      // Deret geometri bertingkat: a, a+d, a+3d, a+7d, a+15d -> next a+31d
      const a = 3 + (i % 15);
      const d = 2 + (i % 6);
      const s1 = a;
      const s2 = s1 + d;
      const s3 = s2 + 2 * d;
      const s4 = s3 + 4 * d;
      const s5 = s4 + 8 * d;
      ans = s5 + 16 * d;
      deretStr = `${s1}, ${s2}, ${s3}, ${s4}, ${s5}, ...`;
      exp = `Selisih antar suku berlipat dua: +${d}, +${2 * d}, +${4 * d}, +${8 * d}, sehingga berikutnya +${16 * d} -> ${s5} + ${16 * d} = ${ans}.`;
    } else if (tipe === 1) {
      // Deret selisih bertingkat konstan (aritmetika tingkat 2)
      const a = 5 + (i % 20);
      const b = 3 + (i % 7);
      const c = 2 + (i % 5);
      const s1 = a;
      const s2 = s1 + b;
      const s3 = s2 + (b + c);
      const s4 = s3 + (b + 2 * c);
      const s5 = s4 + (b + 3 * c);
      ans = s5 + (b + 4 * c);
      deretStr = `${s1}, ${s2}, ${s3}, ${s4}, ${s5}, ...`;
      exp = `Selisih tingkat pertama bertambah +${c} setiap langkah: +${b}, +${b + c}, +${b + 2 * c}, +${b + 3 * c}, lalu +${b + 4 * c} -> ${s5} + ${b + 4 * c} = ${ans}.`;
    } else if (tipe === 2) {
      // Deret Fibonacci modifikasi
      const s1 = 2 + (i % 8);
      const s2 = 3 + (i % 9);
      const s3 = s1 + s2;
      const s4 = s2 + s3;
      const s5 = s3 + s4;
      ans = s4 + s5;
      deretStr = `${s1}, ${s2}, ${s3}, ${s4}, ${s5}, ...`;
      exp = `Pola penjumlahan dua suku sebelumnya (Fibonacci): ${s4} + ${s5} = ${ans}.`;
    } else {
      // Deret larik 2 (lompat 1 suku)
      const a1 = 10 + (i % 15);
      const d1 = 4 + (i % 6);
      const b1 = 50 + (i % 20);
      const d2 = 3 + (i % 5);
      const s1 = a1;
      const s2 = b1;
      const s3 = a1 + d1;
      const s4 = b1 - d2;
      const s5 = a1 + 2 * d1;
      const s6 = b1 - 2 * d2;
      ans = a1 + 3 * d1;
      deretStr = `${s1}, ${s2}, ${s3}, ${s4}, ${s5}, ${s6}, ...`;
      exp = `Pola dua larik berselang-seling: suku ganjil bertambah +${d1} (${s1}, ${s3}, ${s5}, ${ans}), suku genap berkurang -${d2}.`;
    }

    list.push({
      id: `TIU-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TIU',
      subMateri: 'Numerik - Deret Angka',
      tingkat: tingkats[i % 3],
      paket: pakets[i % 3],
      soal: `[Deret Bilangan #${i + 1}] Tentukan angka selanjutnya yang paling tepat untuk melengkapi pola deret berikut: ${deretStr}`,
      opsi: makeOptions(
        String(ans),
        [String(ans - 2), String(ans + 3), String(ans + 6), String(ans - 5)],
        2600 + i
      ),
      pembahasan: exp,
      referensi: 'TIU Numerik - Pola Barisan Bilangan'
    });
  }

  // 4. Berhitung Cepat & Pecahan Istimewa (60 soal unik)
  for (let i = 0; i < 60; i++) {
    const k1 = 10 + (i % 25); // kelipatan 8 -> 8*k1
    const k2 = 12 + ((i * 3) % 30); // kelipatan 6 -> 6*k2
    const k3 = 8 + ((i * 5) % 20); // kelipatan 4 -> 4*k3
    const n1 = 8 * k1;
    const n2 = 6 * k2;
    const n3 = 4 * k3;
    // 37.5% * n1 + (1/6) * n2 - 25% * n3 = 3*k1 + k2 - k3
    const ans = 3 * k1 + k2 - k3;
    list.push({
      id: `TIU-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TIU',
      subMateri: 'Numerik - Berhitung Cepat',
      tingkat: 'Menengah',
      paket: pakets[i % 3],
      soal: `[Berhitung Cepat #${i + 1}] Hasil dari 37,5% × ${n1} + (1/6) × ${n2} − 0,25 × ${n3} adalah...`,
      opsi: makeOptions(
        String(ans),
        [String(ans - 10), String(ans + 10), String(ans + 15), String(ans - 5)],
        3100 + i
      ),
      pembahasan: `Gunakan pecahan istimewa: 37,5% = 3/8 -> (3/8) × ${n1} = ${3 * k1}; (1/6) × ${n2} = ${k2}; 0,25 = 1/4 -> (1/4) × ${n3} = ${k3}. Total = ${3 * k1} + ${k2} − ${k3} = ${ans}.`,
      referensi: 'TIU Numerik - Konversi Pecahan Istimewa'
    });
  }

  // 5. Soal Cerita Mesin / Produksi & Perbandingan Kuantitatif (60 soal unik)
  for (let i = 0; i < 60; i++) {
    const mesinAwal = 1 + (i % 3); // 1, 2, atau 3 mesin
    const ratePerMesin = 4 + (i % 7); // komponen per menit
    const waktuAwal = 20 + (i % 4) * 10; // 20, 30, 40, 50 menit
    const produkAwal = mesinAwal * ratePerMesin * waktuAwal;
    const mesinTambah = 1 + (i % 2); // +1 atau +2 mesin
    const totalMesin = mesinAwal + mesinTambah;
    const waktuTarget = 30 + (i % 5) * 10; // 30, 40, 50, 60, 70 menit
    const produkTarget = totalMesin * ratePerMesin * waktuTarget;

    list.push({
      id: `TIU-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TIU',
      subMateri: 'Numerik - Perbandingan Kuantitatif',
      tingkat: 'HOTS',
      paket: pakets[i % 3],
      soal: `[Soal Cerita Kuantitatif #${i + 1}] Sebanyak ${mesinAwal} unit mesin cetak industri mampu memproduksi ${produkAwal} komponen dalam waktu ${waktuAwal} menit. Jika ditambahkan ${mesinTambah} unit mesin identik yang bekerja bersamaan dengan kecepatan sama, berapa menit waktu yang diperlukan untuk memproduksi ${produkTarget} komponen?`,
      opsi: makeOptions(
        `${waktuTarget} menit`,
        [`${waktuTarget - 10} menit`, `${waktuTarget + 10} menit`, `${waktuTarget + 15} menit`, `${waktuTarget - 5} menit`],
        3500 + i
      ),
      pembahasan: `Kapasitas 1 mesin = ${produkAwal} / (${mesinAwal} × ${waktuAwal}) = ${ratePerMesin} komponen/menit. Dengan ${totalMesin} mesin, laju produksi menjadi ${totalMesin * ratePerMesin} komponen/menit. Waktu untuk ${produkTarget} komponen = ${produkTarget} / ${totalMesin * ratePerMesin} = ${waktuTarget} menit.`,
      referensi: 'TIU Numerik - Perbandingan Senilai & Berbalik Nilai'
    });
  }

  // 6. Waktu Berpapasan & Susul-Menyusul (50 soal unik)
  const ruteList = [
    ['Tasikmalaya', 'Bandung'], ['Cikarang', 'Cirebon'], ['Semarang', 'Yogyakarta'],
    ['Surabaya', 'Malang'], ['Jakarta', 'Bandung']
  ];
  for (let i = 0; i < 50; i++) {
    const [kotaA, kotaB] = ruteList[i % ruteList.length];
    const v1 = 50 + (i % 4) * 10; // 50, 60, 70, 80 km/jam
    const v2 = 70 + (i % 3) * 10; // 70, 80, 90 km/jam
    const selisihMenit = 30; // 0.5 jam
    const jarakAwal = v1 * 0.5;
    const tJam = 0.5 + (i % 4) * 0.25; // 0.5, 0.75, 1.0, 1.25 jam setelah B berangkat
    const sisaJarak = (v1 + v2) * tJam;
    const jarakTotal = jarakAwal + sisaJarak;
    const totalMenitSetelah0730 = Math.round(tJam * 60);
    const jam = 7 + Math.floor((30 + totalMenitSetelah0730) / 60);
    const menit = (30 + totalMenitSetelah0730) % 60;
    const waktuStr = `${String(jam).padStart(2, '0')}.${String(menit).padStart(2, '0')} WIB`;

    list.push({
      id: `TIU-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TIU',
      subMateri: 'Numerik - Kecepatan & Jarak',
      tingkat: 'HOTS',
      paket: pakets[i % 3],
      soal: `[Jarak & Waktu #${i + 1}] Kereta pertama berangkat dari ${kotaA} menuju ${kotaB} (jarak ${jarakTotal} km) pukul 07.00 WIB dengan kecepatan ${v1} km/jam. Pukul 07.30 WIB, kereta kedua berangkat dari ${kotaB} menuju ${kotaA} dengan kecepatan ${v2} km/jam. Pada pukul berapa kedua kereta berpapasan?`,
      opsi: makeOptions(
        waktuStr,
        [
          `${String(jam).padStart(2, '0')}.${String((menit + 15) % 60).padStart(2, '0')} WIB`,
          `${String(jam).padStart(2, '0')}.${String((menit + 30) % 60).padStart(2, '0')} WIB`,
          `${String(jam + 1).padStart(2, '0')}.${String(menit).padStart(2, '0')} WIB`,
          `07.45 WIB`
        ],
        3900 + i
      ),
      pembahasan: `Selama ${selisihMenit} menit (0,5 jam), kereta pertama menempuh ${v1} × 0,5 = ${jarakAwal} km. Sisa jarak = ${jarakTotal} − ${jarakAwal} = ${sisaJarak} km. Waktu berpapasan setelah 07.30 = ${sisaJarak} / (${v1} + ${v2}) = ${tJam} jam (${totalMenitSetelah0730} menit) -> pukul ${waktuStr}.`,
      referensi: 'TIU Numerik - Kecepatan Relatif Berpapasan'
    });
  }

  // 7. Penalaran Analitis Pemeringkatan & Spasial Kubus 3D (50 soal unik)
  for (let i = 0; i < 50; i++) {
    if (i % 2 === 0) {
      const p1 = ['Dika', 'Farhan', 'Galih', 'Hendra', 'Ilham'][i % 5];
      const p2 = ['Candra', 'Bagas', 'Eko', 'Fajar', 'Gilang'][i % 5];
      const p3 = ['Arif', 'Budi', 'Dani', 'Edo', 'Hadi'][i % 5];
      const p4 = ['Eka', 'Rafi', 'Sandi', 'Taufik', 'Yoga'][i % 5];
      const p5 = ['Bayu', 'Cepi', 'Dedi', 'Geri', 'Rian'][i % 5];
      list.push({
        id: `TIU-${String(list.length + 1).padStart(4, '0')}`,
        kategori: 'TIU',
        subMateri: 'Penalaran Analitis',
        tingkat: 'HOTS',
        paket: pakets[i % 3],
        soal: `[Penalaran Analitis #${i + 1}] Lima peserta seleksi (${p1}, ${p2}, ${p3}, ${p4}, ${p5}) mengikuti simulasi SKD. Skor ${p3} lebih tinggi dari ${p5} tetapi lebih rendah dari ${p2}. Skor ${p1} lebih tinggi dari ${p2}, sedangkan skor ${p4} berada tepat di antara ${p3} dan ${p5}. Peserta dengan peringkat skor tertinggi kedua adalah...`,
        opsi: makeOptions(p2, [p1, p3, p4, p5], 4200 + i),
        pembahasan: `Urutan peringkat dari tertinggi ke terendah: ${p1} > ${p2} > ${p3} > ${p4} > ${p5}. Maka peringkat kedua adalah ${p2}.`,
        referensi: 'TIU Penalaran Analitis - Urutan Linier'
      });
    } else {
      const step = (i % 2) + 1;
      const ans = step === 1 ? 'Hitam' : 'Merah';
      const desc =
        step === 1
          ? 'digulingkan ke depan 1 kali, lalu diputar 90 derajat searah jarum jam (dilihat dari atas)'
          : 'digulingkan ke depan 1 kali, lalu diputar 180 derajat (dilihat dari atas)';
      list.push({
        id: `TIU-${String(list.length + 1).padStart(4, '0')}`,
        kategori: 'TIU',
        subMateri: 'Figural / Spasial 3D',
        tingkat: 'HOTS',
        paket: pakets[i % 3],
        soal: `[Spasial Kubus 3D #${i + 1}] Sebuah kubus memiliki sisi Atas (Merah), Bawah (Biru), Depan (Kuning), Belakang (Hijau), Kiri (Putih), dan Kanan (Hitam). Jika kubus tersebut ${desc}, warna yang berada di sisi DEPAN sekarang adalah...`,
        opsi: makeOptions(
          ans,
          ['Biru', 'Kuning', 'Putih', 'Hijau'].filter((c) => c !== ans),
          4500 + i
        ),
        pembahasan:
          step === 1
            ? 'Guling depan 1x: Atas (Merah) ke Depan, Kanan tetap Hitam. Putar 90° searah jarum jam dari atas: sisi Kanan (Hitam) bergeser ke Depan.'
            : 'Guling depan 1x: Atas (Merah) ke Depan, Belakang (Hijau) ke Atas. Putar 180° dari atas: Depan (Merah) pindah ke Belakang, dan Belakang (Hijau) pindah ke Depan! (Koreksi: jika diputar 180° dari posisi Merah di Depan, maka Belakang (Hijau) yang ke Depan).',
        referensi: 'TIU Figural - Transformasi Ruang 3D'
      });
      if (step === 2) {
        list[list.length - 1].opsi = makeOptions('Hijau', ['Merah', 'Biru', 'Kuning', 'Hitam'], 4500 + i);
      }
    }
  }

  return list;
}

// ============================================================================
// GENERATOR 400 SOAL TKP BERVARIASI (Pelayanan Publik, Jejaring Kerja,
// Sosial Budaya, Teknologi Informasi & Keamanan Data, Profesionalisme,
// Anti Radikalisme)
// ============================================================================
function generateTkpQuestions(): Question[] {
  const list: Question[] = [];
  const pakets: ('Harian' | 'Mingguan' | 'Bulanan')[] = ['Harian', 'Mingguan', 'Bulanan'];
  const tingkats: ('Dasar' | 'Menengah' | 'HOTS')[] = ['Dasar', 'Menengah', 'HOTS'];

  const tkpTemplates = [
    {
      aspek: 'Pelayanan Publik',
      situasi: 'seorang pemohon layanan dari daerah terpencil datang menjelang jam tutup loket dengan dokumen persyaratan yang masih kurang satu lampiran administratif',
      o5: 'Menjelaskan dengan ramah bagian dokumen yang kurang, membantu memverifikasi berkas yang sudah ada saat itu juga, dan memberikan jadwal janji temu prioritas agar tidak mengantre ulang dari awal.',
      o4: 'Mencatat nomor kontak pemohon dan berjanji akan mengabari jadwal pelayanan berikutnya setelah berkasnya dilengkapi.',
      o3: 'Mengarahkan pemohon ke meja informasi umum untuk membaca papan alur persyaratan layanan.',
      o2: 'Meminta pemohon pulang terlebih dahulu dan kembali lagi keesokan harinya sesuai jam buka loket.',
      o1: 'Langsung memproses permohonan tersebut tanpa kelengkapan dokumen karena merasa kasihan dengan jarak tempuhnya.',
      pembahasan: 'Pelayanan Publik skor tertinggi (5) memadukan empati, kejelasan informasi, dan solusi proaktif tanpa melanggar aturan SOP.'
    },
    {
      aspek: 'Teknologi Informasi & Komunikasi',
      situasi: 'instansi Anda menerapkan sistem aplikasi e-kinerja dan arsip digital baru, namun beberapa rekan kerja senior mengalami kesulitan pengoperasian sehingga target laporan unit terhambat',
      o5: 'Menyusun panduan ringkas bergambar dan meluangkan waktu di sela jam kerja untuk mendampingi praktik langsung rekan kerja tersebut hingga mandiri.',
      o4: 'Membagikan tautan video tutorial penggunaan aplikasi di grup internal dan mempersilakan rekan bertanya jika menemui kendala.',
      o3: 'Membantu menginputkan sebagian data milik rekan senior agar tenggat waktu laporan divisi tetap tercapai.',
      o2: 'Fokus menyelesaikan input data bagian pekerjaan sendiri lebih awal agar penilaian kinerja pribadi tidak terganggu.',
      o1: 'Melaporkan kepada pimpinan bahwa keterlambatan unit disebabkan oleh rekan senior yang gagap teknologi.',
      pembahasan: 'Aspek TIK menilai kemampuan beradaptasi terhadap teknologi serta inisiatif memberdayakan rekan kerja melalui transfer pengetahuan.'
    },
    {
      aspek: 'Anti Radikalisme',
      situasi: 'seorang rekan kerja membagikan artikel bermuatan paham intoleran yang meragukan konsensus dasar negara di grup percakapan internal pegawai',
      o5: 'Mengingatkan secara objektif dan santun mengenai komitmen netralitas serta kesetiaan ASN pada Pancasila dan UUD 1945, lalu melaporkannya melalui mekanisme pembinaan etik instansi.',
      o4: 'Menghubungi rekan tersebut secara pribadi untuk menasihatinya agar segera menghapus unggahan yang bertentangan dengan kode etik ASN.',
      o3: 'Mengabaikan pesan tersebut dengan harapan anggota grup lain tidak terpengaruh oleh isi artikelnya.',
      o2: 'Keluar dari grup percakapan secara diam-diam agar tidak dikaitkan dengan diskusi tersebut.',
      o1: 'Membalas dengan komentar emosional dan memperdebatkan ideologi tersebut secara terbuka di grup.',
      pembahasan: 'Aspek Anti-Radikalisme menuntut sikap tegas menjaga ideologi negara secara elegan, edukatif, dan sesuai prosedur pembinaan ASN.'
    },
    {
      aspek: 'Profesionalisme',
      situasi: 'dua jam menjelang tenggat waktu penyerahan laporan evaluasi proyek, rekan satu tim Anda mengalami kondisi darurat medis sehingga analisis datanya baru rampung separuh',
      o5: 'Segera memetakan sisa pekerjaan, menyusun skala prioritas penyelesaian, dan berkoordinasi dengan atasan untuk pembagian dukungan agar laporan selesai tepat waktu dan akurat.',
      o4: 'Mengerjakan seluruh sisa bagian rekan tersebut sendirian semaksimal mungkin agar laporan tetap terkirim sebelum batas waktu.',
      o3: 'Menyelesaikan bagian yang paling mudah terlebih dahulu dan menyerahkan laporan seadanya.',
      o2: 'Mengajukan permohonan penundaan tenggat waktu laporan kepada atasan hingga rekan tersebut pulih.',
      o1: 'Menolak melanjutkan bagian rekan tersebut karena di luar rincian pembagian tugas awal.',
      pembahasan: 'Profesionalisme mengukur akuntabilitas terhadap target tim, manajemen waktu dalam situasi krisis, serta komunikasi efektif dengan pimpinan.'
    },
    {
      aspek: 'Jejaring Kerja',
      situasi: 'Anda ditugaskan dalam tim lintas kementerian untuk menyelaraskan standar teknis industri, namun rapat koordinasi menemui jalan buntu karena perbedaan regulasi tiap instansi',
      o5: 'Mengusulkan penyusunan matriks perbandingan regulasi antarinstansi untuk menemukan titik temu objektif dan merumuskan standar bersama yang saling mendukung.',
      o4: 'Mengajak perwakilan masing-masing instansi berdiskusi informal di luar sidang untuk mencari kompromi teknis.',
      o3: 'Menyarankan pimpinan rapat menunda pengambilan keputusan hingga masing-masing instansi mengirim kajian tertulis.',
      o2: 'Menyerahkan sepenuhnya keputusan akhir kepada ketua rapat tanpa memberikan usulan solusi teknis.',
      o1: 'Bersikeras mempertahankan standar regulasi instansi sendiri sebagai satu-satunya acuan.',
      pembahasan: 'Jejaring Kerja menilai kemampuan membangun sinergi lintas sektor berbasis data dan menghilangkan ego sektoral.'
    },
    {
      aspek: 'Sosial Budaya',
      situasi: 'Anda ditempatkan di unit pelayanan daerah yang memiliki tata krama komunikasi dan adat istiadat berbeda jauh dari daerah asal Anda',
      o5: 'Aktif mempelajari nilai budaya dan etika setempat, bersikap inklusif dalam berinteraksi, serta menyesuaikan gaya komunikasi tanpa mengurangi profesionalitas kerja.',
      o4: 'Mengikuti kegiatan kebersamaan kantor dan mengamati kebiasaan rekan kerja setempat agar tidak melakukan kesalahan etika.',
      o3: 'Membatasi komunikasi hanya pada hal-hal formal kedinasan agar terhindar dari kesalahpahaman budaya.',
      o2: 'Bekerja secara individual seperti biasa sambil menunggu rekan kerja setempat memulai interaksi.',
      o1: 'Meminta rekan kerja dan masyarakat setempat menyesuaikan diri dengan gaya komunikasi Anda.',
      pembahasan: 'Sosial Budaya mengukur kepekaan dan kemampuan beradaptasi secara aktif dalam lingkungan kerja yang majemuk.'
    },
    {
      aspek: 'Teknologi Informasi & Keamanan Siber',
      situasi: 'Anda menerima pesan elektronik yang mengatasnamakan admin sistem kepegawaian dan meminta Anda segera mengisi kata sandi melalui tautan eksternal dalam waktu 30 menit',
      o5: 'Memeriksa keaslian alamat pengirim, tidak mengklik tautan mencurigakan, segera melaporkannya ke tim keamanan IT instansi, dan mengingatkan rekan kerja agar waspada.',
      o4: 'Melaporkan pesan tersebut ke unit IT sambil memastikan akun portal kepegawaian Anda tetap aman melalui situs resmi.',
      o3: 'Langsung menghapus pesan tersebut tanpa membuka tautan maupun memberi tahu pihak lain.',
      o2: 'Meneruskan pesan tersebut ke grup kantor untuk menanyakan apakah rekan lain juga menerimanya.',
      o1: 'Segera mengklik tautan dan memasukkan kata sandi karena khawatir akun kepegawaian terblokir.',
      pembahasan: 'Kesadaran keamanan informasi (phishing awareness) merupakan kompetensi wajib ASN dalam menjaga kerahasiaan data negara.'
    },
    {
      aspek: 'Pelayanan Publik & Inovasi',
      situasi: 'masyarakat sering mengeluhkan lamanya waktu verifikasi berkas perizinan karena masih dilakukan pengecekan manual berulang pada beberapa meja',
      o5: 'Merancang usulan daftar periksa terpadu (integrated checklist) dan mengusulkannya kepada pimpinan sebagai perbaikan alur kerja layanan.',
      o4: 'Mencatat titik-titik antrean yang paling lama untuk disampaikan pada rapat evaluasi bulanan unit kerja.',
      o3: 'Berusaha mempercepat pemeriksaan di meja sendiri meskipun antrean di meja berikutnya tetap menumpuk.',
      o2: 'Menjelaskan kepada masyarakat bahwa proses verifikasi bertahap memang sudah menjadi aturan sejak lama.',
      o1: 'Membiarkan keluhan tersebut karena perancangan alur layanan merupakan kewenangan pimpinan pusat.',
      pembahasan: 'Orientasi pelayanan prima mendorong ASN bersikap inovatif dan solutif untuk memangkas hambatan birokrasi.'
    }
  ];

  const unitKonteksTkp = [
    'Unit Pelayanan Terpadu', 'Direktorat Standardisasi Industri', 'Kantor Pelayanan Perbendaharaan',
    'Balai Pengawasan Ketenagakerjaan', 'Dinas Penanaman Modal dan PTSP', 'Kantor Pertanahan Wilayah',
    'Badan Kepegawaian Daerah', 'Inspektorat Daerah', 'Pusat Data dan Informasi', 'Biro Perencanaan dan Keuangan',
    'Kantor Pelayanan Pajak', 'Balai Riset dan Inovasi', 'Dinas Perhubungan', 'Dinas Koperasi dan UKM',
    'Sekretariat Jenderal Kementerian', 'Kantor Imigrasi', 'Balai Latihan Kerja', 'Dinas Lingkungan Hidup',
    'Badan Pendapatan Daerah', 'Unit Layanan Pengadaan'
  ];

  for (let i = 0; i < 400; i++) {
    const t = tkpTemplates[i % tkpTemplates.length];
    const u = unitKonteksTkp[Math.floor(i / tkpTemplates.length) % unitKonteksTkp.length];
    const posisi = ['staf pelaksana', 'analis ahli pertama', 'koordinator layanan', 'pejabat fungsional', 'anggota tim kerja'][i % 5];
    list.push({
      id: `TKP-${String(list.length + 1).padStart(4, '0')}`,
      kategori: 'TKP',
      subMateri: t.aspek,
      tingkat: tingkats[i % 3],
      paket: pakets[i % 3],
      soal: `[Studi Kasus TKP #${i + 1} | ${u}] Saat Anda bertugas sebagai ${posisi}, terjadi situasi di mana ${t.situasi}. Tindakan paling tepat yang akan Anda lakukan adalah...`,
      opsi: makeTkpOptions(t.o5, t.o4, t.o3, t.o2, t.o1, 5000 + i),
      pembahasan: t.pembahasan,
      referensi: `Kisi-Kisi TKP PermenPANRB — Aspek ${t.aspek}`
    });
  }

  return list;
}

export const QUESTION_BANK: Question[] = [
  ...generateTwkQuestions(),
  ...generateTiuQuestions(),
  ...generateTkpQuestions()
];
