import { URUTAN_TL } from './constants';
import { lewatBatas } from './utils';

// Ringkasan status TL untuk sekumpulan temuan final
export function ringkas(temuanList) {
  const final = temuanList.filter((t) => t.statusReviu === 'final');
  const hitung = Object.fromEntries(URUTAN_TL.map((k) => [k, 0]));
  let nilaiRek = 0, nilaiSesuai = 0, lewat = 0, totalRek = 0, nilaiTemuan = 0;
  final.forEach((t) => {
    nilaiTemuan += t.nilaiTemuan || 0;
    t.rekomendasi.forEach((r) => {
      totalRek++;
      hitung[r.statusTL]++;
      nilaiRek += r.nilai || 0;
      if (r.statusTL === 'SESUAI') nilaiSesuai += r.nilai || 0;
      if (lewatBatas(t, r)) lewat++;
    });
  });
  const selesai = hitung.SESUAI + hitung.TDD;
  return {
    jumlahTemuan: final.length, totalRek, hitung, nilaiRek, nilaiSesuai, nilaiTemuan, lewat,
    persenSelesai: totalRek ? Math.round((selesai / totalRek) * 100) : 0,
    persenNilai: nilaiRek ? Math.round((nilaiSesuai / nilaiRek) * 100) : 0,
  };
}

// Daftar pekerjaan yang menunggu aksi pengguna saat ini
export function tugasSaya(temuanList, user) {
  const out = [];
  temuanList.forEach((t) => {
    if (user.peran === 'anggota_tim' && t.dibuatOleh === user.id && ['draft', 'dikembalikan'].includes(t.statusReviu))
      out.push({ t, teks: t.statusReviu === 'draft' ? 'Draf belum diajukan' : 'Dikembalikan — perlu perbaikan', href: `/temuan/${t.id}` });
    if (user.peran === 'ketua_tim' && t.statusReviu === 'review_kt') out.push({ t, teks: 'Menunggu reviu Ketua Tim', href: `/temuan/${t.id}` });
    if (user.peran === 'dalnis' && t.statusReviu === 'review_dalnis') out.push({ t, teks: 'Menunggu reviu Dalnis', href: `/temuan/${t.id}` });
    if (t.statusReviu === 'final') {
      t.rekomendasi.forEach((r) => {
        if (user.peran === 'admin_opd' && ['BELUM', 'BELUM_SESUAI'].includes(r.statusTL))
          out.push({ t, r, teks: r.statusTL === 'BELUM' ? 'Unggah bukti tindak lanjut' : 'Bukti belum sesuai — unggah ulang', href: `/temuan/${t.id}#${r.id}` });
        if (['ketua_tim', 'dalnis', 'admin_inspektorat'].includes(user.peran) && r.statusTL === 'MENUNGGU')
          out.push({ t, r, teks: 'Bukti TL menunggu verifikasi', href: `/temuan/${t.id}#${r.id}` });
      });
    }
  });
  return out;
}
