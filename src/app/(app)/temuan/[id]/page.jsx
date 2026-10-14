'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useSession, temuanTerlihat, namaUser, getUser, reviuTemuan, unggahBukti, verifikasiTL } from '@/lib/store';
import { can, PERAN, STATUS_TL } from '@/lib/constants';
import { rupiah, tanggal, waktu, lewatBatas, sisaHari } from '@/lib/utils';
import { PageHeader, BadgeReviu, BadgeTL, Empty, namaOPD } from '@/components/ui';

const MAX_FILE = 400 * 1024; // file <= 400 KB disimpan isinya agar bisa dibuka; selebihnya hanya metadata

function Info({ label, children }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm text-slate-800">{children || '-'}</div>
    </div>
  );
}

function Unsur({ label, text }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wide text-navy-700">{label}</h3>
      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">{text || <span className="text-slate-400">(belum diisi)</span>}</p>
    </div>
  );
}

function PanelReviu({ user, t }) {
  const [catatan, setCatatan] = useState('');
  const [err, setErr] = useState('');
  const go = (setuju) => {
    setErr('');
    try { reviuTemuan(user, t.id, setuju, catatan); setCatatan(''); } catch (e) { setErr(e.message); }
  };
  const tahap = user.peran === 'ketua_tim' ? 'Ketua Tim' : 'Dalnis';
  return (
    <section className="card border-l-4 border-l-amber-400 p-5">
      <h2 className="font-bold text-navy-900">Reviu {tahap}</h2>
      <p className="mt-1 text-sm text-slate-600">
        {user.peran === 'ketua_tim' ? 'Setujui untuk meneruskan ke Dalnis, atau kembalikan ke Anggota Tim dengan catatan perbaikan.'
          : 'Setujui untuk menetapkan temuan final dan menerbitkannya ke OPD, atau kembalikan ke Anggota Tim.'}
      </p>
      <textarea rows={3} className="input mt-3" placeholder="Catatan reviu (wajib bila dikembalikan)" value={catatan} onChange={(e) => setCatatan(e.target.value)} />
      {err && <p className="mt-2 text-sm text-rose-700">{err}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn-success" onClick={() => go(true)}>{user.peran === 'ketua_tim' ? 'Setujui → Dalnis' : 'Setujui → Final & Terbit ke OPD'}</button>
        <button className="btn-warn" onClick={() => go(false)}>Kembalikan ke Anggota Tim</button>
      </div>
    </section>
  );
}

function FormBukti({ user, t, r }) {
  const [file, setFile] = useState(null);
  const [ket, setKet] = useState('');
  const [err, setErr] = useState('');
  const kirim = async () => {
    setErr('');
    if (!file) return setErr('Pilih file bukti terlebih dahulu.');
    if (!ket.trim()) return setErr('Keterangan tindak lanjut wajib diisi.');
    let dataUrl = null;
    if (file.size <= MAX_FILE) {
      dataUrl = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(file); });
    }
    try {
      unggahBukti(user, t.id, r.id, { namaFile: file.name, ukuran: file.size, dataUrl, keterangan: ket });
    } catch (e) { setErr(e.message); }
  };
  return (
    <div className="mt-3 rounded-lg bg-sky-50 p-3 ring-1 ring-sky-200">
      <div className="mb-2 text-sm font-semibold text-sky-900">Unggah Bukti Tindak Lanjut</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input type="file" className="input bg-white" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input className="input" placeholder="Keterangan (mis. STS setoran Rp …)" value={ket} onChange={(e) => setKet(e.target.value)} />
      </div>
      <p className="mt-1 text-xs text-sky-800/70">Prototipe: file ≤ 400 KB disimpan dan dapat dibuka; file lebih besar hanya dicatat nama & ukurannya.</p>
      {err && <p className="mt-2 text-sm text-rose-700">{err}</p>}
      <button className="btn-primary mt-2" onClick={kirim}>Kirim untuk Diverifikasi</button>
    </div>
  );
}

function FormVerifikasi({ user, t, r }) {
  const [hasil, setHasil] = useState('SESUAI');
  const [cat, setCat] = useState('');
  const [err, setErr] = useState('');
  const go = () => { setErr(''); try { verifikasiTL(user, t.id, r.id, hasil, cat); } catch (e) { setErr(e.message); } };
  return (
    <div className="mt-3 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
      <div className="mb-2 text-sm font-semibold text-amber-900">Verifikasi Bukti Tindak Lanjut</div>
      <div className="grid gap-2 sm:grid-cols-[14rem_1fr]">
        <select className="input" value={hasil} onChange={(e) => setHasil(e.target.value)}>
          <option value="SESUAI">Sesuai</option>
          <option value="BELUM_SESUAI">Belum Sesuai</option>
          <option value="TDD">Tidak Dapat Ditindaklanjuti</option>
        </select>
        <input className="input" placeholder="Catatan verifikasi (wajib bila bukan Sesuai)" value={cat} onChange={(e) => setCat(e.target.value)} />
      </div>
      {err && <p className="mt-2 text-sm text-rose-700">{err}</p>}
      <button className="btn-primary mt-2" onClick={go}>Simpan Hasil Verifikasi</button>
    </div>
  );
}

function KartuRekomendasi({ user, t, r, i }) {
  const telat = lewatBatas(t, r);
  const timeline = [
    ...r.bukti.map((b) => ({ jenis: 'bukti', w: b.waktu, b })),
    ...r.verifikasi.map((v) => ({ jenis: 'verif', w: v.waktu, v })),
  ].sort((a, b) => a.w.localeCompare(b.w));

  return (
    <div id={r.id} className={`rounded-xl border p-4 ${telat ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'}`}>
      <div className="flex flex-wrap items-start gap-3">
        <span className="text-sm font-bold text-slate-400">{String.fromCharCode(97 + i)}.</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-800">{r.uraian || <span className="text-slate-400">(belum diisi)</span>}</p>
          <div className="mt-1 text-xs text-slate-500">{r.id} · Nilai {rupiah(r.nilai)}{telat && <b className="ml-2 text-rose-700">· Lewat batas waktu</b>}</div>
        </div>
        {t.statusReviu === 'final' && <BadgeTL status={r.statusTL} />}
      </div>

      {timeline.length > 0 && (
        <ol className="ml-6 mt-3 space-y-2 border-l-2 border-slate-200 pl-4">
          {timeline.map((x, k) => x.jenis === 'bukti' ? (
            <li key={k} className="text-sm">
              <div className="text-xs text-slate-500">{waktu(x.w)} · {namaUser(x.b.oleh)}</div>
              <div><span className="text-xs font-semibold text-slate-500">Bukti: </span>{x.b.dataUrl
                ? <a className="font-medium text-navy-700 underline" href={x.b.dataUrl} download={x.b.namaFile}>{x.b.namaFile}</a>
                : <span className="font-medium">{x.b.namaFile}</span>}
                <span className="text-xs text-slate-500"> ({Math.round(x.b.ukuran / 1024)} KB)</span></div>
              <div className="text-slate-600">{x.b.keterangan}</div>
            </li>
          ) : (
            <li key={k} className="text-sm">
              <div className="text-xs text-slate-500">{waktu(x.w)} · Verifikasi oleh {namaUser(x.v.oleh)} ({PERAN[getUser(x.v.oleh)?.peran]})</div>
              <div><BadgeTL status={x.v.hasil} /> <span className="text-slate-600">{x.v.catatan}</span></div>
            </li>
          ))}
        </ol>
      )}

      {t.statusReviu === 'final' && can.unggahBukti(user) && ['BELUM', 'BELUM_SESUAI'].includes(r.statusTL) && <FormBukti user={user} t={t} r={r} />}
      {t.statusReviu === 'final' && can.verifikasi(user) && r.statusTL === 'MENUNGGU' && <FormVerifikasi user={user} t={t} r={r} />}
    </div>
  );
}

export default function DetailTemuan() {
  const { id } = useParams();
  const { data, user } = useSession();
  const t = temuanTerlihat(data, user).find((x) => x.id === id);
  if (!t) return <Empty>Temuan tidak ditemukan atau Anda tidak memiliki akses.</Empty>;

  const bisaReviu = (can.reviuKetua(user) && t.statusReviu === 'review_kt') || (can.reviuDalnis(user) && t.statusReviu === 'review_dalnis');
  const bisaUbah = can.inputTemuan(user) && ['draft', 'dikembalikan'].includes(t.statusReviu);
  const sisa = sisaHari(t.batasWaktu);
  const catatanTerakhir = [...t.riwayat].reverse().find((h) => h.aksi.startsWith('Dikembalikan'));

  return (
    <>
      <Link href="/temuan" className="mb-3 inline-block text-sm text-navy-700 hover:underline">← Kembali ke daftar</Link>
      <PageHeader
        title={t.judul || '(tanpa judul)'}
        subtitle={`${t.id} · ${namaOPD(t.opdId)}`}
        actions={<>
          <BadgeReviu status={t.statusReviu} />
          {bisaUbah && <Link href={`/temuan/${t.id}/ubah`} className="btn-primary">Perbaiki / Lengkapi</Link>}
        </>}
      />

      {t.statusReviu === 'dikembalikan' && catatanTerakhir && can.lihatSemua(user) && (
        <div className="mb-6 rounded-lg bg-orange-50 p-4 text-sm text-orange-900 ring-1 ring-orange-200">
          <b>Catatan pengembalian dari {namaUser(catatanTerakhir.oleh)}:</b> {catatanTerakhir.catatan}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {bisaReviu && <PanelReviu user={user} t={t} />}

          <section className="card space-y-4 p-5">
            <Unsur label="Kondisi" text={t.kondisi} />
            <Unsur label="Kriteria" text={t.kriteria} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Unsur label="Sebab" text={t.sebab} />
              <Unsur label="Akibat" text={t.akibat} />
            </div>
          </section>

          <section className="card p-5">
            <h2 className="mb-3 font-bold text-navy-900">Rekomendasi & Tindak Lanjut</h2>
            {t.statusReviu !== 'final' && <p className="mb-3 text-xs text-slate-500">Status tindak lanjut aktif setelah temuan disetujui Dalnis (final).</p>}
            <div className="space-y-3">
              {t.rekomendasi.map((r, i) => <KartuRekomendasi key={r.id} user={user} t={t} r={r} i={i} />)}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card grid gap-3 p-5">
            <Info label="Nama Pemeriksaan">{t.namaPemeriksaan}</Info>
            <Info label="Nomor LHP">{t.nomorLhp}</Info>
            <Info label="Tanggal LHP">{tanggal(t.tanggalLhp)}</Info>
            <Info label="Nilai Temuan">{rupiah(t.nilaiTemuan)}</Info>
            <Info label="Batas Waktu TL">
              {tanggal(t.batasWaktu)}
              {t.statusReviu === 'final' && sisa !== null && <span className={`ml-2 text-xs ${sisa < 0 ? 'text-rose-700' : 'text-slate-500'}`}>({sisa < 0 ? `lewat ${-sisa} hari` : `${sisa} hari lagi`})</span>}
            </Info>
            <Info label="Disusun oleh">{namaUser(t.dibuatOleh)}</Info>
          </section>

          {can.lihatSemua(user) && (
            <section className="card p-5">
              <h2 className="mb-3 font-bold text-navy-900">Riwayat Reviu</h2>
              {t.riwayat.length === 0 ? <p className="text-sm text-slate-500">Belum diajukan.</p> : (
                <ol className="space-y-3 border-l-2 border-slate-200 pl-4">
                  {t.riwayat.map((h, k) => (
                    <li key={k} className="text-sm">
                      <div className="text-xs text-slate-500">{waktu(h.waktu)}</div>
                      <div className="font-semibold text-slate-800">{h.aksi}</div>
                      <div className="text-xs text-slate-500">{namaUser(h.oleh)} · {PERAN[getUser(h.oleh)?.peran]}</div>
                      {h.catatan && <div className="mt-1 rounded bg-slate-50 p-2 text-slate-600">{h.catatan}</div>}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )}

          <section className="card p-5 text-xs text-slate-500">
            <div className="mb-2 font-semibold text-slate-700">Keterangan status TL</div>
            <ul className="space-y-1">
              {Object.keys(STATUS_TL).map((k) => <li key={k}><BadgeTL status={k} /></li>)}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
