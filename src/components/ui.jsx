'use client';
import { STATUS_REVIU, STATUS_TL, PERAN, OPD } from '@/lib/constants';

export function Badge({ cls, children }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cls}`}>
      {children}
    </span>
  );
}

export const BadgeReviu = ({ status }) => <Badge cls={STATUS_REVIU[status]?.cls}>{STATUS_REVIU[status]?.label}</Badge>;
export const BadgeTL = ({ status }) => <Badge cls={STATUS_TL[status]?.cls}>{STATUS_TL[status]?.label}</Badge>;
export const BadgePeran = ({ user }) => (
  <Badge cls="bg-navy-900/5 text-navy-800 ring-navy-800/20">
    {PERAN[user.peran]}{user.opdId ? ` · ${user.opdId}` : ''}
  </Badge>
);
export const BadgeOPD = ({ id }) => <Badge cls="bg-white text-slate-700 ring-slate-300" >{id === 'PUPR' ? 'Dinas PUPR' : 'Disdikbud'}</Badge>;
export const namaOPD = (id) => OPD[id] || id;

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Empty({ children }) {
  return <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">{children}</div>;
}

export function Loading() {
  return <div className="p-10 text-center text-sm text-slate-500">Memuat data…</div>;
}
