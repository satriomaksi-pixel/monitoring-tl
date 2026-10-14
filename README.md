# Monitoring Tindak Lanjut Temuan APIP

Prototipe *capstone* Mata Kuliah **Transformasi Digital dan Kepemimpinan**
Magister Akuntansi FEB Universitas Mulawarman — Konsentrasi Akuntansi Sektor Publik.

| Nama | NIM |
|---|---|
| Satrio Endriatomo | 2501058007 |
| Nurul Fajri Rasyidah | 2501058011 |

## Deskripsi

Aplikasi ini mendigitalisasi proses pemantauan tindak lanjut (TL) temuan hasil pengawasan APIP (Inspektorat).
Proses yang semula berbasis surat, berkas fisik, dan rekap Excel diganti dengan alur kerja daring:

1. **Anggota Tim** menginput temuan (kondisi, kriteria, sebab, akibat) beserta rekomendasi.
2. **Ketua Tim** mereviu: setujui (teruskan ke Dalnis) atau kembalikan ke Anggota Tim dengan catatan.
3. **Pengendali Teknis (Dalnis)** mereviu: setujui (temuan final dan terbit ke OPD) atau kembalikan.
4. **Admin OPD** mengunggah bukti tindak lanjut per rekomendasi. Admin OPD hanya melihat temuan OPD-nya sendiri.
5. **Inspektorat** (Admin Inspektorat, Ketua Tim, atau Dalnis) memverifikasi bukti dengan hasil
   Sesuai, Belum Sesuai, atau Tidak Dapat Ditindaklanjuti.
6. **Inspektur** dan **Admin Inspektorat** memantau dashboard semua OPD, batas waktu 60 hari, dan audit trail.

OPD contoh: **Dinas PUPR** dan **Dinas Pendidikan dan Kebudayaan (Disdikbud)**.

## Fitur utama

- Login simulasi untuk 8 akun dengan 6 peran.
- Hak akses berbasis peran (RBAC). Matriksnya ada di halaman *Panduan & Hak Akses*.
- Alur reviu berjenjang dengan catatan pengembalian dan riwayat reviu.
- Unggah bukti TL dan verifikasi dengan kategori status standar.
- Dashboard berisi:
  - persentase penyelesaian TL dan nilai TL yang sudah sesuai;
  - komposisi status per OPD;
  - jumlah rekomendasi yang lewat batas waktu.
- **Audit trail** yang mencatat siapa, kapan, dan melakukan apa, serta bisa diekspor ke CSV.
- Data simulasi yang dianonimkan sesuai UU No. 27 Tahun 2022 tentang PDP.

## Arsitektur (prototipe)

```
Browser (Next.js / React, client-side)
 ├─ UI: halaman Login, Dashboard, Daftar/Detail Temuan, Input Temuan, Tindak Lanjut, Audit Trail, Panduan
 ├─ Lapisan aturan: src/lib/constants.js (peran & hak akses), src/lib/store.js (alur bisnis + log)
 └─ Penyimpanan: localStorage browser (data awal dari src/lib/seed.js)
Hosting: Vercel (deploy otomatis dari GitHub)
```

> **Batasan prototipe:**
> - Belum ada autentikasi sungguhan.
> - Data tersimpan di browser masing-masing pengguna, jadi tidak dibagi antarpengguna.
>
> Untuk implementasi nyata, dua hal ini perlu diganti dengan backend dan database (misalnya PostgreSQL)
> yang memakai *row-level security*, serta dipasang di server Pemda.

## Struktur folder

```
src/app/          halaman (App Router)
src/components/   komponen UI (AppShell, Footer, TemuanForm, ui)
src/lib/          seed data, store (alur & audit trail), konstanta peran/status, statistik
data/             contoh data anonim (JSON)
docs/             dokumentasi pendukung
```

## Cara menjalankan (run guide)

Prasyarat: Node.js 20 atau lebih baru.

```bash
npm install
npm run dev        # buka http://localhost:3000
```

Untuk build produksi:

```bash
npm run build && npm start
```

**Deploy ke Vercel:** hubungkan repositori GitHub ini di vercel.com, lalu pilih **Import** dan **Deploy**.
Tidak perlu *environment variable*.

**Reset data demo:** masuk sebagai Admin Inspektorat, buka menu Audit Trail, lalu klik **Reset Data Demo**.

## Skenario demo

Lihat halaman **Panduan & Hak Akses** di aplikasi untuk skenario demo sekitar 10 menit,
dari input temuan sampai verifikasi.

## Atribusi

Kode prototipe disusun dengan bantuan AI (Claude, Anthropic), lalu ditinjau dan disesuaikan oleh penulis.
Pustaka yang dipakai: Next.js, React, dan Tailwind CSS (lisensi MIT).
