'use client';
import Link from 'next/link';
import { useSession, temuanTerlihat } from '@/lib/store';
import { ringkas, tugasSaya } from '@/lib/stats';
import { STATUS_TL, URUTAN_TL, STATUS_REVIU, OPD, can } from '@/lib/constants';
import { rupiah } from '@/lib/utils';
import { PageHeader, Empty, BadgeOPD } from '@/components/ui';

function Kpi({ label, value, sub, tone = 'text-navy-900' }) {
  return (
    <div className="card p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${tone}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function StackBar({ hitung, total }) {
  if (!total) return <div className="h-3 rounded-full bg-slate-100" />;
  return (
    <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
      {URUTAN_TL.map((k) => hitung[k] > 0 && (
        <div key={k} className={STATUS_TL[k].bar} style={{ width: `${(hitung[k] / total) * 100}%` }} title={`${STATUS_TL[k].label}: ${hitung[k]}`} />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data, user } = useSession();
  const list = temuanTerlihat(data, user);
  const s = ringkas(list);
  const tugas = tugasSaya(list, user);
  const opdIds = user.peran === 'admin_opd' ? [user.opdId] : Object.keys(OPD);

  return (
    <>
      <PageHeader
        title={`Selamat datang, ${user.nama.split(',')[0]}`}
        subtitle={user.peran === 'admin_opd' ? `Ringkasan tindak lanjut ${OPD[user.opdId]}` : 'Ringkasan pemantauan tindak lanjut seluruh OPD'}
      />

      {/* Tugas saya */}
      <section className="card mb-6 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-navy-900">Perlu Tindakan Anda</h2>
          <span className="rounded-full bg-navy-900 px-2.5 py-0.5 text-xs font-bold text-white">{tugas.length}</span>
        </div>
        {tugas.length === 0 ? (
          <Empty>Tidak ada pekerjaan yang menunggu Anda.</Empty>
        ) : (
          <ul className="divide-y divide-slate-100">
            {tugas.slice(0, 8).map((x, i) => (
              <li key={i}>
                <Link href={x.href} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 hover:bg-slate-50">
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">{x.teks}</span>
                  <span className="text-sm font-medium text-slate-800">{x.t.judul || '(tanpa judul)'}</span>
                  {x.r && <span className="text-xs text-slate-500">· Rek. {x.r.id}</span>}
                  <span className="ml-auto"><BadgeOPD id={x.t.opdId} /></span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* KPI */}
      <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label="Temuan (final)" value={s.jumlahTemuan} sub={`Nilai ${rupiah(s.nilaiTemuan)}`} />
        <Kpi label="Rekomendasi" value={s.totalRek} />
        <Kpi label="Penyelesaian TL" value={`${s.persenSelesai}%`} sub="Sesuai + TDD dari jumlah rekomendasi" tone="text-emerald-700" />
        <Kpi label="Nilai TL Sesuai" value={`${s.persenNilai}%`} sub={`${rupiah(s.nilaiSesuai)} dari ${rupiah(s.nilaiRek)}`} tone="text-emerald-700" />
        <Kpi label="Lewat Batas Waktu" value={s.lewat} sub="Rekomendasi belum selesai > 60 hari" tone={s.lewat ? 'text-rose-700' : 'text-navy-900'} />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status TL */}
        <section className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-bold text-navy-900">Status Tindak Lanjut per OPD</h2>
          <div className="space-y-5">
            {opdIds.map((id) => {
              const r = ringkas(list.filter((t) => t.opdId === id));
              return (
                <div key={id}>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-slate-800">{OPD[id]}</span>
                    <span className="text-slate-500">{r.totalRek} rekomendasi · <b className="text-emerald-700">{r.persenSelesai}% selesai</b></span>
                  </div>
                  <StackBar hitung={r.hitung} total={r.totalRek} />
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                    {URUTAN_TL.map((k) => (
                      <span key={k} className="inline-flex items-center gap-1.5"><i className={`h-2 w-2 rounded-full ${STATUS_TL[k].bar}`} />{STATUS_TL[k].short}: <b>{r.hitung[k]}</b></span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead><tr>
                <th className="th">OPD</th>
                {URUTAN_TL.map((k) => <th key={k} className="th text-right">{STATUS_TL[k].short}</th>)}
                <th className="th text-right">Nilai Rek.</th>
                <th className="th text-right">Lewat Batas</th>
              </tr></thead>
              <tbody>
                {opdIds.map((id) => {
                  const r = ringkas(list.filter((t) => t.opdId === id));
                  return (
                    <tr key={id}>
                      <td className="td font-medium">{id === 'PUPR' ? 'Dinas PUPR' : 'Dinas Pendidikan'}</td>
                      {URUTAN_TL.map((k) => <td key={k} className="td text-right">{r.hitung[k]}</td>)}
                      <td className="td text-right">{rupiah(r.nilaiRek)}</td>
                      <td className={`td text-right font-semibold ${r.lewat ? 'text-rose-700' : ''}`}>{r.lewat}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pipeline reviu */}
        {can.lihatSemua(user) ? (
          <section className="card p-5">
            <h2 className="mb-4 font-bold text-navy-900">Alur Reviu Temuan</h2>
            <ol className="space-y-2">
              {['draft', 'review_kt', 'review_dalnis', 'dikembalikan', 'final'].map((k) => {
                const n = list.filter((t) => t.statusReviu === k).length;
                return (
                  <li key={k} className={`flex items-center justify-between rounded-lg px-3 py-2.5 ring-1 ring-inset ${STATUS_REVIU[k].cls}`}>
                    <span className="text-sm font-semibold">{STATUS_REVIU[k].label}</span>
                    <span className="text-lg font-bold">{n}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              Anggota Tim → Ketua Tim → Dalnis → Final. Temuan yang dikembalikan kembali ke Anggota Tim untuk diperbaiki.
            </p>
          </section>
        ) : (
          <section className="card p-5">
            <h2 className="mb-2 font-bold text-navy-900">Batas Waktu</h2>
            <p className="text-sm text-slate-600">
              Tindak lanjut wajib disampaikan paling lambat <b>60 hari</b> sejak LHP diterima. Rekomendasi yang melewati batas
              waktu ditandai merah pada daftar temuan.
            </p>
            <Link href="/temuan" className="btn-primary mt-4">Lihat Temuan OPD</Link>
          </section>
        )}
      </div>
    </>
  );
}
