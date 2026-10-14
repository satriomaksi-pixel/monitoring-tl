'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { USERS } from '@/lib/seed';
import { login, useSession } from '@/lib/store';
import { PERAN, DESKRIPSI_PERAN } from '@/lib/constants';
import { Brand } from '@/components/AppShell';
import Footer from '@/components/Footer';

const GRUP = [
  { judul: 'Pimpinan & Admin Inspektorat', peran: ['inspektur', 'admin_inspektorat'] },
  { judul: 'Tim Pemeriksa', peran: ['dalnis', 'ketua_tim', 'anggota_tim'] },
  { judul: 'Perangkat Daerah (OPD)', peran: ['admin_opd'] },
];

export default function LoginPage() {
  const router = useRouter();
  const { user, ready } = useSession();

  useEffect(() => {
    if (ready && user) router.replace('/dashboard');
  }, [ready, user, router]);

  const masuk = (id) => {
    login(id);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-navy-900 px-4 pb-24 pt-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Brand light />
          <h1 className="mt-10 text-3xl font-bold text-white sm:text-4xl">Pantau tindak lanjut temuan, dari LHP sampai tuntas</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Prototipe digitalisasi proses input temuan, reviu berjenjang, unggah bukti tindak lanjut oleh OPD,
            dan verifikasi oleh Inspektorat — dengan dashboard pemantauan dan audit trail.
          </p>
        </div>
      </div>

      <main className="mx-auto -mt-16 w-full max-w-5xl flex-1 px-4 pb-12 sm:px-6">
        <div className="card p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-navy-900">Login Simulasi — Pilih Akun</h2>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-300">
              Mode prototipe: tanpa kata sandi
            </span>
          </div>
          <div className="space-y-6">
            {GRUP.map((g) => (
              <section key={g.judul}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{g.judul}</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {USERS.filter((u) => g.peran.includes(u.peran)).map((u) => (
                    <button key={u.id} onClick={() => masuk(u.id)} disabled={!ready}
                      className="group rounded-xl border border-slate-200 p-4 text-left transition hover:border-navy-700 hover:shadow-md disabled:opacity-60">
                      <div className="text-sm font-bold text-navy-900 group-hover:text-navy-700">{PERAN[u.peran]}{u.opdId ? ` — ${u.opdId === 'PUPR' ? 'Dinas PUPR' : 'Disdikbud'}` : ''}</div>
                      <div className="text-sm text-slate-600">{u.nama}</div>
                      <div className="mt-2 text-xs leading-relaxed text-slate-500">{DESKRIPSI_PERAN[u.peran]}</div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Data temuan adalah simulasi; nama penyedia, sekolah, dan nomor dokumen fiktif (UU No. 27/2022 tentang PDP). Data tersimpan di browser masing-masing pengguna.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
