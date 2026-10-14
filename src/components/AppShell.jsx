'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession, logout } from '@/lib/store';
import { can, PERAN } from '@/lib/constants';
import { Loading } from './ui';
import Footer from './Footer';

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const NAV = [
  { href: '/dashboard', label: 'Dashboard', d: 'M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z', show: () => true },
  { href: '/temuan', label: 'Daftar Temuan', d: 'M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v14l-3-2-2 2-2-2-2 2-2-2-3 2V6a2 2 0 012-2z', show: () => true },
  { href: '/temuan/baru', label: 'Input Temuan', d: 'M12 5v14m-7-7h14', show: can.inputTemuan },
  { href: '/tindak-lanjut', label: 'Tindak Lanjut', d: 'M9 12l2 2 4-4M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z', show: (u) => can.unggahBukti(u) || can.verifikasi(u) },
  { href: '/log', label: 'Audit Trail', d: 'M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z', show: can.lihatLog },
  { href: '/panduan', label: 'Panduan & Hak Akses', d: 'M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', show: () => true },
];

export function Brand({ light }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400 text-navy-950">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v5c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V7l8-4zm-3 9l2 2 4-4" /></svg>
      </div>
      <div className="leading-tight">
        <div className={`text-base font-extrabold ${light ? 'text-white' : 'text-navy-900'}`}>Monitoring Tindak Lanjut</div>
        <div className={`text-xs font-semibold tracking-wide ${light ? 'text-amber-300' : 'text-amber-700'}`}>Temuan APIP</div>
      </div>
    </div>
  );
}

export default function AppShell({ children }) {
  const { user, ready } = useSession();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace('/');
  }, [ready, user, router]);

  if (!ready || !user) return <Loading />;

  const items = NAV.filter((n) => n.show(user));
  const active = (href) => (href === '/temuan' ? path === '/temuan' || (/^\/temuan\/(?!baru)/.test(path)) : path.startsWith(href));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-navy-900 text-slate-200 transition-transform lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="border-b border-white/10 px-5 py-5"><Brand light /></div>
        <nav className="space-y-1 p-3">
          {items.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${active(n.href) ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
              <Icon d={n.d} />{n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-white/10 p-4 text-xs text-slate-400">
          Prototipe akademik · data simulasi (anonim)
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <button className="btn-ghost px-2.5 lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <Icon d="M4 6h16M4 12h16M4 18h16" />
          </button>
          <div className="hidden text-sm text-slate-500 sm:block">Inspektorat Daerah Kabupaten · <span className="font-semibold text-amber-700">Mode Prototipe</span></div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right leading-tight">
              <div className="text-sm font-semibold text-slate-800">{user.nama}</div>
              <div className="text-xs text-slate-500">{PERAN[user.peran]}{user.opdId ? ` · ${user.opdId}` : ''}</div>
            </div>
            <button className="btn-ghost" onClick={() => { logout(); router.replace('/'); }}>Ganti Akun</button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
