// File: src/utils/dataSurat.js

// =====================================================================
// 1. KUMPULAN GRUP FORM SPESIFIK (SUPER LENGKAP)
// =====================================================================

export const fieldPekerjaanPribadi = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Sekayu, 16 Juni 2026' },
    { name: 'tujuan', label: 'Tujuan Surat (Yth)', placeholder: 'HRD PT PLN (Persero)' },
    { name: 'nama', label: 'Nama Lengkap', placeholder: 'Roby Akshay' },
    { name: 'ttl', label: 'Tempat, Tanggal Lahir', placeholder: 'Palembang, 10 Agustus 2000' },
    { name: 'pendidikan', label: 'Pendidikan Terakhir', placeholder: 'S1 Sistem Informasi' },
    { name: 'noHp', label: 'No. Handphone/WA', placeholder: '081234567890' },
    { name: 'email', label: 'Alamat Email', placeholder: 'roby@futuralink.com' },
    { name: 'posisi', label: 'Posisi / Jabatan', placeholder: 'Frontliner / Fullstack Developer' },
    { name: 'poin', label: 'Alasan Khusus / Kompetensi', placeholder: 'Menguasai Next.js, Flutter, dan Laravel...' }
];

export const fieldPekerjaanInternal = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Sekayu, 16 Juni 2026' },
    { name: 'tujuan', label: 'Atasan / HRD (Yth)', placeholder: 'Bapak Manajer Operasional' },
    { name: 'nama', label: 'Nama Lengkap', placeholder: 'Roby Akshay' },
    { name: 'nik', label: 'NIK / NIP Karyawan', placeholder: '19902026XXXXXXXX' },
    { name: 'posisi', label: 'Jabatan Saat Ini', placeholder: 'Staff IT Support' },
    { name: 'poin', label: 'Alasan / Tanggal Izin/Cuti', placeholder: 'Sakit demam / Terhitung mulai tanggal 20-22 Juni...' }
];

export const fieldHRD = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Palembang, 16 Juni 2026' },
    { name: 'nama', label: 'Nama Pimpinan / HRD', placeholder: 'Roby Akshay' },
    { name: 'jabatan', label: 'Jabatan Pimpinan', placeholder: 'HR Manager Futura Link' },
    { name: 'tujuan', label: 'Nama Karyawan Tujuan', placeholder: 'Budi Santoso' },
    { name: 'nikKaryawan', label: 'NIK Karyawan Tujuan', placeholder: '2025001' },
    { name: 'posisiKaryawan', label: 'Posisi Karyawan Tujuan', placeholder: 'Staff Administrasi' },
    { name: 'poin', label: 'Keterangan / Alasan / Mutasi', placeholder: 'Dipindahtugaskan ke cabang Musi Banyuasin...' }
];

export const fieldAkademikPribadi = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Lumpatan, 16 Juni 2026' },
    { name: 'tujuan', label: 'Tujuan Surat (Dosen/Kepsek/Dekan)', placeholder: 'Ketua Program Studi Teknik Informatika' },
    { name: 'nama', label: 'Nama Siswa / Mahasiswa', placeholder: 'Roby Akshay' },
    { name: 'nim_nis', label: 'NIM / NIS', placeholder: '09021181XXXXXXXX' },
    { name: 'instansi', label: 'Nama Sekolah / Kampus', placeholder: 'Universitas Sriwijaya' },
    { name: 'poin', label: 'Keperluan / Judul Skripsi / Alasan', placeholder: 'Riset skripsi Kualitas Pelayanan Administrasi Desa...' }
];

export const fieldAkademikInstansi = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Sekayu, 16 Juni 2026' },
    { name: 'nama', label: 'Nama Pimpinan Instansi', placeholder: 'Dr. Budi Darmawan' },
    { name: 'instansi', label: 'Nama Sekolah / Kampus', placeholder: 'Universitas Sriwijaya' },
    { name: 'tujuan', label: 'Nama Siswa / Mahasiswa', placeholder: 'Roby Akshay' },
    { name: 'nim_nis', label: 'NIM / NIS', placeholder: '09021181XXXXXXXX' },
    { name: 'poin', label: 'Keterangan Kelulusan / Panggilan', placeholder: 'Dinyatakan Lulus dengan predikat Cumlaude...' }
];

export const fieldBisnis = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Palembang, 16 Juni 2026' },
    { name: 'tujuan', label: 'Nama Klien / Tujuan', placeholder: 'Direktur PT Karya Sentosa' },
    { name: 'instansiTujuan', label: 'Perusahaan Tujuan', placeholder: 'PT Karya Sentosa' },
    { name: 'nama', label: 'Nama Anda / Pimpinan', placeholder: 'Roby Akshay' },
    { name: 'jabatan', label: 'Jabatan Anda', placeholder: 'CEO Futura Link' },
    { name: 'namaPerusahaan', label: 'Perusahaan Anda', placeholder: 'Futura Link' },
    { name: 'poin', label: 'Deskripsi Penawaran/Invoice/Komplain', placeholder: 'Penawaran pembuatan sistem Point of Sales (isaji)...' }
];

export const fieldDesa = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Lumpatan, 16 Juni 2026' },
    { name: 'nama', label: 'Nama Pemohon / Warga', placeholder: 'Roby Akshay' },
    { name: 'nik', label: 'NIK / No. KTP', placeholder: '16060XXXXXXXXXXX' },
    { name: 'ttl', label: 'Tempat, Tanggal Lahir', placeholder: 'Sekayu, 10 Agustus 2000' },
    { name: 'pekerjaan', label: 'Pekerjaan', placeholder: 'Wiraswasta' },
    { name: 'alamatLengkap', label: 'Alamat Lengkap', placeholder: 'Dusun II, Desa Lumpatan Raya...' },
    { name: 'poin', label: 'Keterangan Khusus / Keperluan', placeholder: 'Persyaratan pengajuan KUR Bank...' }
];

export const fieldPernyataan = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Sekayu, 16 Juni 2026' },
    { name: 'nama', label: 'Nama Lengkap', placeholder: 'Roby Akshay' },
    { name: 'nik', label: 'NIK / No. KTP', placeholder: '16060XXXXXXXXXXX' },
    { name: 'alamatLengkap', label: 'Alamat Lengkap', placeholder: 'Jl. Merdeka, Sekayu...' },
    { name: 'poin', label: 'Isi Pernyataan / Kesanggupan', placeholder: 'Menyatakan sanggup ditempatkan di seluruh wilayah kerja...' }
];

export const fieldPerjanjian = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Palembang, 16 Juni 2026' },
    { name: 'nama1', label: 'Nama Pihak Pertama', placeholder: 'Roby Akshay' },
    { name: 'nik1', label: 'NIK Pihak Pertama', placeholder: '16060XXXXXXXXXXX' },
    { name: 'alamat1', label: 'Alamat Pihak Pertama', placeholder: 'Lumpatan, Musi Banyuasin' },
    { name: 'nama2', label: 'Nama Pihak Kedua', placeholder: 'Ahmad Budi' },
    { name: 'nik2', label: 'NIK Pihak Kedua', placeholder: '16060YYYYYYYYYYY' },
    { name: 'alamat2', label: 'Alamat Pihak Kedua', placeholder: 'Ilir Barat, Palembang' },
    { name: 'poin', label: 'Isi Perjanjian (Objek & Ketentuan)', placeholder: 'Jual beli sistem Tracking Live Camera AI seharga...' }
];

export const fieldKuasa = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Palembang, 16 Juni 2026' },
    { name: 'nama', label: 'Nama Pemberi Kuasa', placeholder: 'Roby Akshay' },
    { name: 'nik', label: 'NIK Pemberi Kuasa', placeholder: '16060XXXXXXXXXXX' },
    { name: 'alamatLengkap', label: 'Alamat Pemberi Kuasa', placeholder: 'Musi Banyuasin' },
    { name: 'penerimaKuasa', label: 'Nama Penerima Kuasa', placeholder: 'Andi Pratama' },
    { name: 'nikPenerima', label: 'NIK Penerima Kuasa', placeholder: '16060ZZZZZZZZZZZ' },
    { name: 'poin', label: 'Wewenang yang Dikuasakan', placeholder: 'Mengambil BPKB kendaraan dengan Nopol...' }
];

export const fieldOrganisasi = [
    { name: 'tempatTanggal', label: 'Tempat & Tanggal', placeholder: 'Sekayu, 16 Juni 2026' },
    { name: 'tujuan', label: 'Penerima Surat (Yth)', placeholder: 'Bapak/Ibu Kepala Desa Lumpatan' },
    { name: 'nama', label: 'Nama Organisasi / Panitia', placeholder: 'Panitia Riset Mahasiswa' },
    { name: 'kegiatan', label: 'Nama Kegiatan / Acara', placeholder: 'Penelitian Kualitas Pelayanan Administrasi' },
    { name: 'tanggalKegiatan', label: 'Hari/Tanggal Kegiatan', placeholder: 'Senin, 20 Juni 2026' },
    { name: 'poin', label: 'Isi Ringkas / Tempat / Nominal', placeholder: 'Bertempat di Balai Desa, pukul 09.00 WIB...' }
];

// =====================================================================
// 2. DATABASE SURAT (62 JENIS TERINTEGRASI PENUH)
// =====================================================================

export const TEMPLATE_SURAT = [
    // --- KATEGORI: PEKERJAAN & HRD ---
    {
        id: 'lamaran',
        nama: '1. Surat Lamaran Kerja',
        fields: fieldPekerjaanPribadi,
        templateStandar: "{tempatTanggal}\n\nHal: Lamaran Pekerjaan\n\nKepada Yth.\n{tujuan}\n\nDengan hormat,\nBerdasarkan informasi lowongan pekerjaan yang saya peroleh, saya yang bertanda tangan di bawah ini:\n\nNama: {nama}\nTempat, Tgl Lahir: {ttl}\nPendidikan: {pendidikan}\nNo. Handphone: {noHp}\nEmail: {email}\n\nBermaksud mengajukan diri untuk mengisi posisi sebagai {posisi}. Sebagai bahan pertimbangan Bapak/Ibu, {poin}.\n\nBesar harapan saya untuk dapat mengikuti tahapan seleksi selanjutnya. Atas waktu dan perhatian Bapak/Ibu, saya ucapkan terima kasih."
    },
    {
        id: 'izin_kerja',
        nama: '2. Surat Izin Tidak Masuk Kerja',
        fields: fieldPekerjaanInternal,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Izin Tidak Masuk Kerja\n\nKepada Yth.\n{tujuan}\n\nDengan hormat,\nSaya yang bertanda tangan di bawah ini:\n\nNama: {nama}\nNIK: {nik}\nJabatan: {posisi}\n\nMemohon izin untuk tidak dapat hadir/masuk bekerja dikarenakan {poin}.\n\nDemikian surat permohonan izin ini saya buat dengan sebenar-benarnya. Atas pengertian Bapak/Ibu, saya ucapkan terima kasih."
    },
    {
        id: 'resign',
        nama: '3. Surat Pengunduran Diri (Resign)',
        fields: fieldPekerjaanInternal,
        templateStandar: "{tempatTanggal}\n\nHal: Pengunduran Diri\n\nKepada Yth.\n{tujuan}\n\nDengan hormat,\nMelalui surat ini, saya yang bertanda tangan di bawah ini:\n\nNama: {nama}\nNIK: {nik}\nJabatan: {posisi}\n\nBermaksud menyampaikan permohonan pengunduran diri dari posisi saya di perusahaan ini, dengan alasan {poin}.\n\nSaya mengucapkan ribuan terima kasih atas kesempatan, bimbingan, dan pengalaman yang telah diberikan kepada saya selama bekerja. Saya memohon maaf yang sebesar-besarnya jika ada kesalahan selama saya menjadi bagian dari perusahaan ini."
    },
    {
        id: 'cuti',
        nama: '4. Surat Permohonan Cuti',
        fields: fieldPekerjaanInternal,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Cuti\n\nKepada Yth.\n{tujuan}\n\nDengan hormat,\nSaya yang bertanda tangan di bawah ini:\n\nNama: {nama}\nNIK: {nik}\nJabatan: {posisi}\n\nBermaksud mengajukan cuti kerja dengan rincian dan alasan sebagai berikut: {poin}.\n\nDemikian permohonan cuti ini saya sampaikan. Atas izin dan persetujuan dari Bapak/Ibu, saya ucapkan terima kasih."
    },
    {
        id: 'sp1',
        nama: '5. Surat Peringatan (SP 1)',
        fields: fieldHRD,
        templateStandar: "{tempatTanggal}\n\nSURAT PERINGATAN (SP 1)\n\nKepada Yth. Sdr/i {tujuan}\nNIK: {nikKaryawan}\nJabatan: {posisiKaryawan}\n\nSurat ini diterbitkan sebagai Peringatan Pertama (SP 1) kepada Saudara atas pelanggaran tata tertib perusahaan berupa: {poin}.\n\nDiharapkan Saudara dapat memperbaiki kinerja dan kedisiplinan, serta tidak mengulangi kesalahan yang sama di kemudian hari. Jika kembali melakukan pelanggaran, perusahaan berhak memberikan sanksi yang lebih berat.\n\nHormat kami,\n\n{nama}\n{jabatan}"
    },
    {
        id: 'mutasi',
        nama: '6. Surat Mutasi Karyawan',
        fields: fieldHRD,
        templateStandar: "{tempatTanggal}\n\nSURAT KEPUTUSAN MUTASI\n\nKepada Yth. Sdr/i {tujuan}\nNIK: {nikKaryawan}\nJabatan: {posisiKaryawan}\n\nBerdasarkan evaluasi kinerja dan kebutuhan operasional, manajemen dengan ini memutuskan untuk memindahtugaskan/mutasi Saudara dengan rincian dan alasan: {poin}.\n\nKeputusan ini berlaku sejak surat ini diterbitkan. Harap segera melakukan serah terima tugas dan beradaptasi di posisi/lokasi yang baru.\n\nHormat kami,\n\n{nama}\n{jabatan}"
    },
    {
        id: 'ket_kerja',
        nama: '7. Surat Keterangan Kerja (Paklaring)',
        fields: fieldHRD,
        templateStandar: "{tempatTanggal}\n\nSURAT KETERANGAN KERJA\n\nYang bertanda tangan di bawah ini:\nNama: {nama}\nJabatan: {jabatan}\n\nMenerangkan dengan sesungguhnya bahwa:\nNama: {tujuan}\nNIK: {nikKaryawan}\nJabatan Terakhir: {posisiKaryawan}\n\nAdalah benar pernah menjadi karyawan di perusahaan kami. Selama masa baktinya, yang bersangkutan {poin}.\n\nSurat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya."
    },
    {
        id: 'dinas',
        nama: '8. Surat Perintah Dinas Luar',
        fields: fieldHRD,
        templateStandar: "{tempatTanggal}\n\nSURAT TUGAS DINAS\n\nYang bertanda tangan di bawah ini, {nama} selaku {jabatan}, memberikan tugas dinas kepada:\n\nNama: {tujuan}\nNIK: {nikKaryawan}\nJabatan: {posisiKaryawan}\n\nUntuk melaksanakan perjalanan dinas/tugas luar dengan rincian: {poin}.\n\nHarap laksanakan tugas ini dengan penuh tanggung jawab dan wajib menyerahkan laporan hasil kegiatan setelah tugas selesai dilaksanakan."
    },
    {
        id: 'phk',
        nama: '9. Surat Pemutusan Hubungan Kerja (PHK)',
        fields: fieldHRD,
        templateStandar: "{tempatTanggal}\n\nSURAT PEMUTUSAN HUBUNGAN KERJA\n\nKepada Yth. Sdr/i {tujuan}\nNIK: {nikKaryawan}\nJabatan: {posisiKaryawan}\n\nBerdasarkan evaluasi menyeluruh dan kebijakan perusahaan, dengan berat hati kami harus menyampaikan keputusan untuk mengakhiri hubungan kerja (PHK) dengan Saudara dikarenakan: {poin}.\n\nHak-hak administratif Saudara akan diselesaikan sesuai dengan ketentuan undang-undang ketenagakerjaan yang berlaku. Kami mengucapkan terima kasih atas dedikasi dan kontribusi Saudara selama ini.\n\nHormat kami,\n\n{nama}\n{jabatan}"
    },
    {
        id: 'rekom_kerja',
        nama: '10. Surat Rekomendasi Kerja',
        fields: fieldHRD,
        templateStandar: "{tempatTanggal}\n\nSURAT REKOMENDASI KERJA\n\nYang bertanda tangan di bawah ini:\nNama: {nama}\nJabatan: {jabatan}\n\nDengan ini memberikan rekomendasi penuh kepada:\nNama: {tujuan}\nPosisi Terakhir: {posisiKaryawan}\n\nSelama bekerja bersama kami, yang bersangkutan menunjukkan kinerja yang luar biasa, disiplin tinggi, dan memiliki keahlian: {poin}.\n\nKami sangat merekomendasikan Saudara {tujuan} untuk bergabung dan berkontribusi di perusahaan yang Bapak/Ibu pimpin."
    },

    // --- KATEGORI: SEKOLAH & AKADEMIK ---
    {
        id: 'izin_sekolah',
        nama: '11. Surat Izin Sakit Sekolah/Kampus',
        fields: fieldAkademikPribadi,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Izin\n\nKepada Yth.\n{tujuan}\ndi {instansi}\n\nDengan hormat,\nDengan ini saya sampaikan bahwa:\nNama: {nama}\nNIM/NIS: {nim_nis}\n\nMemohon izin untuk tidak dapat mengikuti kegiatan belajar mengajar pada hari ini dikarenakan {poin}.\n\nMohon permakluman dari Bapak/Ibu. Atas perhatian dan izinnya, saya ucapkan terima kasih."
    },
    {
        id: 'beasiswa',
        nama: '12. Surat Permohonan Beasiswa',
        fields: fieldAkademikPribadi,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Beasiswa\n\nKepada Yth.\n{tujuan}\n{instansi}\n\nDengan hormat,\nSaya yang bertanda tangan di bawah ini:\nNama: {nama}\nNIM/NIS: {nim_nis}\n\nBermaksud mengajukan permohonan program beasiswa yang sedang diselenggarakan. Sebagai bahan pertimbangan, {poin}.\n\nBesar harapan saya agar permohonan ini dapat disetujui. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih."
    },
    {
        id: 'magang',
        nama: '13. Surat Permohonan Magang',
        fields: fieldAkademikPribadi,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Magang / Kerja Praktik\n\nKepada Yth.\n{tujuan}\n\nDengan hormat,\nSebagai kewajiban kurikulum di {instansi}, saya yang bertanda tangan di bawah ini:\nNama: {nama}\nNIM/NIS: {nim_nis}\n\nBermaksud mengajukan izin untuk melaksanakan Magang/Kerja Praktik di instansi/perusahaan yang Bapak/Ibu pimpin. Adapun tujuan magang ini adalah {poin}.\n\nSaya bersedia mematuhi semua tata tertib yang berlaku. Besar harapan saya permohonan ini dapat diterima."
    },
    {
        id: 'pengantar_skripsi',
        nama: '14. Surat Pengantar Riset/Skripsi',
        fields: fieldAkademikPribadi,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Izin Riset Akademik\n\nKepada Yth.\n{tujuan}\n\nDengan hormat,\nUntuk keperluan penyusunan tugas akhir/skripsi di {instansi}, saya:\nNama: {nama}\nNIM/NIS: {nim_nis}\n\nMemohon izin untuk dapat melakukan riset, wawancara, atau pengambilan data di instansi Bapak/Ibu terkait topik: {poin}.\n\nData yang saya peroleh akan dijaga kerahasiaannya dan murni digunakan untuk kepentingan akademik."
    },
    {
        id: 'cuti_kuliah',
        nama: '15. Surat Cuti Akademik',
        fields: fieldAkademikPribadi,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Cuti Akademik\n\nKepada Yth.\n{tujuan}\n{instansi}\n\nDengan hormat,\nSaya yang bertanda tangan di bawah ini:\nNama: {nama}\nNIM/NIS: {nim_nis}\n\nBermaksud mengajukan permohonan cuti akademik/berhenti studi sementara dikarenakan {poin}.\n\nSaya memahami segala konsekuensi administrasi dari permohonan cuti ini. Demikian surat ini saya buat untuk diproses lebih lanjut."
    },
    {
        id: 'pindah_sekolah',
        nama: '16. Surat Permohonan Pindah Sekolah',
        fields: fieldAkademikPribadi,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Pindah Sekolah/Kampus\n\nKepada Yth.\n{tujuan}\n{instansi}\n\nDengan hormat,\nYang bertanda tangan di bawah ini, selaku pihak dari anak didik/mahasiswa:\nNama: {nama}\nNIM/NIS: {nim_nis}\n\nMengajukan permohonan pindah instansi pendidikan dikarenakan {poin}.\n\nKami memohon agar dokumen pindah, rapor, dan transkrip nilai dapat segera diproses. Terima kasih atas bimbingannya selama ini."
    },
    {
        id: 'panggilan_ortu',
        nama: '17. Surat Panggilan Orang Tua',
        fields: fieldAkademikInstansi,
        templateStandar: "{tempatTanggal}\n\nHal: Panggilan Orang Tua / Wali Siswa\n\nKepada Yth. Orang Tua/Wali dari:\nNama: {tujuan}\nNIM/NIS: {nim_nis}\n\nDengan hormat,\nSehubungan dengan hal akademik dan kedisiplinan siswa/mahasiswa tersebut di {instansi}, kami mengundang kehadiran Bapak/Ibu untuk berdiskusi mengenai: {poin}.\n\nMengingat pentingnya hal ini, kehadiran Bapak/Ibu sangat kami harapkan. Atas perhatiannya, kami ucapkan terima kasih.\n\nHormat kami,\n{nama}"
    },
    {
        id: 'ket_lulus',
        nama: '18. Surat Keterangan Lulus (SKL)',
        fields: fieldAkademikInstansi,
        templateStandar: "{tempatTanggal}\n\nSURAT KETERANGAN LULUS\n\nYang bertanda tangan di bawah ini, {nama} mewakili {instansi}, menerangkan dengan sesungguhnya bahwa:\n\nNama: {tujuan}\nNIM/NIS: {nim_nis}\n\nTelah menyelesaikan seluruh persyaratan akademik dan dinyatakan LULUS dengan keterangan: {poin}.\n\nSurat Keterangan Lulus ini diberikan sebagai pengganti Ijazah yang masih dalam proses penerbitan."
    },
    {
        id: 'bebas_pustaka',
        nama: '19. Surat Keterangan Bebas Pustaka',
        fields: fieldAkademikInstansi,
        templateStandar: "{tempatTanggal}\n\nSURAT KETERANGAN BEBAS PUSTAKA\n\nKepala Perpustakaan {instansi} menerangkan bahwa:\n\nNama: {tujuan}\nNIM/NIS: {nim_nis}\n\nTelah mengembalikan seluruh buku pinjaman dan terbebas dari segala denda administrasi perpustakaan. Keterangan tambahan: {poin}.\n\nSurat ini digunakan sebagai syarat pendaftaran yudisium/wisuda."
    },
    {
        id: 'rekomendasi_dosen',
        nama: '20. Surat Rekomendasi Dosen/Guru',
        fields: fieldAkademikInstansi,
        templateStandar: "{tempatTanggal}\n\nSURAT REKOMENDASI\n\nSaya yang bertanda tangan di bawah ini, {nama}, tenaga pendidik di {instansi}, dengan ini memberikan rekomendasi kepada:\n\nNama: {tujuan}\nNIM/NIS: {nim_nis}\n\nAnak didik kami ini memiliki prestasi akademik yang membanggakan, aktif berorganisasi, dan memiliki kepribadian yang tangguh. {poin}.\n\nSaya sangat yakin yang bersangkutan mampu berkontribusi maksimal pada program/institusi yang dituju."
    },

    // --- KATEGORI: BISNIS & NIAGA ---
    {
        id: 'penawaran',
        nama: '21. Surat Penawaran Barang/Jasa',
        fields: fieldBisnis,
        templateStandar: "{tempatTanggal}\n\nHal: Surat Penawaran Kerjasama / Produk\n\nKepada Yth.\n{tujuan}\ndi {instansiTujuan}\n\nDengan hormat,\nPerkenalkan kami dari {namaPerusahaan}. Bersama surat ini, kami bermaksud menawarkan produk dan layanan unggulan kami dengan rincian: {poin}.\n\nKami menjamin kualitas prima dengan harga yang kompetitif. Kami sangat terbuka untuk berdiskusi lebih lanjut. \n\nHormat kami,\n{nama}\n{jabatan}"
    },
    {
        id: 'pemesanan',
        nama: '22. Surat Pemesanan Barang (PO)',
        fields: fieldBisnis,
        templateStandar: "{tempatTanggal}\n\nHal: Pemesanan Barang (Purchase Order)\n\nKepada Yth.\n{tujuan}\ndi {instansiTujuan}\n\nBerdasarkan penawaran yang telah disepakati, kami dari {namaPerusahaan} bermaksud melakukan pemesanan pengadaan barang/jasa dengan rincian pesanan:\n\n{poin}\n\nMohon pesanan ini segera diproses dan dikirimkan ke alamat kami beserta tagihannya. Terima kasih atas pelayanannya.\n\nHormat kami,\n{nama}\n{jabatan}"
    },
    {
        id: 'invoice',
        nama: '23. Surat Tagihan / Invoice',
        fields: fieldBisnis,
        templateStandar: "{tempatTanggal}\n\nINVOICE / SURAT TAGIHAN\n\nKepada Yth.\n{tujuan}\n{instansiTujuan}\n\nSehubungan dengan penyelesaian pekerjaan/pengiriman barang, kami dari {namaPerusahaan} mengirimkan rincian tagihan yang harus dilunasi:\n\n{poin}\n\nHarap melakukan pembayaran sesuai nominal di atas sebelum jatuh tempo. Terima kasih atas kepercayaan Anda.\n\nHormat kami,\n{nama}\n{jabatan}"
    },
    {
        id: 'pengiriman',
        nama: '24. Surat Pengantar Pengiriman Barang',
        fields: fieldBisnis,
        templateStandar: "{tempatTanggal}\n\nSURAT JALAN / PENGANTAR BARANG\n\nKepada Yth.\n{tujuan}\n{instansiTujuan}\n\nBersama surat ini, kami dari tim ekspedisi {namaPerusahaan} mengantarkan barang pesanan Bapak/Ibu dengan rincian pengiriman: {poin}.\n\nMohon dilakukan pengecekan kondisi barang saat diterima, dan menandatangani surat jalan ini sebagai bukti penerimaan yang sah.\n\nHormat kami,\n{nama}\n{jabatan}"
    },
    {
        id: 'komplain',
        nama: '25. Surat Komplain Produk/Layanan',
        fields: fieldBisnis,
        templateStandar: "{tempatTanggal}\n\nHal: Komplain Pelanggan\n\nKepada Yth.\n{tujuan}\n{instansiTujuan}\n\nMelalui surat ini, saya {nama} dari {namaPerusahaan}, merasa kecewa dan ingin mengajukan komplain resmi terkait pelayanan/produk Bapak/Ibu dikarenakan: {poin}.\n\nKami menuntut adanya penyelesaian, perbaikan, atau kompensasi sesegera mungkin agar hal ini tidak merusak hubungan kerja sama kita."
    },
    {
        id: 'balasan_komplain',
        nama: '26. Surat Balasan Komplain',
        fields: fieldBisnis,
        templateStandar: "{tempatTanggal}\n\nHal: Tanggapan atas Keluhan Pelanggan\n\nKepada Yth.\n{tujuan}\n{instansiTujuan}\n\nKami dari manajemen {namaPerusahaan} memohon maaf yang sebesar-besarnya atas ketidaknyamanan yang Bapak/Ibu alami. Sebagai bentuk tanggung jawab kami, berikut adalah solusi/tindakan yang kami ambil: {poin}.\n\nKami berterima kasih atas masukan Bapak/Ibu yang sangat berharga untuk perbaikan layanan kami ke depannya.\n\nHormat kami,\n{nama}\n{jabatan}"
    },
    {
        id: 'kerjasama',
        nama: '27. Surat Perjanjian Kerjasama (MoU)',
        fields: fieldBisnis,
        templateStandar: "{tempatTanggal}\n\nNOTA KESEPAHAMAN (MoU) KERJASAMA\n\nYang bertanda tangan di bawah ini:\n1. {nama} ({jabatan} - {namaPerusahaan})\n2. {tujuan} (Perwakilan dari {instansiTujuan})\n\nKedua belah pihak sepakat mengikatkan diri dalam sebuah kerja sama bisnis saling menguntungkan dengan syarat dan ruang lingkup: {poin}.\n\nNota Kesepahaman ini berlaku sejak tanggal ditandatangani dan menjadi dasar hukum bagi aktivitas kerja sama selanjutnya."
    },
    {
        id: 'penolakan',
        nama: '28. Surat Penolakan Kerjasama',
        fields: fieldBisnis,
        templateStandar: "{tempatTanggal}\n\nHal: Tanggapan Penawaran Kerjasama\n\nKepada Yth.\n{tujuan}\n{instansiTujuan}\n\nKami dari manajemen {namaPerusahaan} mengucapkan terima kasih atas proposal penawaran yang telah Bapak/Ibu ajukan. \n\nSetelah melalui proses pertimbangan, dengan berat hati kami sampaikan bahwa kami belum dapat menerima tawaran tersebut dikarenakan {poin}.\n\nSemoga kita dapat menjalin kerja sama di kesempatan yang lebih baik."
    },
    {
        id: 'referensi_bank',
        nama: '29. Surat Referensi Bank Perusahaan',
        fields: fieldBisnis,
        templateStandar: "{tempatTanggal}\n\nHal: Surat Referensi Bank\n\nKepada Yth. Pimpinan Bank\n{instansiTujuan}\n\nKami yang bertanda tangan di bawah ini, {nama} selaku {jabatan} di {namaPerusahaan}, menerangkan bahwa:\n\nPerusahaan kami memiliki rekam jejak finansial yang sehat dan bermaksud mengurus administrasi perbankan/kredit. Rincian: {poin}.\n\nSurat ini dibuat untuk keperluan verifikasi administrasi perbankan."
    },
    {
        id: 'ket_domisili_pt',
        nama: '30. Surat Keterangan Domisili Usaha',
        fields: fieldBisnis,
        templateStandar: "{tempatTanggal}\n\nKETERANGAN DOMISILI USAHA\n\nKepada Yth. Pihak Berwenang {instansiTujuan}\n\nSaya {nama}, selaku {jabatan}, dengan ini menerangkan secara resmi bahwa badan usaha bernama {namaPerusahaan} adalah sah beroperasi dan benar berdomisili di wilayah ini. \n\nAdapun fokus bidang usaha kami adalah {poin}.\n\nSurat keterangan ini kami buat dengan sebenar-benarnya untuk digunakan sebagai kelengkapan izin legalitas usaha."
    },

    // --- KATEGORI: DESA & KEPENDUDUKAN ---
    {
        id: 'sktm',
        nama: '31. Surat Keterangan Tidak Mampu (SKTM)',
        fields: fieldDesa,
        templateStandar: "{tempatTanggal}\n\nSURAT KETERANGAN TIDAK MAMPU (SKTM)\n\nPemerintah Desa/Kelurahan menerangkan dengan sesungguhnya bahwa:\n\nNama: {nama}\nNIK: {nik}\nTempat/Tgl Lahir: {ttl}\nPekerjaan: {pekerjaan}\nAlamat: {alamatLengkap}\n\nBerdasarkan data dan pantauan kami, warga tersebut di atas benar-benar penduduk kami dan keadaan perekonomiannya saat ini tergolong TIDAK MAMPU / PRASEJAHTERA.\n\nSurat ini dibuat khusus untuk keperluan: {poin}.\n\nDemikian keterangan ini dibuat untuk dipergunakan sebagaimana mestinya."
    },
    {
        id: 'pengantar_rt',
        nama: '32. Surat Pengantar RT/RW',
        fields: fieldDesa,
        templateStandar: "{tempatTanggal}\n\nSURAT PENGANTAR RT/RW\n\nKetua RT/RW menerangkan bahwa warga di bawah ini:\n\nNama: {nama}\nNIK: {nik}\nTempat/Tgl Lahir: {ttl}\nAlamat: {alamatLengkap}\n\nAdalah benar warga yang berdomisili di lingkungan kami. Surat pengantar ini diberikan kepada yang bersangkutan untuk mengurus administrasi tingkat Kelurahan/Desa dengan keperluan: {poin}.\n\nDemikian surat pengantar ini dibuat dengan sebenarnya."
    },
    {
        id: 'ket_usaha_desa',
        nama: '33. Surat Keterangan Usaha (SKU)',
        fields: fieldDesa,
        templateStandar: "{tempatTanggal}\n\nSURAT KETERANGAN USAHA (SKU)\n\nPemerintah Desa/Kelurahan menerangkan bahwa warga:\n\nNama: {nama}\nNIK: {nik}\nAlamat: {alamatLengkap}\n\nBenar memiliki usaha produktif / Usaha Mikro Kecil Menengah (UMKM) dengan rincian bidang usaha: {poin}.\n\nSurat ini dikeluarkan atas permohonan yang bersangkutan untuk keperluan administrasi bisnis, pendaftaran program pemerintah, atau pengajuan kredit perbankan."
    },
    {
        id: 'ket_belum_nikah',
        nama: '34. Surat Keterangan Belum Menikah',
        fields: fieldDesa,
        templateStandar: "{tempatTanggal}\n\nSURAT KETERANGAN BELUM PERNAH MENIKAH\n\nPemerintah Desa/Kelurahan menerangkan bahwa:\n\nNama: {nama}\nNIK: {nik}\nTempat/Tgl Lahir: {ttl}\nAlamat: {alamatLengkap}\n\nSepanjang catatan dan pengetahuan kami, yang bersangkutan berstatus LAJANG dan belum pernah terikat tali pernikahan dengan siapapun. Surat ini ditujukan untuk kelengkapan berkas: {poin}."
    },
    {
        id: 'ket_kelakuan_baik',
        nama: '35. Surat Keterangan Berkelakuan Baik',
        fields: fieldDesa,
        templateStandar: "{tempatTanggal}\n\nSURAT KETERANGAN BERKELAKUAN BAIK\n\nPemerintah Desa/Kelurahan menerangkan bahwa:\n\nNama: {nama}\nNIK: {nik}\nPekerjaan: {pekerjaan}\nAlamat: {alamatLengkap}\n\nAdalah warga kami yang senantiasa bermasyarakat dengan baik, menjaga norma sosial, dan tidak pernah tercatat melakukan tindakan kriminal atau pelanggaran hukum di lingkungan desa. Keperluan penerbitan surat: {poin}."
    },
    {
        id: 'ket_ahli_waris',
        nama: '36. Surat Keterangan Ahli Waris',
        fields: fieldDesa,
        templateStandar: "{tempatTanggal}\n\nSURAT KETERANGAN AHLI WARIS\n\nKami pemerintah desa menerangkan, dan disaksikan oleh saksi-saksi, bahwa:\n\nNama Ahli Waris: {nama}\nNIK Ahli Waris: {nik}\nAlamat: {alamatLengkap}\n\nAdalah benar keturunan / ahli waris yang sah secara hukum dan nasab dari pewaris yang telah meninggal dunia. Keterangan penetapan pembagian warisan: {poin}.\n\nSurat ini dapat dipertanggungjawabkan kebenarannya."
    },
    {
        id: 'ket_kematian',
        nama: '37. Surat Keterangan Kematian',
        fields: fieldDesa,
        templateStandar: "{tempatTanggal}\n\nSURAT KETERANGAN KEMATIAN\n\nPemerintah Desa/Kelurahan menerangkan dengan duka cita bahwa warga kami:\n\nNama: {nama}\nNIK: {nik}\nAlamat: {alamatLengkap}\n\nTelah meninggal dunia. Adapun sebab dan waktu kematian tercatat sebagai berikut: {poin}.\n\nKami mengimbau instansi terkait dapat membantu proses pencabutan data kependudukan (Akta Kematian). Semoga keluarga yang ditinggalkan diberi ketabahan."
    },
    {
        id: 'ket_kelahiran',
        nama: '38. Surat Keterangan Kelahiran',
        fields: fieldDesa,
        templateStandar: "{tempatTanggal}\n\nSURAT KETERANGAN KELAHIRAN\n\nPemerintah Desa/Kelurahan menerangkan bahwa telah lahir seorang bayi di wilayah kami, dari pasangan suami istri warga desa:\n\nNama Pelapor/Orang Tua: {nama}\nNIK Pelapor: {nik}\nAlamat: {alamatLengkap}\n\nData dan waktu kelahiran bayi adalah: {poin}.\n\nSurat ini diterbitkan sebagai syarat administrasi pengurusan Akta Kelahiran dan penambahan anggota Kartu Keluarga (KK)."
    },
    {
        id: 'ket_pindah',
        nama: '39. Surat Pengantar Pindah Penduduk',
        fields: fieldDesa,
        templateStandar: "{tempatTanggal}\n\nSURAT PENGANTAR PINDAH KEPENDUDUKAN\n\nPemerintah Desa/Kelurahan memberikan pengantar pindah alamat domisili kepada:\n\nNama: {nama}\nNIK: {nik}\nAlamat Asal: {alamatLengkap}\n\nDengan alasan dan alamat lengkap tujuan kepindahan sebagai berikut: {poin}.\n\nMohon pihak kecamatan dan Dinas Dukcapil dapat memproses pencabutan berkas warga tersebut dari wilayah administrasi kami."
    },
    {
        id: 'ket_hilang',
        nama: '40. Surat Pengantar Lapor Kehilangan',
        fields: fieldDesa,
        templateStandar: "{tempatTanggal}\n\nSURAT PENGANTAR LAPOR KEHILANGAN\n\nPemerintah Desa/Kelurahan menerangkan bahwa warga kami:\n\nNama: {nama}\nNIK: {nik}\nAlamat: {alamatLengkap}\n\nTelah melaporkan kehilangan dokumen, surat berharga, atau barang berupa: {poin}.\n\nKami memohon bantuan pihak Kepolisian Sektor setempat untuk dapat menerbitkan Surat Tanda Penerimaan Laporan Kehilangan (STPLK) untuk yang bersangkutan."
    },

    // --- KATEGORI: PERNYATAAN & PERJANJIAN LEGAL ---
    {
        id: 'bebas_narkoba',
        nama: '41. Surat Pernyataan Bebas Narkoba',
        fields: fieldPernyataan,
        templateStandar: "{tempatTanggal}\n\nSURAT PERNYATAAN BEBAS NARKOBA\n\nSaya yang bertanda tangan di bawah ini:\nNama: {nama}\nNIK: {nik}\nAlamat: {alamatLengkap}\n\nDengan kesadaran penuh menyatakan bahwa saya TIDAK PERNAH mengkonsumsi, menyimpan, maupun mengedarkan narkotika dan obat-obatan terlarang. Detail keperluan pernyataan: {poin}.\n\nApabila di kemudian hari terbukti pernyataan ini palsu, saya bersedia dituntut sesuai hukum pidana yang berlaku di Republik Indonesia."
    },
    {
        id: 'kesanggupan',
        nama: '42. Surat Pernyataan Kesanggupan',
        fields: fieldPernyataan,
        templateStandar: "{tempatTanggal}\n\nSURAT PERNYATAAN KESANGGUPAN\n\nSaya yang bertanda tangan di bawah ini:\nNama: {nama}\nNIK / Jabatan: {nik}\nAlamat: {alamatLengkap}\n\nDengan ini menyatakan sanggup dan bersedia sepenuhnya untuk melaksanakan komitmen berupa: {poin}.\n\nDemikian pernyataan ini dibuat dalam keadaan sehat jasmani dan rohani tanpa paksaan pihak manapun."
    },
    {
        id: 'belum_bekerja',
        nama: '43. Surat Pernyataan Belum Bekerja',
        fields: fieldPernyataan,
        templateStandar: "{tempatTanggal}\n\nSURAT PERNYATAAN BELUM BEKERJA\n\nSaya yang bertanda tangan di bawah ini:\nNama: {nama}\nNIK: {nik}\nAlamat: {alamatLengkap}\n\nMenyatakan dengan sebenar-benarnya bahwa saat ini saya berstatus pengangguran, tidak terikat kontrak kerja dengan perusahaan atau instansi pemerintah manapun. Surat ini ditujukan untuk persyaratan: {poin}.\n\nPernyataan ini saya pertanggungjawabkan secara hukum."
    },
    {
        id: 'hutang',
        nama: '44. Surat Perjanjian Hutang Piutang',
        fields: fieldPerjanjian,
        templateStandar: "{tempatTanggal}\n\nSURAT PERJANJIAN HUTANG PIUTANG\n\nYang bertanda tangan di bawah ini:\n1. {nama1} (NIK: {nik1}), beralamat di {alamat1} bertindak sebagai PIHAK PERTAMA (Yang Memberi Pinjaman).\n2. {nama2} (NIK: {nik2}), beralamat di {alamat2} bertindak sebagai PIHAK KEDUA (Yang Meminjam).\n\nKedua belah pihak sepakat melakukan transaksi pinjam meminjam uang dengan nominal dan jatuh tempo pembayaran: {poin}.\n\nPerjanjian ini diikat di atas meterai agar memiliki kekuatan hukum."
    },
    {
        id: 'jual_beli',
        nama: '45. Surat Perjanjian Jual Beli',
        fields: fieldPerjanjian,
        templateStandar: "{tempatTanggal}\n\nSURAT PERJANJIAN JUAL BELI\n\nKami yang bertanda tangan:\n1. {nama1} (NIK: {nik1}), alamat: {alamat1} sebagai PENJUAL.\n2. {nama2} (NIK: {nik2}), alamat: {alamat2} sebagai PEMBELI.\n\nTelah sepakat memindahkan hak kepemilikan/aset berupa barang/tanah/kendaraan dengan spesifikasi dan kesepakatan harga total: {poin}.\n\nSejak ditandatanganinya surat ini, objek jual beli sepenuhnya menjadi tanggung jawab pembeli."
    },
    {
        id: 'sewa',
        nama: '46. Surat Perjanjian Sewa Menyewa',
        fields: fieldPerjanjian,
        templateStandar: "{tempatTanggal}\n\nSURAT PERJANJIAN SEWA MENYEWA\n\nKami yang bertanda tangan:\n1. {nama1} (NIK: {nik1}), alamat: {alamat1} sebagai PEMILIK (Pihak Pertama).\n2. {nama2} (NIK: {nik2}), alamat: {alamat2} sebagai PENYEWA (Pihak Kedua).\n\nSepakat mengikatkan diri dalam kontrak sewa bangunan/kendaraan/alat dengan durasi, biaya, dan tata tertib sewa: {poin}.\n\nPihak penyewa wajib merawat objek sewa dengan baik."
    },
    {
        id: 'pranikah',
        nama: '47. Surat Perjanjian Pranikah',
        fields: fieldPerjanjian,
        templateStandar: "{tempatTanggal}\n\nSURAT PERJANJIAN PRANIKAH\n\nKami calon suami istri:\n1. {nama1} (NIK: {nik1}), alamat: {alamat1}.\n2. {nama2} (NIK: {nik2}), alamat: {alamat2}.\n\nBersepakat untuk mengatur pembagian harta bawaan, penyatuan harta bersama, dan hak/kewajiban sebelum meresmikan pernikahan. Rincian kesepakatan: {poin}.\n\nKesepakatan ini mengikat secara hukum kekeluargaan."
    },
    {
        id: 'kuasa_bpkb',
        nama: '48. Surat Kuasa Pengambilan BPKB',
        fields: fieldKuasa,
        templateStandar: "{tempatTanggal}\n\nSURAT KUASA PENGAMBILAN BPKB\n\nSaya yang bertanda tangan di bawah ini:\nNama: {nama}\nNIK: {nik}\nAlamat: {alamatLengkap}\nSebagai PEMBERI KUASA.\n\nMemberikan kuasa penuh tanpa hak substitusi kepada:\nNama: {penerimaKuasa}\nNIK: {nikPenerima}\nSebagai PENERIMA KUASA.\n\nUntuk mewakili saya mengambil BPKB Kendaraan Bermotor dengan rincian spesifikasi: {poin}.\n\nSegala akibat dari pemberian kuasa ini menjadi tanggung jawab saya sepenuhnya."
    },
    {
        id: 'kuasa_paspor',
        nama: '49. Surat Kuasa Pengambilan Paspor',
        fields: fieldKuasa,
        templateStandar: "{tempatTanggal}\n\nSURAT KUASA PENGAMBILAN PASPOR\n\nSaya yang bertanda tangan di bawah ini:\nNama: {nama}\nNIK: {nik}\nAlamat: {alamatLengkap}\nSebagai Pemilik Paspor.\n\nMelimpahkan wewenang kepada:\nNama: {penerimaKuasa}\nNIK: {nikPenerima}\n\nUntuk mengambil Buku Paspor milik saya di Kantor Imigrasi dikarenakan saya berhalangan hadir dengan alasan/rincian: {poin}."
    },
    {
        id: 'kuasa_waris',
        nama: '50. Surat Kuasa Ahli Waris',
        fields: fieldKuasa,
        templateStandar: "{tempatTanggal}\n\nSURAT PELIMPAHAN KUASA AHLI WARIS\n\nKami yang bertanda tangan (seluruh ahli waris), menunjuk wakil dari pihak keluarga:\n\nNama Kuasa: {penerimaKuasa}\nNIK Kuasa: {nikPenerima}\n\nUntuk dan atas nama para ahli waris ({nama} - NIK {nik}), mengurus segala bentuk pencairan dana bank, administrasi aset, atau balik nama sertifikat dengan rincian: {poin}.\n\nPemberian kuasa ini sah dan mengikat para pihak terkait."
    },

    // --- KATEGORI: UMUM & ORGANISASI ---
    {
        id: 'undangan',
        nama: '51. Surat Undangan Rapat/Acara',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nHal: Undangan Kegiatan / Rapat\n\nKepada Yth.\n{tujuan}\n\nDengan hormat,\nKami dari {nama} mengharapkan kehadiran Bapak/Ibu/Saudara dalam agenda {kegiatan} yang akan kami selenggarakan pada:\n\nHari/Tanggal: {tanggalKegiatan}\nDetail Acara/Tempat: {poin}\n\nMengingat pentingnya acara ini, kami mohon agar Bapak/Ibu dapat hadir tepat waktu. Atas perhatiannya, kami ucapkan terima kasih."
    },
    {
        id: 'proposal',
        nama: '52. Surat Permohonan Bantuan Dana (Proposal)',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Bantuan Dana & Sponsorship\n\nKepada Yth.\n{tujuan}\n\nDengan hormat,\nKami kepengurusan {nama} akan menyelenggarakan program edukasi/kemasyarakatan bertajuk {kegiatan} pada tanggal {tanggalKegiatan}.\n\nUntuk mensukseskan acara tersebut, kami memohon dukungan bantuan dana/sponsorship dengan rincian RAB: {poin}.\n\nBantuan Bapak/Ibu sangat berarti bagi kesuksesan visi dan misi acara ini."
    },
    {
        id: 'peminjaman',
        nama: '53. Surat Peminjaman Tempat/Alat',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Izin Peminjaman Fasilitas\n\nKepada Yth.\n{tujuan}\n\nDengan hormat,\nOrganisasi kami, {nama}, merencanakan agenda {kegiatan} pada {tanggalKegiatan}.\n\nSehubungan dengan hal itu, kami memohon izin untuk meminjam tempat/fasilitas/peralatan yang Bapak/Ibu kelola dengan rincian: {poin}.\n\nKami berjanji akan menjaga kebersihan dan mencegah kerusakan fasilitas selama kami gunakan."
    },
    {
        id: 'pemberitahuan',
        nama: '54. Surat Pemberitahuan Kegiatan / Izin Keramaian',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nHal: Pemberitahuan Pelaksanaan Kegiatan\n\nKepada Yth.\n{tujuan}\n\nDengan hormat,\nBersama surat ini, kami {nama} memberitahukan bahwa akan diadakan {kegiatan} pada {tanggalKegiatan}.\n\nKami menginformasikan potensi penutupan jalan/keramaian massa dengan estimasi: {poin}.\n\nMohon maklum dan bantuan izin keamanan dari pihak yang berwenang selama acara berlangsung."
    },
    {
        id: 'berita_acara',
        nama: '55. Berita Acara Serah Terima',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nBERITA ACARA SERAH TERIMA\n\nPada hari ini, {tanggalKegiatan}, telah dilaksanakan pertemuan agenda {kegiatan}.\n\nPihak {nama} menyerahkan amanat/barang kepada Pihak {tujuan}.\n\nDalam serah terima ini, objek yang diserahkan dan disepakati kondisinya adalah: {poin}.\n\nBerita acara ini menjadi bukti peralihan wewenang dan tanggung jawab yang sah."
    },
    {
        id: 'sk',
        nama: '56. Surat Keputusan (SK) Panitia/Pengurus',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nSURAT KEPUTUSAN\n\nPimpinan Tertinggi {nama}, setelah menimbang regulasi dasar dan AD/ART.\n\nMEMUTUSKAN dan MENETAPKAN Saudara {tujuan} untuk bertugas dalam program {kegiatan} yang dimulai pada {tanggalKegiatan}.\n\nLingkup wewenang dan hak yang diberikan adalah: {poin}.\n\nKeputusan ini mutlak dan wajib dijalankan."
    },
    {
        id: 'instruksi',
        nama: '57. Surat Instruksi Pelaksanaan',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nSURAT INSTRUKSI KERJA\n\nKetua {nama} memberikan instruksi tegas kepada:\n\n{tujuan}\n\nUntuk segera mempersiapkan dan mengeksekusi {kegiatan} paling lambat pada {tanggalKegiatan}.\n\nArahan detail yang harus dilakukan: {poin}.\n\nInstruksi ini bersifat mendesak dan laporkan hasilnya secara berkala."
    },
    {
        id: 'somasi',
        nama: '58. Surat Teguran Hukum (Somasi)',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nSOMASI HUKUM TERBUKA\n\nKepada {tujuan},\n\nKami yang bertindak mewakili badan {nama}, memberikan teguran keras atas kejadian {kegiatan} pada tanggal {tanggalKegiatan}.\n\nPelanggaran kesepakatan/hukum yang Anda lakukan adalah: {poin}.\n\nApabila dalam 3x24 jam tidak ada iktikad baik penyelesaian, kami akan melimpahkan masalah ini ke jalur perdata maupun pidana."
    },
    {
        id: 'maaf',
        nama: '59. Surat Permintaan Maaf Resmi',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nHal: Permohonan Maaf Resmi\n\nKepada Yth.\n{tujuan}\n\nKami dari manajemen {nama} memohon maaf yang sebesar-besarnya atas insiden/keterlambatan/kesalahan teknis dalam {kegiatan} pada {tanggalKegiatan}.\n\nAdapun kompensasi dan tindak lanjut dari kami adalah: {poin}.\n\nKami berjanji akan memperbaiki SOP kami agar kesalahan serupa tidak terjadi di masa depan."
    },
    {
        id: 'terimakasih',
        nama: '60. Surat Ucapan Terima Kasih',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nHal: Apresiasi & Terima Kasih\n\nKepada Yth.\n{tujuan}\n\nKeluarga besar {nama} ingin mengucapkan ribuan terima kasih atas dukungan moril maupun materil Bapak/Ibu dalam mensukseskan acara {kegiatan} pada {tanggalKegiatan}.\n\nDukungan dari Anda sangat krusial karena: {poin}.\n\nSemoga hubungan baik ini senantiasa terjaga."
    },
    {
        id: 'pakta',
        nama: '61. Pakta Integritas',
        fields: fieldPernyataan,
        templateStandar: "{tempatTanggal}\n\nPAKTA INTEGRITAS KOMITMEN KERJA\n\nSaya yang bertanda tangan di bawah ini:\nNama: {nama}\nJabatan/NIK: {nik}\n\nMenyatakan bersedia menolak segala bentuk suap, korupsi, dan gratifikasi selama mengemban tugas. Saya berjanji menjaga kerahasiaan: {poin}.\n\nApabila melanggar, saya siap diberhentikan dan diproses secara hukum."
    },
    {
        id: 'tugas',
        nama: '62. Surat Tugas/Mandat Khusus',
        fields: fieldOrganisasi,
        templateStandar: "{tempatTanggal}\n\nSURAT MANDAT KHUSUS\n\nYang bertanda tangan di bawah ini, pimpinan {nama}, memberikan mandat wewenang penuh kepada:\n\n{tujuan}\n\nUntuk mewakili instansi dan mengeksekusi {kegiatan} pada rentang waktu {tanggalKegiatan}.\n\nRincian batasan mandat dan biaya: {poin}.\n\nSurat ini sah sebagai identitas perwakilan institusi."
    }
];