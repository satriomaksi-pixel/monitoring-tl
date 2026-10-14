'use client';
import { PERAN, DESKRIPSI_PERAN, STATUS_TL } from '@/lib/constants';
import { PageHeader, BadgeTL } from '@/components/ui';

const MATRIKS = [
  ['Lihat temuan semua OPD', 'inspektur admin_inspektorat dalnis ketua_tim anggota_tim'],
  ['Lihat temuan OPD sendiri (final saja)', 'admin_opd'],
  ['Input & perbaiki temuan', 'anggota_tim'],
  ['Reviu tahap 1 (setujui / kembalikan)', 'ketua_tim'],
  ['Reviu tahap 2 → final & terbit ke OPD', 'dalnis'],
  ['Unggah bukti tindak lanjut', 'admin_opd'],
  ['Verifikasi bukti tindak lanjut', 'admin_inspektorat dalnis ketua_tim'],
  ['Lihat audit trail', 'inspektur admin_inspektorat'],
  ['Reset data demo', 'admin_inspektorat'],
];
const KOLOM = ['inspektur', 'admin_inspektorat', 'dalnis', 'ketua_tim', 'anggota_tim', 'admin_opd'];

const ALUR = [
  ['1', 'Anggota Tim', 'Input temuan (kondisi, kriteria, sebab, akibat) & rekomendasi'],
  ['2', 'Ketua Tim', 'Reviu: setujui → Dalnis, atau kembalikan ke Anggota Tim'],
  ['3', 'Dalnis', 'Reviu: setujui → final & terbit ke OPD, atau kembalikan'],
  ['4', 'Admin OPD', 'Unggah bukti tindak lanjut per rekomendasi'],
  ['5', 'Inspektorat', 'Verifikasi: Sesuai / Belum Sesuai / TDD'],
  ['6', 'Inspektur', 'Pantau dashboard, batas waktu & audit trail'],
];

const SKENARIO = [
  'Masuk sebagai Anggota Tim (Dimas) → buka draf "Kelebihan pembayaran TPP" → lengkapi → Simpan & Ajukan.',
  'Ganti akun ke Ketua Tim → Dashboard menampilkan tugas reviu → buka temuan → Kembalikan dengan catatan.',
  'Ganti ke Anggota Tim → perbaiki sesuai catatan → ajukan lagi → Ketua Tim menyetujui.',
  'Ganti ke Dalnis → setujui → temuan final dan batas waktu 60 hari terisi otomatis.',
  'Ganti ke Admin Dinas Pendidikan → hanya melihat temuan Disdik → unggah bukti tindak lanjut.',
  'Ganti ke Admin Dinas PUPR → buktikan bahwa temuan Disdik tidak terlihat (pembatasan akses).',
  'Ganti ke Admin Inspektorat → menu Tindak Lanjut → verifikasi "Sesuai" → dashboard ter-update.',
  'Masuk sebagai Inspektur → lihat dashboard semua OPD dan Audit Trail seluruh aktivitas.',
];

export default function Panduan() {
  return (
    <>
      <PageHeader title="Panduan & Hak Akses" subtitle="Alur proses to-be, matriks hak akses per peran, dan skenario demo." />

      <section className="card mb-6 p-5">
        <h2 className="mb-4 font-bold text-navy-900">Alur Proses (to-be)</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ALUR.map(([n, siapa, apa]) => (
            <li key={n} className="flex gap-3 rounded-lg border border-slate-200 p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-800 text-sm font-bold text-white">{n}</span>
              <div><div className="text-sm font-bold text-navy-900">{siapa}</div><div className="text-sm text-slate-600">{apa}</div></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card mb-6 overflow-x-auto p-5">
        <h2 className="mb-4 font-bold text-navy-900">Matriks Hak Akses</h2>
        <table className="w-full min-w-[760px]">
          <thead><tr>
            <th className="th">Fungsi</th>
            {KOLOM.map((k) => <th key={k} className="th text-center">{PERAN[k].replace(' (Dalnis)', '')}</th>)}
          </tr></thead>
          <tbody>
            {MATRIKS.map(([f, siapa]) => (
              <tr key={f}>
                <td className="td">{f}</td>
                {KOLOM.map((k) => <td key={k} className="td text-center">{siapa.split(' ').includes(k) ? <span className="font-bold text-emerald-600">✓</span> : <span className="text-slate-300">—</span>}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {KOLOM.map((k) => <p key={k}><b className="text-navy-900">{PERAN[k]}:</b> <span className="text-slate-600">{DESKRIPSI_PERAN[k]}</span></p>)}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-3 font-bold text-navy-900">Kategori Status Tindak Lanjut</h2>
          <ul className="space-y-2 text-sm">
            <li><BadgeTL status="SESUAI" /> — tindak lanjut telah sesuai rekomendasi.</li>
            <li><BadgeTL status="BELUM_SESUAI" /> — sudah ditindaklanjuti namun belum sesuai/belum lengkap.</li>
            <li><BadgeTL status="BELUM" /> — belum ada tindak lanjut.</li>
            <li><BadgeTL status="TDD" /> — tidak dapat ditindaklanjuti dengan alasan sah.</li>
            <li><BadgeTL status="MENUNGGU" /> — status proses: bukti diunggah, menunggu verifikasi ({STATUS_TL.MENUNGGU.short}).</li>
          </ul>
        </section>
        <section className="card p-5">
          <h2 className="mb-3 font-bold text-navy-900">Skenario Demo (± 10 menit)</h2>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
            {SKENARIO.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </section>
      </div>
    </>
  );
}
