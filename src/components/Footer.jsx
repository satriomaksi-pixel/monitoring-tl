// Identitas mahasiswa — ubah di sini bila perlu
const ANGGOTA = [
  { nama: 'Satrio Endriatomo', nim: '2501058007' },
  { nama: 'Nurul Fajri Rasyidah', nim: '2501058011' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {ANGGOTA.map((a) => (
            <div key={a.nim}>
              <div className="font-semibold text-slate-800">{a.nama}</div>
              <div className="text-xs font-medium text-amber-700">NIM: {a.nim}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-slate-500 sm:text-right">
          <div className="italic">Mata Kuliah Transformasi Digital dan Kepemimpinan</div>
          <div>Magister Akuntansi FEB Universitas Mulawarman · 2026</div>
        </div>
      </div>
    </footer>
  );
}
