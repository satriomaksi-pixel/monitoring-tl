'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSession, temuanTerlihat, namaUser } from '@/lib/store';
import { STATUS_REVIU, STATUS_TL, OPD, can } from '@/lib/constants';
import { rupiah, tanggal, lewatBatas, sisaHari } from '@/lib/utils';
import { PageHeader, BadgeReviu, BadgeOPD, Empty } from '@/components/ui';

export default function DaftarTemuan() {
  const { data, user } = useSession();
  const [q, setQ] = useState('');
  const [opd, setOpd] = useState('');
  const [rev, setRev] = useState('');
  const [tl, setTl] = useState('');

  const list = useMemo(() => {
    return temuanTerlihat(data, user).filter((t) => {
      if (opd && t.opdId !== opd) return false;
      if (rev && t.statusReviu !== rev) return false;
      if (tl && !t.rekomendasi.some((r) => r.statusTL === tl)) return false;
      if (q) {
        const s = `${t.judul} ${t.nomorLhp} ${t.namaPemeriksaan}`.toLowerCase();
        if (!s.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [data, user, q, opd, rev, tl]);

  const internal = can.lihatSemua(user);

  return (
    <>
      <PageHeader
        title="Daftar Temuan"
        subtitle={internal ? 'Seluruh temuan hasil pengawasan (semua status)' : `Temuan final untuk ${OPD[user.opdId]}`}
        actions={can.inputTemuan(user) && <Link href="/temuan/baru" className="btn-primary">+ Input Temuan</Link>}
      />

      <div className="card mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input className="input" placeholder="Cari judul / nomor LHP…" value={q} onChange={(e) => setQ(e.target.value)} />
        {internal && (
          <select className="input" value={opd} onChange={(e) => setOpd(e.target.value)}>
            <option value="">Semua OPD</option>
            {Object.entries(OPD).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        )}
        {internal && (
          <select className="input" value={rev} onChange={(e) => setRev(e.target.value)}>
            <option value="">Semua status reviu</option>
            {Object.entries(STATUS_REVIU).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        )}
        <select className="input" value={tl} onChange={(e) => setTl(e.target.value)}>
          <option value="">Semua status tindak lanjut</option>
          {Object.entries(STATUS_TL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {list.length === 0 ? <Empty>Tidak ada temuan yang sesuai filter.</Empty> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead><tr>
              <th className="th">Temuan</th>
              <th className="th">OPD</th>
              <th className="th">Status Reviu</th>
              <th className="th">Progres Rekomendasi</th>
              <th className="th text-right">Nilai Temuan</th>
              <th className="th">Batas Waktu</th>
            </tr></thead>
            <tbody>
              {list.map((t) => {
                const total = t.rekomendasi.length;
                const selesai = t.rekomendasi.filter((r) => ['SESUAI', 'TDD'].includes(r.statusTL)).length;
                const telat = t.rekomendasi.some((r) => lewatBatas(t, r));
                const sisa = sisaHari(t.batasWaktu);
                return (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="td max-w-md">
                      <Link href={`/temuan/${t.id}`} className="font-semibold text-navy-800 hover:underline">{t.judul || '(tanpa judul)'}</Link>
                      <div className="mt-0.5 text-xs text-slate-500">{t.id} · {t.nomorLhp || 'LHP belum terbit'} · oleh {namaUser(t.dibuatOleh)}</div>
                    </td>
                    <td className="td"><BadgeOPD id={t.opdId} /></td>
                    <td className="td"><BadgeReviu status={t.statusReviu} /></td>
                    <td className="td">
                      {t.statusReviu === 'final' ? (
                        <div className="w-40">
                          <div className="mb-1 text-xs text-slate-600">{selesai}/{total} selesai</div>
                          <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                            {t.rekomendasi.map((r) => <div key={r.id} className={`${STATUS_TL[r.statusTL].bar} border-r border-white`} style={{ width: `${100 / total}%` }} title={STATUS_TL[r.statusTL].label} />)}
                          </div>
                        </div>
                      ) : <span className="text-xs text-slate-400">Belum terbit</span>}
                    </td>
                    <td className="td text-right whitespace-nowrap">{rupiah(t.nilaiTemuan)}</td>
                    <td className="td whitespace-nowrap">
                      {t.batasWaktu ? (
                        <>
                          <div className={telat ? 'font-semibold text-rose-700' : ''}>{tanggal(t.batasWaktu)}</div>
                          {t.statusReviu === 'final' && selesai < total && (
                            <div className={`text-xs ${telat ? 'text-rose-600' : 'text-slate-500'}`}>{telat ? `Lewat ${-sisa} hari` : `${sisa} hari lagi`}</div>
                          )}
                        </>
                      ) : <span className="text-xs text-slate-400">-</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
