# Ghifari Siap CPNS

Platform Persiapan, Simulasi CAT, Analisis Formasi Berdasarkan Jurusan, dan AI Tutor CPNS Terpadu berbasis **React + TypeScript + Vite + PWA + Google Apps Script**.

## Struktur Folder
- `src/App.tsx` & `src/main.tsx`: Aplikasi utama React TypeScript dengan 9 modul saling terintegrasi.
- `public/`: Manifest PWA, Service Worker (`sw.js`), ikon SVG, dan referensi regulasi (`knowledge.json`).
- `apps-script/Code.gs`: Backend Google Apps Script untuk sinkronisasi otomatis ke Google Sheets tanpa duplikasi data.

## Cara Deploy ke GitHub & Vercel
1. Unggah seluruh isi folder ini ke repositori GitHub Anda.
2. Hubungkan repositori ke **Vercel** (Framework Preset: `Vite`, Build Command: `npm run build`, Output Directory: `dist`).
3. Untuk database cloud: buka Google Sheets → **Ekstensi > Apps Script** → tempel isi `apps-script/Code.gs` → jalankan `setupDatabaseSheets()` → **Deploy > Web App** (akses: *Anyone*) → salin URL Web App ke menu **Pengaturan Tahun Seleksi** di aplikasi.
