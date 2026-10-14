// Peran pengguna, OPD, dan kategori status yang dipakai di seluruh aplikasi.

export const PERAN = {
  inspektur: 'Inspektur',
  admin_inspektorat: 'Admin Inspektorat',
  dalnis: 'Pengendali Teknis (Dalnis)',
  ketua_tim: 'Ketua Tim',
  anggota_tim: 'Anggota Tim',
  admin_opd: 'Admin OPD',
};

export const OPD = {
  PUPR: 'Dinas Pekerjaan Umum dan Penataan Ruang',
  DISDIK: 'Dinas Pendidikan',
};

// Status reviu temuan (alur internal Inspektorat)
export const STATUS_REVIU = {
  draft: { label: 'Draf', cls: 'bg-slate-100 text-slate-700 ring-slate-300' },
  review_kt: { label: 'Reviu Ketua Tim', cls: 'bg-sky-50 text-sky-800 ring-sky-300' },
  review_dalnis: { label: 'Reviu Dalnis', cls: 'bg-indigo-50 text-indigo-800 ring-indigo-300' },
  dikembalikan: { label: 'Dikembalikan', cls: 'bg-orange-50 text-orange-800 ring-orange-300' },
  final: { label: 'Final (Terbit ke OPD)', cls: 'bg-emerald-50 text-emerald-800 ring-emerald-300' },
};

// Status tindak lanjut per rekomendasi (kategori standar + status proses "menunggu verifikasi")
export const STATUS_TL = {
  BELUM: { label: 'Belum Ditindaklanjuti', short: 'Belum TL', cls: 'bg-rose-50 text-rose-800 ring-rose-300', bar: 'bg-rose-500' },
  MENUNGGU: { label: 'Menunggu Verifikasi', short: 'Menunggu', cls: 'bg-amber-50 text-amber-800 ring-amber-300', bar: 'bg-amber-400' },
  BELUM_SESUAI: { label: 'Belum Sesuai', short: 'Belum Sesuai', cls: 'bg-orange-50 text-orange-800 ring-orange-300', bar: 'bg-orange-500' },
  SESUAI: { label: 'Sesuai', short: 'Sesuai', cls: 'bg-emerald-50 text-emerald-800 ring-emerald-300', bar: 'bg-emerald-500' },
  TDD: { label: 'Tidak Dapat Ditindaklanjuti', short: 'TDD', cls: 'bg-slate-100 text-slate-700 ring-slate-300', bar: 'bg-slate-400' },
};

export const URUTAN_TL = ['SESUAI', 'MENUNGGU', 'BELUM_SESUAI', 'BELUM', 'TDD'];

export const INTERNAL = ['inspektur', 'admin_inspektorat', 'dalnis', 'ketua_tim', 'anggota_tim'];

// Hak akses per peran
export const can = {
  lihatSemua: (u) => INTERNAL.includes(u?.peran),
  inputTemuan: (u) => u?.peran === 'anggota_tim',
  reviuKetua: (u) => u?.peran === 'ketua_tim',
  reviuDalnis: (u) => u?.peran === 'dalnis',
  unggahBukti: (u) => u?.peran === 'admin_opd',
  verifikasi: (u) => ['ketua_tim', 'dalnis', 'admin_inspektorat'].includes(u?.peran),
  lihatLog: (u) => ['inspektur', 'admin_inspektorat'].includes(u?.peran),
  resetData: (u) => u?.peran === 'admin_inspektorat',
};

export const DESKRIPSI_PERAN = {
  inspektur: 'Melihat seluruh temuan & dashboard semua OPD, serta audit trail.',
  admin_inspektorat: 'Melihat semua data, memverifikasi bukti tindak lanjut, melihat audit trail, reset data demo.',
  dalnis: 'Mereviu temuan setelah disetujui Ketua Tim: setujui (terbit ke OPD) atau kembalikan ke Anggota Tim. Dapat memverifikasi bukti TL.',
  ketua_tim: 'Mereviu temuan dari Anggota Tim: setujui (teruskan ke Dalnis) atau kembalikan. Dapat memverifikasi bukti TL.',
  anggota_tim: 'Menginput temuan & rekomendasi, memperbaiki temuan yang dikembalikan, mengajukan ke Ketua Tim.',
  admin_opd: 'Hanya melihat temuan final milik OPD-nya dan mengunggah bukti tindak lanjut.',
};
