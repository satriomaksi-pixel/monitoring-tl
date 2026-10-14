// DATA SIMULASI — seluruh nama orang, penyedia, sekolah, dan nomor dokumen adalah fiktif/dianonimkan
// sesuai ketentuan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.

export const USERS = [
  { id: 'U-INS', nama: 'Ir. H. Sutrisno', peran: 'inspektur' },
  { id: 'U-ADM', nama: 'Rina Marlina, S.Kom.', peran: 'admin_inspektorat' },
  { id: 'U-DAL', nama: 'Bambang Wicaksono, S.E., M.Si.', peran: 'dalnis' },
  { id: 'U-KT', nama: 'Sari Puspita, S.E., CGCAE', peran: 'ketua_tim' },
  { id: 'U-AT1', nama: 'Dimas Aditya, S.Ak.', peran: 'anggota_tim' },
  { id: 'U-AT2', nama: 'Lestari Ningsih, S.E.', peran: 'anggota_tim' },
  { id: 'U-OPD1', nama: 'Admin Dinas PUPR', peran: 'admin_opd', opdId: 'PUPR' },
  { id: 'U-OPD2', nama: 'Admin Dinas Pendidikan', peran: 'admin_opd', opdId: 'DISDIK' },
];

const jejak = (oleh, aksi, catatan, waktu) => ({ oleh, aksi, catatan, waktu });
const verif = (oleh, hasil, catatan, waktu) => ({ oleh, hasil, catatan, waktu });
const bukti = (id, namaFile, ukuran, keterangan, oleh, waktu) => ({ id, namaFile, ukuran, keterangan, oleh, waktu });

const alurFinal = (pembuat, t1, t2, t3) => [
  jejak(pembuat, 'Diajukan ke Ketua Tim', '', t1),
  jejak('U-KT', 'Disetujui Ketua Tim', 'Sudah sesuai unsur 4C.', t2),
  jejak('U-DAL', 'Disetujui Dalnis — terbit ke OPD', '', t3),
];

export function buildSeed() {
  const temuan = [
    {
      id: 'TM-001', nomorLhp: '700/011/LHP-ITKAB/III/2026', tanggalLhp: '2026-03-16',
      namaPemeriksaan: 'Pemeriksaan Reguler Dinas PUPR TA 2025', opdId: 'PUPR',
      judul: 'Kekurangan volume pekerjaan peningkatan jalan Ruas S-07',
      kondisi: 'Hasil pengukuran fisik bersama PPK dan penyedia (CV. MT) atas pekerjaan peningkatan jalan Ruas S-07 menunjukkan kekurangan volume lapis AC-WC dan bahu jalan dibandingkan volume yang dibayar 100%.',
      kriteria: 'Perpres 16 Tahun 2018 dan perubahannya tentang Pengadaan Barang/Jasa Pemerintah; dokumen kontrak (spesifikasi teknis & syarat pembayaran).',
      sebab: 'PPK dan konsultan pengawas tidak cermat melakukan pengendalian dan pemeriksaan hasil pekerjaan sebelum pembayaran.',
      akibat: 'Kelebihan pembayaran kepada penyedia yang berpotensi merugikan keuangan daerah.',
      nilaiTemuan: 187450000, batasWaktu: '2026-05-15', statusReviu: 'final', dibuatOleh: 'U-AT1',
      riwayat: alurFinal('U-AT1', '2026-03-02T09:10:00', '2026-03-05T14:00:00', '2026-03-10T10:30:00'),
      rekomendasi: [
        {
          id: 'R-001a', uraian: 'Memerintahkan PPK untuk menarik kelebihan pembayaran dari CV. MT dan menyetorkannya ke Kas Daerah.', nilai: 187450000,
          statusTL: 'MENUNGGU',
          bukti: [bukti('B-1', 'STS_setoran_CV-MT_tahap1.pdf', 248000, 'Setoran tahap 1 sebesar Rp 187.450.000 (lunas).', 'U-OPD1', '2026-10-08T11:20:00')],
          verifikasi: [],
        },
        {
          id: 'R-001b', uraian: 'Memberikan teguran tertulis kepada PPK dan PPTK agar lebih cermat dalam pengendalian kontrak.', nilai: 0,
          statusTL: 'SESUAI',
          bukti: [bukti('B-2', 'Surat_teguran_PPK_PPTK.pdf', 132000, 'Surat teguran Kepala Dinas.', 'U-OPD1', '2026-04-20T09:00:00')],
          verifikasi: [verif('U-KT', 'SESUAI', 'Surat teguran telah ditandatangani Kepala Dinas.', '2026-04-24T13:15:00')],
        },
      ],
      createdAt: '2026-03-01T08:00:00',
    },
    {
      id: 'TM-002', nomorLhp: '700/011/LHP-ITKAB/III/2026', tanggalLhp: '2026-03-16',
      namaPemeriksaan: 'Pemeriksaan Reguler Dinas PUPR TA 2025', opdId: 'PUPR',
      judul: 'Denda keterlambatan pekerjaan gedung belum dikenakan',
      kondisi: 'Pekerjaan pembangunan gedung oleh PT. KJ selesai 34 hari kalender melewati masa kontrak, namun denda keterlambatan belum dikenakan saat pembayaran termin akhir.',
      kriteria: 'Perpres 16 Tahun 2018 dan perubahannya; Syarat-Syarat Umum Kontrak tentang denda keterlambatan sebesar 1‰ per hari dari nilai kontrak.',
      sebab: 'PPK belum memperhitungkan denda keterlambatan dalam berita acara pembayaran.',
      akibat: 'Kekurangan penerimaan daerah dari denda keterlambatan.',
      nilaiTemuan: 64200000, batasWaktu: '2026-05-15', statusReviu: 'final', dibuatOleh: 'U-AT1',
      riwayat: alurFinal('U-AT1', '2026-03-02T09:20:00', '2026-03-05T14:10:00', '2026-03-10T10:35:00'),
      rekomendasi: [
        {
          id: 'R-002a', uraian: 'Memerintahkan PPK menagih denda keterlambatan kepada PT. KJ dan menyetorkannya ke Kas Daerah.', nilai: 54200000,
          statusTL: 'BELUM_SESUAI',
          bukti: [bukti('B-3', 'Surat_penagihan_denda_PT-KJ.pdf', 98000, 'Surat penagihan sudah dikirim ke penyedia.', 'U-OPD1', '2026-06-02T10:00:00')],
          verifikasi: [verif('U-DAL', 'BELUM_SESUAI', 'Baru surat penagihan; mohon lampirkan bukti setor (STS) ke Kas Daerah.', '2026-06-05T09:40:00')],
        },
        {
          id: 'R-002b', uraian: 'Menagih sisa denda atas paket pekerjaan pagar kepada CV. RB.', nilai: 10000000,
          statusTL: 'TDD',
          bukti: [bukti('B-4', 'Salinan_putusan_pailit_CV-RB.pdf', 410000, 'Penyedia telah dinyatakan pailit.', 'U-OPD1', '2026-05-10T08:30:00')],
          verifikasi: [verif('U-ADM', 'TDD', 'Penyedia pailit berdasarkan putusan pengadilan; tidak dapat ditindaklanjuti.', '2026-05-14T15:00:00')],
        },
      ],
      createdAt: '2026-03-01T08:10:00',
    },
    {
      id: 'TM-003', nomorLhp: '700/024/LHP-ITKAB/VI/2026', tanggalLhp: '2026-06-22',
      namaPemeriksaan: 'Reviu Pengelolaan Barang Milik Daerah Dinas PUPR', opdId: 'PUPR',
      judul: 'Aset hasil pekerjaan fisik belum dicatat dalam KIB',
      kondisi: 'Tiga paket pekerjaan fisik yang telah diserahterimakan (BAST) belum dicatat sebagai aset tetap dalam Kartu Inventaris Barang (KIB) C dan D.',
      kriteria: 'Permendagri 19 Tahun 2016 tentang Pedoman Pengelolaan Barang Milik Daerah; Kebijakan Akuntansi Pemerintah Daerah.',
      sebab: 'Pengurus barang belum menerima salinan BAST dari bidang teknis.',
      akibat: 'Nilai aset tetap pada neraca berpotensi disajikan lebih rendah.',
      nilaiTemuan: 0, batasWaktu: '2026-08-21', statusReviu: 'final', dibuatOleh: 'U-AT2',
      riwayat: alurFinal('U-AT2', '2026-06-10T09:00:00', '2026-06-12T11:00:00', '2026-06-18T16:00:00'),
      rekomendasi: [
        { id: 'R-003a', uraian: 'Memerintahkan pengurus barang mencatat aset hasil pekerjaan ke dalam KIB dan SIMDA BMD.', nilai: 0, statusTL: 'BELUM', bukti: [], verifikasi: [] },
        { id: 'R-003b', uraian: 'Menetapkan SOP penyampaian BAST dari bidang teknis kepada pengurus barang paling lambat 7 hari kerja.', nilai: 0, statusTL: 'BELUM', bukti: [], verifikasi: [] },
      ],
      createdAt: '2026-06-09T08:00:00',
    },
    {
      id: 'TM-004', nomorLhp: '700/019/LHP-ITKAB/V/2026', tanggalLhp: '2026-05-11',
      namaPemeriksaan: 'Pemeriksaan Dana BOSP pada Satuan Pendidikan', opdId: 'DISDIK',
      judul: 'Penggunaan Dana BOSP tidak sesuai petunjuk teknis pada SDN 0XX',
      kondisi: 'Terdapat belanja dari Dana BOSP pada SDN 0XX untuk kegiatan di luar komponen yang diperbolehkan dalam juknis.',
      kriteria: 'Petunjuk Teknis Pengelolaan Dana Bantuan Operasional Satuan Pendidikan (Permendikbudristek yang berlaku).',
      sebab: 'Kepala sekolah dan bendahara BOSP kurang memahami komponen penggunaan dana dalam juknis.',
      akibat: 'Dana BOSP tidak dimanfaatkan sesuai peruntukan.',
      nilaiTemuan: 42750000, batasWaktu: '2026-07-10', statusReviu: 'final', dibuatOleh: 'U-AT2',
      riwayat: alurFinal('U-AT2', '2026-04-27T10:00:00', '2026-04-29T13:00:00', '2026-05-05T09:00:00'),
      rekomendasi: [
        {
          id: 'R-004a', uraian: 'Memerintahkan Kepala SDN 0XX mengembalikan dana ke rekening BOSP sekolah.', nilai: 42750000,
          statusTL: 'SESUAI',
          bukti: [bukti('B-5', 'Bukti_transfer_rekening_BOSP.pdf', 156000, 'Pengembalian penuh ke rekening BOSP.', 'U-OPD2', '2026-06-15T10:00:00')],
          verifikasi: [verif('U-KT', 'SESUAI', 'Nilai pengembalian sesuai rekomendasi.', '2026-06-18T14:00:00')],
        },
        { id: 'R-004b', uraian: 'Melakukan pembinaan/bimtek pengelolaan Dana BOSP kepada kepala sekolah dan bendahara.', nilai: 0, statusTL: 'BELUM', bukti: [], verifikasi: [] },
      ],
      createdAt: '2026-04-26T08:00:00',
    },
    {
      id: 'TM-005', nomorLhp: '700/031/LHP-ITKAB/VIII/2026', tanggalLhp: '2026-08-24',
      namaPemeriksaan: 'Pemeriksaan Reguler Dinas Pendidikan TA 2025', opdId: 'DISDIK',
      judul: 'Belanja perjalanan dinas tidak didukung bukti pertanggungjawaban lengkap',
      kondisi: 'Terdapat SPJ perjalanan dinas yang tidak dilengkapi bukti tiket/boarding pass dan bukti penginapan.',
      kriteria: 'Permendagri 77 Tahun 2020 tentang Pedoman Teknis Pengelolaan Keuangan Daerah; Peraturan Bupati tentang perjalanan dinas.',
      sebab: 'PPK-SKPD tidak melakukan verifikasi kelengkapan SPJ secara memadai.',
      akibat: 'Belanja perjalanan dinas tidak dapat diyakini kewajarannya.',
      nilaiTemuan: 18300000, batasWaktu: '2026-10-23', statusReviu: 'final', dibuatOleh: 'U-AT1',
      riwayat: alurFinal('U-AT1', '2026-08-12T09:00:00', '2026-08-14T10:00:00', '2026-08-19T15:30:00'),
      rekomendasi: [
        { id: 'R-005a', uraian: 'Memerintahkan pelaksana perjalanan dinas melengkapi bukti atau menyetorkan nilai yang tidak dapat dipertanggungjawabkan ke Kas Daerah.', nilai: 18300000, statusTL: 'BELUM', bukti: [], verifikasi: [] },
      ],
      createdAt: '2026-08-11T08:00:00',
    },
    {
      id: 'TM-006', nomorLhp: '700/031/LHP-ITKAB/VIII/2026', tanggalLhp: '2026-08-24',
      namaPemeriksaan: 'Pemeriksaan Reguler Dinas Pendidikan TA 2025', opdId: 'DISDIK',
      judul: 'Pengadaan buku perpustakaan sekolah tidak melalui katalog elektronik',
      kondisi: 'Pengadaan buku perpustakaan untuk beberapa sekolah dilakukan melalui pengadaan langsung, padahal barang tersedia di katalog elektronik.',
      kriteria: 'Perpres 16 Tahun 2018 dan perubahannya.',
      sebab: 'Pejabat pengadaan belum memahami kewajiban penggunaan katalog elektronik.',
      akibat: 'Proses pengadaan kurang transparan dan berpotensi harga tidak kompetitif.',
      nilaiTemuan: 0, batasWaktu: '', statusReviu: 'dikembalikan', dibuatOleh: 'U-AT2',
      riwayat: [
        jejak('U-AT2', 'Diajukan ke Ketua Tim', '', '2026-10-06T09:00:00'),
        jejak('U-KT', 'Dikembalikan ke Anggota Tim', 'Unsur akibat perlu dikuantifikasi (perbandingan harga katalog vs realisasi). Lengkapi juga nilai temuan bila ada selisih harga.', '2026-10-07T13:30:00'),
      ],
      rekomendasi: [
        { id: 'R-006a', uraian: 'Memerintahkan pejabat pengadaan mengutamakan katalog elektronik untuk barang yang telah tersedia.', nilai: 0, statusTL: 'BELUM', bukti: [], verifikasi: [] },
      ],
      createdAt: '2026-10-05T08:00:00',
    },
    {
      id: 'TM-007', nomorLhp: '700/033/LHP-ITKAB/X/2026', tanggalLhp: '',
      namaPemeriksaan: 'Pemeriksaan Khusus Pembayaran Honorarium Dinas PUPR', opdId: 'PUPR',
      judul: 'Honorarium tim teknis melebihi standar biaya',
      kondisi: 'Pembayaran honorarium tim teknis untuk beberapa kegiatan melebihi tarif dalam Peraturan Bupati tentang Standar Harga Satuan.',
      kriteria: 'Peraturan Bupati tentang Standar Harga Satuan Pemerintah Daerah TA 2025.',
      sebab: 'Bendahara pengeluaran tidak menguji kesesuaian tarif saat pembayaran.',
      akibat: 'Kelebihan pembayaran honorarium.',
      nilaiTemuan: 23600000, batasWaktu: '', statusReviu: 'review_kt', dibuatOleh: 'U-AT1',
      riwayat: [jejak('U-AT1', 'Diajukan ke Ketua Tim', '', '2026-10-13T15:00:00')],
      rekomendasi: [
        { id: 'R-007a', uraian: 'Memerintahkan penerima honorarium menyetorkan kelebihan pembayaran ke Kas Daerah.', nilai: 23600000, statusTL: 'BELUM', bukti: [], verifikasi: [] },
      ],
      createdAt: '2026-10-13T08:00:00',
    },
    {
      id: 'TM-008', nomorLhp: '700/033/LHP-ITKAB/X/2026', tanggalLhp: '',
      namaPemeriksaan: 'Pemeriksaan Khusus Pembayaran Honorarium Dinas PUPR', opdId: 'PUPR',
      judul: 'Jaminan pelaksanaan belum dicairkan atas kontrak yang diputus',
      kondisi: 'Kontrak pekerjaan drainase diputus karena wanprestasi, tetapi jaminan pelaksanaan belum dicairkan.',
      kriteria: 'Perpres 16 Tahun 2018 dan perubahannya tentang pemutusan kontrak dan pencairan jaminan.',
      sebab: 'PPK belum mengajukan klaim pencairan jaminan kepada penerbit jaminan.',
      akibat: 'Hak daerah atas jaminan pelaksanaan berpotensi hilang.',
      nilaiTemuan: 31500000, batasWaktu: '', statusReviu: 'review_dalnis', dibuatOleh: 'U-AT2',
      riwayat: [
        jejak('U-AT2', 'Diajukan ke Ketua Tim', '', '2026-10-09T10:00:00'),
        jejak('U-KT', 'Disetujui Ketua Tim', '', '2026-10-12T09:30:00'),
      ],
      rekomendasi: [
        { id: 'R-008a', uraian: 'Memerintahkan PPK segera mengajukan klaim pencairan jaminan pelaksanaan dan menyetorkannya ke Kas Daerah.', nilai: 31500000, statusTL: 'BELUM', bukti: [], verifikasi: [] },
      ],
      createdAt: '2026-10-08T08:00:00',
    },
    {
      id: 'TM-009', nomorLhp: '', tanggalLhp: '',
      namaPemeriksaan: 'Pemeriksaan Reguler Dinas Pendidikan TA 2025', opdId: 'DISDIK',
      judul: 'Kelebihan pembayaran tunjangan tambahan penghasilan pegawai',
      kondisi: 'Terdapat pegawai yang tetap menerima TPP penuh meskipun tingkat kehadiran di bawah ketentuan.',
      kriteria: 'Peraturan Bupati tentang Tambahan Penghasilan Pegawai ASN.',
      sebab: '', akibat: '',
      nilaiTemuan: 0, batasWaktu: '', statusReviu: 'draft', dibuatOleh: 'U-AT1',
      riwayat: [],
      rekomendasi: [{ id: 'R-009a', uraian: '', nilai: 0, statusTL: 'BELUM', bukti: [], verifikasi: [] }],
      createdAt: '2026-10-14T08:00:00',
    },
  ];

  const log = [
    ['2026-10-14T08:00:00', 'U-AT1', 'Membuat draf temuan', 'TM-009'],
    ['2026-10-13T15:00:00', 'U-AT1', 'Mengajukan temuan ke Ketua Tim', 'TM-007'],
    ['2026-10-12T09:30:00', 'U-KT', 'Menyetujui temuan (teruskan ke Dalnis)', 'TM-008'],
    ['2026-10-08T11:20:00', 'U-OPD1', 'Mengunggah bukti tindak lanjut', 'TM-001 / R-001a'],
    ['2026-10-07T13:30:00', 'U-KT', 'Mengembalikan temuan ke Anggota Tim', 'TM-006'],
    ['2026-06-18T14:00:00', 'U-KT', 'Verifikasi TL: Sesuai', 'TM-004 / R-004a'],
    ['2026-06-05T09:40:00', 'U-DAL', 'Verifikasi TL: Belum Sesuai', 'TM-002 / R-002a'],
  ].map(([waktu, userId, aksi, objek], i) => ({ id: 'LOG-S' + i, waktu, userId, aksi, objek }));

  return { versi: 1, sessionUserId: null, temuan, log };
}
