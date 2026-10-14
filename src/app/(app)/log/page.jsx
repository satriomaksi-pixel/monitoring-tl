'use client';
import { useState } from 'react';
import { useSession, namaUser, getUser, resetData } from '@/lib/store';
import { can, PERAN } from '@/lib/constants';
import { waktu } from '@/lib/utils';
import { PageHeader, Empty } from '@/components/ui';

export default function AuditTrail() {
  const { data, user } = useSession();
  const [q, setQ] = useState('');
  const [konfirmasi, setKonfirmasi] = useState(false);
  if (!can.lihatLog(user)) return <Empty>Audit trail hanya dapat dilihat oleh Inspektur dan Admin Inspektorat.</Empty>;

  const rows = data.log.filter((l) => !q || `${l.aksi} ${l.objek} ${l.detail} ${namaUser(l.userId)}`.toLowerCase().includes(q.toLowerCase()));

  const unduhCsv = () => {
    const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const csv = ['Waktu,Pengguna,Peran,Aksi,Objek,Detail', ...data.log.map((l) => [l.waktu, namaUser(l.userId), PERAN[getUser(l.userId)?.peran], l.aksi, l.objek, l.detail].map(esc).join(','))].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'audit-trail-monitoring-tl.csv';
    a.click();
  };

  return (
    <>
      <PageHeader
        title="Audit Trail"
        subtitle="Jejak seluruh aktivitas pengguna (siapa, kapan, melakukan apa) untuk akuntabilitas."
        actions={<>
          <button className="btn-ghost" onClick={unduhCsv}>Unduh CSV</button>
          {can.resetData(user) && (konfirmasi
            ? <button className="btn-warn" onClick={() => { resetData(user); setKonfirmasi(false); }}>Yakin reset?</button>
            : <button className="btn-ghost text-rose-700" onClick={() => setKonfirmasi(true)}>Reset Data Demo</button>)}
        </>}
      />
      <input className="input mb-4 max-w-sm" placeholder="Cari aktivitas…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead><tr>
            <th className="th">Waktu</th><th className="th">Pengguna</th><th className="th">Aksi</th><th className="th">Objek</th><th className="th">Detail</th>
          </tr></thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td className="td whitespace-nowrap text-slate-500">{waktu(l.waktu)}</td>
                <td className="td"><div className="font-medium">{namaUser(l.userId)}</div><div className="text-xs text-slate-500">{PERAN[getUser(l.userId)?.peran]}</div></td>
                <td className="td">{l.aksi}</td>
                <td className="td whitespace-nowrap font-mono text-xs">{l.objek}</td>
                <td className="td max-w-xs text-slate-600">{l.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
