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

export const QUESTION_BANK: Question[] = [
  // ==================== TWK (12 SOAL BERVARIASI) ====================
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
    pembahasan: 'Pasal 24C ayat (1) UUD 1945 menegaskan MK berwenang mengadili pada tingkat pertama dan terakhir yang putusannya bersifat final untuk: menguji UU terhadap UUD, memutus sengketa kewenangan lembaga negara yang kewenangannya diberikan UUD, memutus pembubaran parpol, dan memutus perselisihan hasil pemilu.',
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
    pembahasan: 'Gratifikasi pasca-tender tetap berpotensi menimbulkan konflik kepentingan dan dilarang dalam UU Tipikor serta panduan perilaku ASN "Akuntabel": melaksanakan tugas dengan jujur, bertanggung jawab, cermat, disiplin, dan berintegritas tinggi.',
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
    pembahasan: 'Lima nilai dasar bela negara meliputi: cinta tanah air, sadar berbangsa dan bernegara, setia pada Pancasila sebagai ideologi negara, rela berkorban untuk bangsa dan negara, serta kemampuan awal bela negara.',
    referensi: 'UU No. 23 Tahun 2019 tentang Pengelolaan Sumber Daya Nasional'
  },
  {
    id: 'TWK-05', kategori: 'TWK', subMateri: 'Bhinneka Tunggal Ika', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Semboyan Bhinneka Tunggal Ika yang terdapat pada lambang negara Garuda Pancasila pertama kali dirumuskan oleh Mpu Tantular dalam Kitab Sutasoma. Makna filosofis "Tan Hana Dharma Mangrwa" dalam konteks penyelenggaraan pemerintahan daerah adalah...',
    opsi: [
      { label: 'A', text: 'Setiap daerah memiliki otonomi mutlak untuk membuat aturan yang berbeda dari pusat', skor: 0 },
      { label: 'B', text: 'Tidak ada pengabdian yang mendua; keberagaman budaya daerah tetap berorientasi pada satu tujuan nasional', skor: 5 },
      { label: 'C', text: 'Penyeragaman seluruh adat istiadat lokal demi efisiensi birokrasi nasional', skor: 0 },
      { label: 'D', text: 'Prioritas pembangunan hanya diberikan kepada wilayah dengan mayoritas penduduk tertentu', skor: 0 },
      { label: 'E', text: 'Pemisahan tegas antara nilai kearifan lokal dan hukum positif negara', skor: 0 }
    ],
    pembahasan: 'Tan Hana Dharma Mangrwa berarti tidak ada kebenaran/pengabdian yang mendua. Meski Indonesia beragam suku, bahasa, dan budaya, seluruhnya menyatu dalam pengabdian kepada bangsa dan negara.',
    referensi: 'PP No. 66 Tahun 1951 tentang Lambang Negara'
  },
  {
    id: 'TWK-06', kategori: 'TWK', subMateri: 'Nasionalisme & Sejarah', tingkat: 'Menengah', paket: 'Mingguan',
    soal: 'Peristiwa Rengasdengklok pada 16 Agustus 1945 menjadi titik balik percepatan Proklamasi Kemerdekaan Indonesia. Pelajaran utama yang dapat dipetik oleh generasi ASN masa kini dari perbedaan pandangan antara golongan tua dan golongan muda saat itu adalah...',
    opsi: [
      { label: 'A', text: 'Mengutamakan ego sektoral kelompok demi mempercepat target kerja', skor: 0 },
      { label: 'B', text: 'Sinergi antara semangat pembaruan yang progresif dengan kebijaksanaan strategis demi kepentingan bangsa', skor: 5 },
      { label: 'C', text: 'Mengabaikan prosedur formal apabila situasi dianggap mendesak', skor: 0 },
      { label: 'D', text: 'Menunggu arahan pihak eksternal sebelum mengambil keputusan strategis', skor: 0 },
      { label: 'E', text: 'Membatasi dialog antargenerasi dalam perumusan kebijakan publik', skor: 0 }
    ],
    pembahasan: 'Golongan muda membawa energi percepatan kemerdekaan tanpa campur tangan Jepang, sementara golongan tua menjaga kematangan strategi dan persatuan nasional. Keduanya berdialog dan bersinergi menghasilkan Proklamasi 17 Agustus 1945.',
    referensi: 'Sejarah Pergerakan Nasional Indonesia'
  },
  {
    id: 'TWK-07', kategori: 'TWK', subMateri: 'Bahasa Indonesia (EYD & Kalimat Efektif)', tingkat: 'Dasar', paket: 'Harian',
    soal: 'Manakah di antara kalimat berikut yang penulisan huruf kapital dan tanda bacanya paling tepat sesuai Ejaan Bahasa Indonesia yang Disempurnakan (EYD V) untuk naskah dinas resmi?',
    opsi: [
      { label: 'A', text: 'Kepada Yth. Bapak Direktur Jenderal Industri Logam, Mesin, Alat Transportasi, dan Elektronika di tempat.', skor: 0 },
      { label: 'B', text: 'Yth. Direktur Jenderal Industri Logam, Mesin, Alat Transportasi, dan Elektronika di Jakarta', skor: 5 },
      { label: 'C', text: 'Yth. bapak Direktur Jenderal Industri Logam, Mesin, Alat Transportasi dan Elektronika di Jakarta.', skor: 0 },
      { label: 'D', text: 'Kepada Yth: Direktur Jenderal Industri Logam, Mesin, Alat Transportasi dan Elektronika di-Jakarta', skor: 0 },
      { label: 'E', text: 'Yth. Direktur Jenderal industri logam, mesin, alat transportasi, dan elektronika di Jakarta.', skor: 0 }
    ],
    pembahasan: 'Dalam tata naskah dinas resmi (Permendikbudristek EYD V & Peraturan ANRI): tidak perlu menggunakan kata "Kepada" sebelum "Yth.", tidak menggunakan tanda titik di akhir baris alamat surat, kata "bapak/ibu" tidak ditulis jika diikuti nama jabatan resmi, dan tanda koma serial sebelum "dan" digunakan.',
    referensi: 'EYD Edisi V & Peraturan ANRI No. 5 Tahun 2021 tentang Pedoman Umum Tata Naskah Dinas'
  },
  {
    id: 'TWK-08', kategori: 'TWK', subMateri: 'NKRI & Otonomi Daerah', tingkat: 'HOTS', paket: 'Bulanan',
    soal: 'Berdasarkan UU No. 23 Tahun 2014 tentang Pemerintahan Daerah, urusan pemerintahan yang sepenuhnya menjadi kewenangan Pemerintah Pusat (urusan pemerintahan absolut) meliputi bidang-bidang berikut, KECUALI...',
    opsi: [
      { label: 'A', text: 'Politik luar negeri dan pertahanan', skor: 0 },
      { label: 'B', text: 'Yustisi dan moneter/fiskal nasional', skor: 0 },
      { label: 'C', text: 'Agama dan keamanan', skor: 0 },
      { label: 'D', text: 'Pendidikan menengah dan kesehatan daerah', skor: 5 },
      { label: 'E', text: 'Pertahanan dan keamanan negara', skor: 0 }
    ],
    pembahasan: '6 urusan pemerintahan absolut pusat (Pasal 10 UU 23/2014): Politik luar negeri, Pertahanan, Keamanan, Yustisi, Moneter & Fiskal Nasional, serta Agama. Pendidikan dan kesehatan termasuk urusan pemerintahan konkuren (dibagi antara pusat, provinsi, dan kab/kota).',
    referensi: 'UU No. 23 Tahun 2014 Pasal 10'
  },
  {
    id: 'TWK-09', kategori: 'TWK', subMateri: 'UUD 1945 & Konstitusi', tingkat: 'HOTS', paket: 'Mingguan',
    soal: 'Apabila Rancangan Undang-Undang (RUU) yang telah disetujui bersama oleh DPR dan Presiden tidak disahkan oleh Presiden dalam waktu 30 hari semenjak RUU tersebut disetujui, maka berdasarkan Pasal 20 ayat (5) UUD 1945...',
    opsi: [
      { label: 'A', text: 'RUU tersebut batal demi hukum dan tidak dapat diajukan kembali pada masa sidang berikutnya', skor: 0 },
      { label: 'B', text: 'RUU tersebut sah menjadi undang-undang dan wajib diundangkan', skor: 5 },
      { label: 'C', text: 'DPR wajib melakukan pemungutan suara ulang dengan kuorum dua pertiga anggota', skor: 0 },
      { label: 'D', text: 'Mahkamah Konstitusi berhak mengesahkan RUU tersebut menggantikan Presiden', skor: 0 },
      { label: 'E', text: 'Presiden mengeluarkan Peraturan Pemerintah Pengganti Undang-Undang (Perppu)', skor: 0 }
    ],
    pembahasan: 'Pasal 20 ayat (5) UUD 1945 menyatakan secara tegas: "Dalam hal rancangan undang-undang yang telah disetujui bersama tersebut tidak disahkan oleh Presiden dalam waktu tiga puluh hari semenjak rancangan undang-undang tersebut disetujui, rancangan undang-undang tersebut sah menjadi undang-undang dan wajib diundangkan."',
    referensi: 'UUD NRI Tahun 1945 Pasal 20 Ayat (5)'
  },
  {
    id: 'TWK-10', kategori: 'TWK', subMateri: 'Integritas & Antikorupsi', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Perbedaan mendasar antara tindak pidana suap dan gratifikasi menurut UU No. 20 Tahun 2001 tentang Pemberantasan Tindak Pidana Korupsi terletak pada...',
    opsi: [
      { label: 'A', text: 'Suap selalu berbentuk uang tunai, sedangkan gratifikasi selalu berbentuk barang', skor: 0 },
      { label: 'B', text: 'Suap melibatkan kesepakatan (transaksional/meeting of minds) kedua belah pihak, sedangkan gratifikasi bersifat pemberian tanpa kesepakatan langsung namun berhubungan dengan jabatan', skor: 5 },
      { label: 'C', text: 'Gratifikasi diperbolehkan apabila nilainya di atas Rp10.000.000 tanpa perlu dilaporkan ke KPK', skor: 0 },
      { label: 'D', text: 'Suap hanya berlaku bagi pejabat eselon I, sedangkan gratifikasi berlaku bagi staf pelaksana', skor: 0 },
      { label: 'E', text: 'Gratifikasi tidak memiliki sanksi pidana dalam hukum positif Indonesia', skor: 0 }
    ],
    pembahasan: 'Suap mensyaratkan adanya kesepakatan/transaksi antara pemberi dan penerima untuk berbuat/tidak berbuat sesuatu. Gratifikasi adalah pemberian dalam arti luas kepada pegawai negeri/penyelenggara negara yang berhubungan dengan jabatannya (bersifat tanam budi) dan wajib dilaporkan ke KPK maksimal 30 hari kerja.',
    referensi: 'UU No. 20 Tahun 2001 Pasal 12B & Penjelasannya'
  },

  // ==================== TIU (12 SOAL BERVARIASI) ====================
  {
    id: 'TIU-01', kategori: 'TIU', subMateri: 'Verbal - Silogisme', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Semua insinyur yang lulus uji kompetensi berhak menandatangani dokumen rancangan teknis. Sebagian pegawai di Direktorat Industri adalah insinyur yang lulus uji kompetensi. Simpulan yang paling tepat adalah...',
    opsi: [
      { label: 'A', text: 'Semua pegawai di Direktorat Industri berhak menandatangani dokumen rancangan teknis.', skor: 0 },
      { label: 'B', text: 'Sebagian pegawai di Direktorat Industri berhak menandatangani dokumen rancangan teknis.', skor: 5 },
      { label: 'C', text: 'Sebagian insinyur yang lulus uji kompetensi bukan pegawai Direktorat Industri.', skor: 0 },
      { label: 'D', text: 'Semua yang berhak menandatangani dokumen rancangan teknis adalah pegawai Direktorat Industri.', skor: 0 },
      { label: 'E', text: 'Tidak ada pegawai Direktorat Industri yang berhak menandatangani dokumen rancangan teknis.', skor: 0 }
    ],
    pembahasan: 'Premis 1: Semua A adalah B. Premis 2: Sebagian C adalah A. Dengan aturan silogisme kategorik, kesimpulan sahnya adalah: Sebagian C adalah B.',
    referensi: 'TIU Verbal - Silogisme Kategorik'
  },
  {
    id: 'TIU-02', kategori: 'TIU', subMateri: 'Numerik - Deret Angka', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Perhatikan pola deret bilangan berikut: 4, 7, 13, 25, 49, ... Bilangan selanjutnya yang tepat untuk melengkapi deret tersebut adalah...',
    opsi: [
      { label: 'A', text: '85', skor: 0 },
      { label: 'B', text: '93', skor: 0 },
      { label: 'C', text: '97', skor: 5 },
      { label: 'D', text: '98', skor: 0 },
      { label: 'E', text: '101', skor: 0 }
    ],
    pembahasan: 'Selisih antar suku: +3, +6, +12, +24, sehingga selisih berikutnya +48. Jadi 49 + 48 = 97.',
    referensi: 'TIU Numerik - Deret Geometri Bertingkat'
  },
  {
    id: 'TIU-03', kategori: 'TIU', subMateri: 'Numerik - Perbandingan Berbalik Nilai', tingkat: 'HOTS', paket: 'Mingguan',
    soal: 'Sebuah mesin produksi mampu mencetak 240 komponen presisi dalam waktu 40 menit. Jika ditambahkan 2 mesin identik yang bekerja bersamaan dengan kecepatan sama, berapa menit waktu yang dibutuhkan untuk mencetak 900 komponen?',
    opsi: [
      { label: 'A', text: '45 menit', skor: 0 },
      { label: 'B', text: '50 menit', skor: 5 },
      { label: 'C', text: '60 menit', skor: 0 },
      { label: 'D', text: '75 menit', skor: 0 },
      { label: 'E', text: '90 menit', skor: 0 }
    ],
    pembahasan: 'Kecepatan 1 mesin = 240/40 = 6 komponen/menit. Total mesin = 1 + 2 = 3 mesin (18 komponen/menit). Waktu untuk 900 komponen = 900 / 18 = 50 menit.',
    referensi: 'TIU Numerik - Perbandingan Kuantitatif'
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
    pembahasan: 'Urutan dari tertinggi ke terendah: D > C > A > E > B. Peringkat 1 = D, peringkat 2 = C.',
    referensi: 'TIU Penalaran Analitis - Pemeringkatan'
  },
  {
    id: 'TIU-05', kategori: 'TIU', subMateri: 'Verbal - Analogi Kata', tingkat: 'Dasar', paket: 'Harian',
    soal: 'KALIBRASI : AKURASI = ... : ...',
    opsi: [
      { label: 'A', text: 'VAKSINASI : IMUNITAS', skor: 5 },
      { label: 'B', text: 'KOROSI : LOGAM', skor: 0 },
      { label: 'C', text: 'INSPEKSI : KERUSAKAN', skor: 0 },
      { label: 'D', text: 'PRODUKSI : DISTRIBUSI', skor: 0 },
      { label: 'E', text: 'ANGGARAN : REALISASI', skor: 0 }
    ],
    pembahasan: 'Hubungan proses dan tujuan/hasil positifnya: KALIBRASI dilakukan untuk meningkatkan/menjamin AKURASI, sebagaimana VAKSINASI dilakukan untuk meningkatkan/menjamin IMUNITAS.',
    referensi: 'TIU Verbal - Analogi Hubungan Tujuan'
  },
  {
    id: 'TIU-06', kategori: 'TIU', subMateri: 'Numerik - Berhitung Cepat', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Hasil dari 37,5% × 480 + 0,125 × 640 − (1/6) × 300 adalah...',
    opsi: [
      { label: 'A', text: '190', skor: 0 },
      { label: 'B', text: '210', skor: 5 },
      { label: 'C', text: '220', skor: 0 },
      { label: 'D', text: '240', skor: 0 },
      { label: 'E', text: '260', skor: 0 }
    ],
    pembahasan: 'Gunakan pecahan istimewa: 37,5% = 3/8 -> (3/8) × 480 = 180. 0,125 = 1/8 -> (1/8) × 640 = 80. (1/6) × 300 = 50. Total = 180 + 80 - 50 = 210.',
    referensi: 'TIU Numerik - Pecahan Istimewa'
  },
  {
    id: 'TIU-07', kategori: 'TIU', subMateri: 'Verbal - Logika Ekuivalensi', tingkat: 'HOTS', paket: 'Mingguan',
    soal: 'Pernyataan: "Jika anggaran disetujui dan dokumen lelang lengkap, maka proyek pembangunan dimulai bulan depan." Ingkaran (negasi) yang logis dari pernyataan majemuk tersebut adalah...',
    opsi: [
      { label: 'A', text: 'Jika anggaran tidak disetujui atau dokumen lelang tidak lengkap, maka proyek pembangunan tidak dimulai bulan depan.', skor: 0 },
      { label: 'B', text: 'Anggaran disetujui dan dokumen lelang lengkap, tetapi proyek pembangunan tidak dimulai bulan depan.', skor: 5 },
      { label: 'C', text: 'Proyek pembangunan dimulai bulan depan meskipun anggaran tidak disetujui.', skor: 0 },
      { label: 'D', text: 'Anggaran tidak disetujui atau dokumen lelang tidak lengkap dan proyek tidak dimulai.', skor: 0 },
      { label: 'E', text: 'Jika proyek pembangunan tidak dimulai bulan depan, maka anggaran tidak disetujui.', skor: 0 }
    ],
    pembahasan: 'Negasi dari implikasi (P → Q) adalah (P ∧ ~Q). Di sini P = "anggaran disetujui dan dokumen lelang lengkap", Q = "proyek dimulai bulan depan". Maka negasinya: "Anggaran disetujui dan dokumen lelang lengkap, tetapi (~Q) proyek pembangunan tidak dimulai bulan depan."',
    referensi: 'TIU Verbal - Logika Matematika (Negasi Implikasi)'
  },
  {
    id: 'TIU-08', kategori: 'TIU', subMateri: 'Numerik - Perbandingan P dan Q', tingkat: 'HOTS', paket: 'Bulanan',
    soal: 'Diketahui x adalah bilangan bulat positif dengan 2 < x < 6. Jika P = 3x² − 4 dan Q = 2x³ − 15, manakah hubungan yang tepat antara kuantitas P dan Q?',
    opsi: [
      { label: 'A', text: 'P > Q untuk semua nilai x yang memenuhi', skor: 0 },
      { label: 'B', text: 'Q > P untuk semua nilai x yang memenuhi', skor: 5 },
      { label: 'C', text: 'P = Q untuk semua nilai x yang memenuhi', skor: 0 },
      { label: 'D', text: 'Informasi yang diberikan tidak cukup untuk memutuskan salah satu dari tiga pilihan di atas', skor: 0 },
      { label: 'E', text: 'P + Q selalu bernilai bilangan genap', skor: 0 }
    ],
    pembahasan: 'Nilai bulat x yang memenuhi 2 < x < 6 adalah x ∈ {3, 4, 5}. Uji x = 3: P = 3(9)-4 = 23, Q = 2(27)-15 = 39 (Q > P). Uji x = 4: P = 3(16)-4 = 44, Q = 2(64)-15 = 113 (Q > P). Tunggu: untuk x = 3 (P=23, Q=39 -> Q>P); untuk x = 4 (P=44, Q=113 -> Q>P); untuk x = 5 (P=71, Q=235 -> Q>P). Nilai bilangan bulat x dengan 2 < x < 6 adalah x ∈ {3, 4, 5}. Uji x = 3: P = 3(9) - 4 = 23, Q = 2(27) - 15 = 39 (Q > P). Uji x = 4: P = 3(16) - 4 = 44, Q = 2(64) - 15 = 113 (Q > P). Uji x = 5: P = 3(25) - 4 = 71, Q = 2(125) - 15 = 235 (Q > P). Jadi Q > P konsisten untuk semua nilai x yang memenuhi.',
    referensi: 'TIU Numerik - Analisis Kuantitatif P dan Q'
  },
  {
    id: 'TIU-09', kategori: 'TIU', subMateri: 'Numerik - Kecepatan & Jarak', tingkat: 'Menengah', paket: 'Harian',
    soal: 'Kereta api bergerak dari Kota Tasikmalaya menuju Kota Bandung berjarak 120 km dengan kecepatan rata-rata 60 km/jam berangkat pukul 07.00 WIB. Pada pukul 07.30 WIB, kereta kedua berangkat dari Bandung menuju Tasikmalaya melalui jalur paralel dengan kecepatan 90 km/jam. Pada pukul berapa kedua kereta tersebut berpapasan?',
    opsi: [
      { label: 'A', text: '08.00 WIB', skor: 0 },
      { label: 'B', text: '08.06 WIB', skor: 5 },
      { label: 'C', text: '08.15 WIB', skor: 0 },
      { label: 'D', text: '08.20 WIB', skor: 0 },
      { label: 'E', text: '08.30 WIB', skor: 0 }
    ],
    pembahasan: 'Selisih waktu berangkat = 30 menit = 0,5 jam. Jarak tempuh kereta pertama selama 0,5 jam = 60 × 0,5 = 30 km. Sisa jarak = 120 - 30 = 90 km. Waktu berpapasan setelah 07.30 = Sisa jarak / (V1 + V2) = 90 / (60 + 90) = 90 / 150 = 0,6 jam = 36 menit. Jadi berpapasan pukul 07.30 + 36 menit = 08.06 WIB.',
    referensi: 'TIU Numerik - Waktu Berpapasan (Susul-Menyusul)'
  },
  {
    id: 'TIU-10', kategori: 'TIU', subMateri: 'Figural / Spasial - Pola Transformasi', tingkat: 'Menengah', paket: 'Mingguan',
    soal: 'Sebuah kubus satuan memiliki 6 sisi: Atas (Merah), Bawah (Biru), Depan (Kuning), Belakang (Hijau), Kiri (Putih), dan Kanan (Hitam). Jika kubus tersebut digulingkan ke depan sebanyak 1 kali, lalu diputar 90 derajat searah jarum jam (dilihat dari atas), warna apakah yang berada di sisi DEPAN sekarang?',
    opsi: [
      { label: 'A', text: 'Merah', skor: 0 },
      { label: 'B', text: 'Biru', skor: 0 },
      { label: 'C', text: 'Putih', skor: 0 },
      { label: 'D', text: 'Hitam', skor: 5 },
      { label: 'E', text: 'Hijau', skor: 0 }
    ],
    pembahasan: 'Langkah 1 (digulingkan ke depan 1x): Sisi Atas (Merah) pindah ke Depan, Belakang (Hijau) pindah ke Atas, Bawah (Biru) pindah ke Belakang, Depan (Kuning) pindah ke Bawah. Kiri (Putih) dan Kanan (Hitam) tetap. Langkah 2 (diputar 90° searah jarum jam dari atas): Sisi Kanan (Hitam) bergeser menempati sisi Depan!',
    referensi: 'TIU Figural - Penalaran Spasial Rotasi 3D'
  },

  // ==================== TKP (12 SOAL BERVARIASI) ====================
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
    id: 'TKP-03', kategori: 'TKP', subMateri: 'Anti Radikalisme', tingkat: 'HOTS', paket: 'Mingguan',
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
    id: 'TKP-04', kategori: 'TKP', subMateri: 'Sosial Budaya', tingkat: 'Menengah', paket: 'Bulanan',
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
  },
  {
    id: 'TKP-05', kategori: 'TKP', subMateri: 'Profesionalisme', tingkat: 'HOTS', paket: 'Harian',
    soal: 'Anda sedang menyelesaikan laporan evaluasi anggaran triwulan yang harus diserahkan pukul 16.00 WIB hari ini. Pada pukul 14.30 WIB, rekan satu tim Anda tiba-tiba sakit dan meminta Anda melanjutkan bagian analisis datanya yang masih tersisa 40%. Sikap Anda adalah...',
    opsi: [
      { label: 'A', text: 'Menolak permintaan tersebut karena masing-masing pegawai sudah memiliki pembagian tugas yang jelas.', skor: 1 },
      { label: 'B', text: 'Segera memetakan sisa data yang belum diolah, mengatur prioritas waktu, dan berkoordinasi dengan atasan bila diperlukan dukungan tambahan agar laporan selesai tepat waktu.', skor: 5 },
      { label: 'C', text: 'Mengerjakan bagian rekan tersebut semampunya dan menyerahkan laporan apa adanya melewati tenggat waktu.', skor: 3 },
      { label: 'D', text: 'Meminta penundaan tenggat waktu kepada atasan hingga rekan tersebut masuk kerja kembali.', skor: 2 },
      { label: 'E', text: 'Mengerjakan seluruhnya sendirian tanpa melapor kepada atasan meskipun berisiko terjadi kesalahan hitung karena terburu-buru.', skor: 4 }
    ],
    pembahasan: 'Profesionalisme menuntut tanggung jawab terhadap keberhasilan target tim, manajemen krisis yang terukur, serta komunikasi transparan dengan pimpinan.',
    referensi: 'Kisi-kisi TKP PermenPANRB - Aspek Profesionalisme'
  },
  {
    id: 'TKP-06', kategori: 'TKP', subMateri: 'Jejaring Kerja', tingkat: 'Menengah', paket: 'Mingguan',
    soal: 'Instansi Anda ditunjuk sebagai koordinator penyusunan standar teknis industri bersama tiga kementerian lain. Pada rapat perdana, muncul perbedaan standar prosedur antarinstansi yang membuat pembahasan berjalan buntu. Langkah Anda sebagai perwakilan tim adalah...',
    opsi: [
      { label: 'A', text: 'Mempertahankan standar milik instansi sendiri karena merasa paling berpengalaman di bidang tersebut.', skor: 1 },
      { label: 'B', text: 'Mengusulkan pemetaan titik temu dari masing-masing regulasi instansi dan menyusun matriks penyelarasan bersama secara objektif.', skor: 5 },
      { label: 'C', text: 'Menyerahkan sepenuhnya keputusan akhir kepada pimpinan rapat tanpa memberikan masukan teknis.', skor: 2 },
      { label: 'D', text: 'Mengikuti usulan dari kementerian yang anggarannya paling besar agar rapat cepat selesai.', skor: 3 },
      { label: 'E', text: 'Menunda pembahasan dan meminta masing-masing instansi mengirim surat resmi terlebih dahulu.', skor: 4 }
    ],
    pembahasan: 'Aspek Jejaring Kerja menilai kemampuan membangun kolaborasi lintas sektor, mencari solusi win-win berbasis data, dan menghilangkan ego sektoral.',
    referensi: 'Kisi-kisi TKP PermenPANRB - Aspek Jejaring Kerja'
  },
  {
    id: 'TKP-07', kategori: 'TKP', subMateri: 'Teknologi Informasi & Keamanan Data', tingkat: 'HOTS', paket: 'Harian',
    soal: 'Anda menerima surel (email) yang mengatasnamakan unit IT pusat yang meminta Anda segera memperbarui kata sandi akun portal kepegawaian melalui tautan eksternal dalam waktu 1 jam. Tindakan Anda adalah...',
    opsi: [
      { label: 'A', text: 'Segera mengklik tautan dan mengganti kata sandi agar akun kepegawaian tidak terblokir.', skor: 1 },
      { label: 'B', text: 'Memeriksa alamat domain pengirim, tidak mengklik tautan mencurigakan, dan mengonfirmasi langsung ke helpdesk IT resmi instansi serta mengingatkan rekan kerja.', skor: 5 },
      { label: 'C', text: 'Menghapus surel tersebut tanpa memberi tahu siapa pun.', skor: 3 },
      { label: 'D', text: 'Meneruskan surel tersebut ke grup kantor untuk menanyakan apakah ada yang sudah mengkliknya.', skor: 2 },
      { label: 'E', text: 'Melaporkan surel tersebut ke unit IT namun tetap mencoba membuka tautannya lewat ponsel pribadi.', skor: 4 }
    ],
    pembahasan: 'Literasi keamanan siber (awareness terhadap phishing) adalah bagian krusial dalam aspek TIK modern bagi ASN untuk melindungi data negara.',
    referensi: 'Kisi-kisi TKP PermenPANRB - Literasi Digital & Keamanan Informasi'
  },
  {
    id: 'TKP-08', kategori: 'TKP', subMateri: 'Pelayanan Publik Digital', tingkat: 'Menengah', paket: 'Bulanan',
    soal: 'Banyak pengguna layanan mengeluhkan di media sosial resmi instansi bahwa aplikasi pengajuan izin sering mengalami gangguan saat mengunggah dokumen berukuran besar. Sebagai pengelola layanan, respons Anda adalah...',
    opsi: [
      { label: 'A', text: 'Menghapus komentar keluhan di media sosial agar citra instansi tetap terlihat baik.', skor: 1 },
      { label: 'B', text: 'Menanggapi keluhan dengan ramah, menyediakan panduan kompresi dokumen serta kanal alternatif sementara, dan meneruskan temuan bug ke tim pengembang sistem.', skor: 5 },
      { label: 'C', text: 'Menyalahkan pengguna karena tidak membaca petunjuk ukuran maksimal file sebelum mengunggah.', skor: 2 },
      { label: 'D', text: 'Mencatat keluhan tersebut untuk dibahas pada rapat evaluasi akhir tahun.', skor: 3 },
      { label: 'E', text: 'Meminta pengguna mencoba mengunggah ulang pada tengah malam saat trafik server sepi.', skor: 4 }
    ],
    pembahasan: 'Pelayanan publik responsif menuntut komunikasi empatik, solusi jangka pendek bagi masyarakat, dan perbaikan sistemik jangka panjang.',
    referensi: 'UU No. 25 Tahun 2009 tentang Pelayanan Publik'
  }
];
