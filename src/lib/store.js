'use client';
// Penyimpanan data prototipe di localStorage browser + seluruh aksi bisnis (alur reviu, bukti, verifikasi)
// Setiap aksi dicatat ke audit trail (log).
import { useSyncExternalStore } from 'react';
import { buildSeed, USERS } from './seed';
import { hariIni, tambahHari, uid } from './utils';
import { STATUS_TL } from './constants';

const KEY = 'monitoring-tl-data-v1';
let state = null;
const listeners = new Set();

function load() {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : buildSeed();
  } catch {
    state = buildSeed();
  }
  return state;
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l) {
  listeners.add(l);
  const onStorage = (e) => {
    if (e.key === KEY) {
      state = null;
      l();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener('storage', onStorage);
  };
}

// Mengubah state secara aman; bila localStorage penuh, perubahan dibatalkan
function mutate(fn) {
  const prev = load();
  const draft = structuredClone(prev);
  const result = fn(draft);
  state = draft;
  if (!persist()) {
    state = prev;
    throw new Error('Penyimpanan browser penuh. Gunakan file bukti yang lebih kecil atau reset data demo.');
  }
  emit();
  return result;
}

export function useData() {
  return useSyncExternalStore(subscribe, load, () => null);
}

export const getUser = (id) => USERS.find((u) => u.id === id);
export const namaUser = (id) => getUser(id)?.nama || id;

export function useSession() {
  const data = useData();
  if (!data) return { data: null, user: null, ready: false };
  return { data, user: getUser(data.sessionUserId) || null, ready: true };
}

function tulisLog(d, user, aksi, objek, detail = '') {
  d.log.unshift({ id: uid('LOG'), waktu: new Date().toISOString(), userId: user.id, aksi, objek, detail });
}

// ---------- Sesi ----------
export function login(userId) {
  mutate((d) => {
    d.sessionUserId = userId;
    tulisLog(d, getUser(userId), 'Masuk ke sistem', '-');
  });
}

export function logout() {
  mutate((d) => {
    const u = getUser(d.sessionUserId);
    if (u) tulisLog(d, u, 'Keluar dari sistem', '-');
    d.sessionUserId = null;
  });
}

export function resetData(user) {
  mutate((d) => {
    const fresh = buildSeed();
    d.temuan = fresh.temuan;
    d.log = fresh.log;
    tulisLog(d, user, 'Reset data demo ke kondisi awal', '-');
  });
}

// ---------- Visibilitas ----------
export function temuanTerlihat(data, user) {
  if (!data || !user) return [];
  if (user.peran === 'admin_opd') {
    return data.temuan.filter((t) => t.opdId === user.opdId && t.statusReviu === 'final');
  }
  return data.temuan;
}

// ---------- Anggota Tim: simpan & ajukan ----------
export function simpanTemuan(user, payload, ajukan) {
  return mutate((d) => {
    let t = payload.id ? d.temuan.find((x) => x.id === payload.id) : null;
    const bersih = {
      nomorLhp: payload.nomorLhp.trim(),
      tanggalLhp: payload.tanggalLhp,
      namaPemeriksaan: payload.namaPemeriksaan.trim(),
      opdId: payload.opdId,
      judul: payload.judul.trim(),
      kondisi: payload.kondisi.trim(),
      kriteria: payload.kriteria.trim(),
      sebab: payload.sebab.trim(),
      akibat: payload.akibat.trim(),
      nilaiTemuan: Number(payload.nilaiTemuan) || 0,
      batasWaktu: payload.batasWaktu,
      rekomendasi: payload.rekomendasi.map((r) => ({
        id: r.id || uid('R'),
        uraian: r.uraian.trim(),
        nilai: Number(r.nilai) || 0,
        statusTL: r.statusTL || 'BELUM',
        bukti: r.bukti || [],
        verifikasi: r.verifikasi || [],
      })),
    };
    if (!t) {
      t = { id: uid('TM'), statusReviu: 'draft', dibuatOleh: user.id, riwayat: [], createdAt: new Date().toISOString(), ...bersih };
      d.temuan.unshift(t);
      tulisLog(d, user, 'Membuat draf temuan', t.id, bersih.judul);
    } else {
      if (!['draft', 'dikembalikan'].includes(t.statusReviu)) throw new Error('Temuan sedang direviu / sudah final, tidak dapat diubah.');
      Object.assign(t, bersih);
      tulisLog(d, user, 'Mengubah temuan', t.id, bersih.judul);
    }
    if (ajukan) {
      t.statusReviu = 'review_kt';
      t.riwayat.push({ oleh: user.id, aksi: 'Diajukan ke Ketua Tim', catatan: '', waktu: new Date().toISOString() });
      tulisLog(d, user, 'Mengajukan temuan ke Ketua Tim', t.id);
    }
    return t.id;
  });
}

// ---------- Ketua Tim / Dalnis: reviu berjenjang ----------
export function reviuTemuan(user, id, setuju, catatan) {
  mutate((d) => {
    const t = d.temuan.find((x) => x.id === id);
    const tahap = user.peran === 'ketua_tim' ? 'review_kt' : user.peran === 'dalnis' ? 'review_dalnis' : null;
    if (!t || t.statusReviu !== tahap) throw new Error('Temuan tidak berada pada tahap reviu Anda.');
    const now = new Date().toISOString();
    if (!setuju) {
      if (!catatan?.trim()) throw new Error('Catatan wajib diisi saat mengembalikan temuan.');
      t.statusReviu = 'dikembalikan';
      t.riwayat.push({ oleh: user.id, aksi: 'Dikembalikan ke Anggota Tim', catatan, waktu: now });
      tulisLog(d, user, 'Mengembalikan temuan ke Anggota Tim', t.id, catatan);
      return;
    }
    if (tahap === 'review_kt') {
      t.statusReviu = 'review_dalnis';
      t.riwayat.push({ oleh: user.id, aksi: 'Disetujui Ketua Tim', catatan: catatan || '', waktu: now });
      tulisLog(d, user, 'Menyetujui temuan (teruskan ke Dalnis)', t.id);
    } else {
      t.statusReviu = 'final';
      if (!t.tanggalLhp) t.tanggalLhp = hariIni();
      if (!t.batasWaktu) t.batasWaktu = tambahHari(t.tanggalLhp, 60);
      t.riwayat.push({ oleh: user.id, aksi: 'Disetujui Dalnis — terbit ke OPD', catatan: catatan || '', waktu: now });
      tulisLog(d, user, 'Menyetujui temuan (final, terbit ke OPD)', t.id);
    }
  });
}

// ---------- Admin OPD: unggah bukti ----------
export function unggahBukti(user, temuanId, rekId, { namaFile, ukuran, dataUrl, keterangan }) {
  mutate((d) => {
    const t = d.temuan.find((x) => x.id === temuanId);
    if (!t || t.opdId !== user.opdId || t.statusReviu !== 'final') throw new Error('Akses ditolak.');
    const r = t.rekomendasi.find((x) => x.id === rekId);
    if (!['BELUM', 'BELUM_SESUAI'].includes(r.statusTL)) throw new Error('Rekomendasi ini tidak sedang menunggu tindak lanjut.');
    r.bukti.push({ id: uid('B'), namaFile, ukuran, dataUrl: dataUrl || null, keterangan, oleh: user.id, waktu: new Date().toISOString() });
    r.statusTL = 'MENUNGGU';
    tulisLog(d, user, 'Mengunggah bukti tindak lanjut', `${t.id} / ${r.id}`, namaFile);
  });
}

// ---------- Inspektorat: verifikasi bukti ----------
export function verifikasiTL(user, temuanId, rekId, hasil, catatan) {
  mutate((d) => {
    const t = d.temuan.find((x) => x.id === temuanId);
    const r = t?.rekomendasi.find((x) => x.id === rekId);
    if (!r || r.statusTL !== 'MENUNGGU') throw new Error('Tidak ada bukti yang menunggu verifikasi.');
    if (hasil !== 'SESUAI' && !catatan?.trim()) throw new Error('Catatan wajib diisi untuk hasil selain "Sesuai".');
    r.statusTL = hasil;
    r.verifikasi.push({ oleh: user.id, hasil, catatan: catatan || '', waktu: new Date().toISOString() });
    tulisLog(d, user, `Verifikasi TL: ${STATUS_TL[hasil].label}`, `${t.id} / ${r.id}`, catatan);
  });
}
