'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { simpanTemuan } from '@/lib/store';
import { OPD } from '@/lib/constants';
import { tambahHari } from '@/lib/utils';

const kosongRek = () => ({ uraian: '', nilai: '' });

const Field = ({ label, hint, children, className = '' }) => (
  <div className={className}>
    <label className="label">{label}</label>
    {children}
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

export default function TemuanForm({ user, awal }) {
  const router = useRouter();
  const [f, setF] = useState(() => awal ? { ...awal, nilaiTemuan: awal.nilaiTemuan || '' } : {
    nomorLhp: '', tanggalLhp: '', namaPemeriksaan: '', opdId: 'PUPR', judul: '',
    kondisi: '', kriteria: '', sebab: '', akibat: '', nilaiTemuan: '', batasWaktu: '', rekomendasi: [kosongRek()],
  });
  const [err, setErr] = useState('');

  const set = (k) => (e) => {
    const v = e.target.value;
    setF((p) => {
      const n = { ...p, [k]: v };
      if (k === 'tanggalLhp' && v) n.batasWaktu = tambahHari(v, 60);
      return n;
    });
  };
  const setRek = (i, k, v) => setF((p) => ({ ...p, rekomendasi: p.rekomendasi.map((r, j) => (j === i ? { ...r, [k]: v } : r)) }));

  const submit = (ajukan) => {
    setErr('');
    if (!f.judul.trim()) return setErr('Judul temuan wajib diisi.');
    if (ajukan) {
      const wajib = ['namaPemeriksaan', 'kondisi', 'kriteria', 'sebab', 'akibat'];
      if (wajib.some((k) => !String(f[k]).trim())) return setErr('Lengkapi unsur temuan (nama pemeriksaan, kondisi, kriteria, sebab, akibat) sebelum diajukan.');
      if (f.rekomendasi.length === 0 || f.rekomendasi.some((r) => !r.uraian.trim())) return setErr('Setiap rekomendasi wajib memiliki uraian.');
    }
    try {
      const id = simpanTemuan(user, f, ajukan);
      router.push(`/temuan/${id}`);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <section className="card p-5">
        <h2 className="mb-4 font-bold text-navy-900">Identitas Pemeriksaan</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama Pemeriksaan" className="sm:col-span-2"><input className="input" value={f.namaPemeriksaan} onChange={set('namaPemeriksaan')} placeholder="mis. Pemeriksaan Reguler Dinas PUPR TA 2025" /></Field>
          <Field label="OPD / Obrik">
            <select className="input" value={f.opdId} onChange={set('opdId')}>
              {Object.entries(OPD).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="Nomor LHP" hint="Boleh dikosongkan bila LHP belum terbit"><input className="input" value={f.nomorLhp} onChange={set('nomorLhp')} placeholder="700/xxx/LHP-ITKAB/…/2026" /></Field>
          <Field label="Tanggal LHP" hint="Jika kosong, diisi otomatis saat disetujui Dalnis"><input type="date" className="input" value={f.tanggalLhp} onChange={set('tanggalLhp')} /></Field>
          <Field label="Batas Waktu Tindak Lanjut" hint="Otomatis 60 hari sejak tanggal LHP"><input type="date" className="input" value={f.batasWaktu} onChange={set('batasWaktu')} /></Field>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-4 font-bold text-navy-900">Unsur Temuan</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Judul Temuan" className="sm:col-span-2"><input className="input" value={f.judul} onChange={set('judul')} /></Field>
          <Field label="Kondisi" className="sm:col-span-2"><textarea rows={3} className="input" value={f.kondisi} onChange={set('kondisi')} /></Field>
          <Field label="Kriteria" className="sm:col-span-2"><textarea rows={2} className="input" value={f.kriteria} onChange={set('kriteria')} /></Field>
          <Field label="Sebab"><textarea rows={3} className="input" value={f.sebab} onChange={set('sebab')} /></Field>
          <Field label="Akibat"><textarea rows={3} className="input" value={f.akibat} onChange={set('akibat')} /></Field>
          <Field label="Nilai Temuan (Rp)" hint="Isi 0 untuk temuan administratif"><input type="number" min="0" className="input" value={f.nilaiTemuan} onChange={set('nilaiTemuan')} /></Field>
        </div>
      </section>

      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-navy-900">Rekomendasi</h2>
          <button type="button" className="btn-ghost" onClick={() => setF((p) => ({ ...p, rekomendasi: [...p.rekomendasi, kosongRek()] }))}>+ Tambah Rekomendasi</button>
        </div>
        <div className="space-y-3">
          {f.rekomendasi.map((r, i) => (
            <div key={i} className="grid gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[2rem_1fr_12rem_auto]">
              <div className="pt-2 text-sm font-bold text-slate-400">{String.fromCharCode(97 + i)}.</div>
              <textarea rows={2} className="input" placeholder="Uraian rekomendasi" value={r.uraian} onChange={(e) => setRek(i, 'uraian', e.target.value)} />
              <input type="number" min="0" className="input" placeholder="Nilai (Rp)" value={r.nilai} onChange={(e) => setRek(i, 'nilai', e.target.value)} />
              <button type="button" className="btn-ghost text-rose-600" disabled={f.rekomendasi.length === 1}
                onClick={() => setF((p) => ({ ...p, rekomendasi: p.rekomendasi.filter((_, j) => j !== i) }))}>Hapus</button>
            </div>
          ))}
        </div>
      </section>

      {err && <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-200">{err}</div>}
      <div className="flex flex-wrap justify-end gap-2">
        <button className="btn-ghost" onClick={() => router.back()}>Batal</button>
        <button className="btn-ghost" onClick={() => submit(false)}>Simpan Draf</button>
        <button className="btn-primary" onClick={() => submit(true)}>Simpan & Ajukan ke Ketua Tim</button>
      </div>
    </div>
  );
}
