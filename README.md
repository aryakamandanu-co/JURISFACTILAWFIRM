# PT. Juris Facti Lawfirm & Services Bureau

Website React + Vite + TypeScript + Tailwind CSS.

## Menjalankan secara lokal

Pastikan Node.js versi 18 atau lebih baru sudah terpasang.

```bash
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite (umumnya http://localhost:5173).

## Build untuk produksi

```bash
npm run build
npm run preview
```

Hasil build berada di folder `dist/`.

## Catatan penting

- Data profil, layanan, artikel, dan beberapa pengaturan pada versi kode ini disimpan melalui `localStorage` browser.
- Data konsultasi pada implementasi ini juga belum tersambung ke backend/database bersama. Untuk menerima konsultasi secara aman dari pengunjung dan mengelolanya lintas perangkat, integrasikan Supabase atau backend server dengan autentikasi dan kebijakan akses (RLS).
- Autentikasi admin yang hanya mengandalkan penyimpanan browser/session tidak boleh dianggap sebagai pengamanan produksi.
- Periksa dan konfirmasi kembali alamat kantor, nomor telepon, email, harga layanan, daftar klien/mitra, dan seluruh klaim profil sebelum website dipublikasikan.
- Jangan memasukkan data pribadi atau rahasia klien ke versi demo ini.
