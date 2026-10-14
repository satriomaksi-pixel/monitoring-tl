'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSession, temuanTerlihat } from '@/lib/store';
import { can, STATUS_TL } from '@/lib/constants';
import { rupiah, tanggal, lewatBatas } from '@/lib/utils';
import { PageHeader, BadgeTL, BadgeOPD, Empty } from '@/components/ui';

export default function TindakLanjut() {
  const { data, user } = useSession();
  const opdMode = can.unggahBukti(user);
  const [tab, setTab] = useState('aksi');
  const [status, setStatus] = useState('');

  const semua = temuanTerlihat(data, user)
    .filter((t) => t.statusReviu === 'final')
    .flatMap((t) => t.rekomendasi.map((r) => ({ t, r })));
  const perluAksi = semua.filter(({ r }) => (opdMode ? ['BELUM', 'BELUM_SESUAI'].includes(r.statusTL) : r.statusTL === 'MENUNGGU'));
  const rows = (tab === 'aksi' ? perluAksi : semua).filter(({ r }) => !status || r.statusTL === status);

  return (
    <>
      <PageHeader
        title={opdMode ? 'Tindak Lanjut Rekomendasi' : 'Verifikasi Tindak Lanjut'}
        subtitle={opdMode ? 'Unggah bukti tindak lanjut atas rekomendasi yang belum selesai.' : 'Verifikasi bukti tindak lanjut yang diunggah oleh OPD.'}
      />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button className={tab === 'aksi' ? 'btn-primary' : 'btn-ghost'} onClick={() => setTab('aksi')}>
          {opdMode ? 'Perlu Diunggah' : 'Menunggu Verifikasi'} ({perluAksi.length})
        </button>
        <button className={tab === 'semua' ? 'btn-primary' : 'btn-ghost'} onClick={() => setTab('semua')}>Semua Rekomendasi ({semua.length})</button>
        <select className="input ml-auto w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Semua status</option>
          {Object.entries(STATUS_TL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {rows.length === 0 ? <Empty>Tidak ada rekomendasi pada daftar ini.</Empty> : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[820px]">
            <thead><tr>
              <th className="th">Rekomendasi</th>
              <th className="th">OPD</th>
              <th className="th text-right">Nilai</th>
              <th className="th">Batas Waktu</th>
              <th className="th">Status</th>
              <th className="th"></th>
            </tr></thead>
            <tbody>
              {rows.map(({ t, r }) => {
                const telat = lewatBatas(t, r);
                return (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="td max-w-md">
                      <div className="text-slate-800">{r.uraian}</div>
                      <div className="mt-0.5 text-xs text-slate-500">{r.id} · Temuan: {t.judul}</div>
                    </td>
                    <td className="td"><BadgeOPD id={t.opdId} /></td>
                    <td className="td whitespace-nowrap text-right">{rupiah(r.nilai)}</td>
                    <td className={`td whitespace-nowrap ${telat ? 'font-semibold text-rose-700' : ''}`}>{tanggal(t.batasWaktu)}{telat && <div className="text-xs">Lewat batas</div>}</td>
                    <td className="td"><BadgeTL status={r.statusTL} /></td>
                    <td className="td text-right"><Link href={`/temuan/${t.id}#${r.id}`} className="btn-ghost whitespace-nowrap px-3 py-1.5">Buka</Link></td>
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
