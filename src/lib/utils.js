export const rupiah = (n) =>
  'Rp ' + Number(n || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 });

export const tanggal = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const waktu = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const tambahHari = (isoDate, hari) => {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + hari);
  return d.toISOString().slice(0, 10);
};

export const hariIni = () => new Date().toISOString().slice(0, 10);

export const uid = (p = 'ID') => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

// Rekomendasi dianggap melewati batas waktu bila temuan sudah final, belum selesai, dan tanggal > batas waktu
export const lewatBatas = (temuan, rek) =>
  temuan.statusReviu === 'final' &&
  !['SESUAI', 'TDD'].includes(rek.statusTL) &&
  temuan.batasWaktu && hariIni() > temuan.batasWaktu;

export const sisaHari = (batas) => {
  if (!batas) return null;
  const ms = new Date(batas + 'T00:00:00') - new Date(hariIni() + 'T00:00:00');
  return Math.round(ms / 86400000);
};
