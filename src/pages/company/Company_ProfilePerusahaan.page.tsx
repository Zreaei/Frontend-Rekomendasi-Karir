import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Building2, Globe, MapPin, Mail, Phone, Edit3, 
  Users, Briefcase, Eye, CheckCircle2, ShieldCheck, Hash, UserCheck
} from 'lucide-react'
import { CompanyService, initialCompanyProfile, initialLowongan, initialApplicants, type CompanyProfileData } from './CompanyData'

const Company_ProfilePerusahaan = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [profile, setProfile] = useState<CompanyProfileData>(initialCompanyProfile)

  // Toast notifikasi sukses, 3 fase:
  // visible = ada di DOM sama sekali atau tidak
  // entered = udah "mekar" penuh (dipakai buat transisi tinggi + fade masuk)
  // leaving = lagi proses nutup (dipakai buat transisi tinggi + fade keluar)
  const [toast, setToast] = useState<{ visible: boolean; entered: boolean; leaving: boolean }>({
    visible: false, entered: false, leaving: false
  })

  useEffect(() => {
    CompanyService.getProfile().then(data => setProfile(data))
  }, [])

  const stats = useMemo(() => {
    const activeJobs = initialLowongan.filter(j => j.status === 'Aktif').length
    const totalApplicants = initialApplicants.length
    const profileViews = 4890
    return { activeJobs, totalApplicants, profileViews }
  }, [])

  // Setelah kembali dari halaman Ubah Profil / Pengaturan Akun, tampilkan data terbaru + toast sukses.
  // TODO: begitu API sudah ada, ganti ini dengan refetch data profil dari server.
  useEffect(() => {
    const state = location.state as { saved?: boolean } | null
    if (state?.saved) {
      CompanyService.getProfile().then(data => setProfile(data))
      setToast({ visible: true, entered: false, leaving: false })
      // Bersihkan state supaya toast tidak muncul lagi kalau halaman di-refresh
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, navigate, location.pathname])

  // Frame berikutnya setelah mount, "mekarkan" toast — ini yang bikin transisi tingginya kepakai
  // (browser butuh render 1 frame di kondisi collapsed dulu sebelum transisi ke kondisi expanded kedeteksi)
  useEffect(() => {
    if (toast.visible && !toast.entered && !toast.leaving) {
      const raf = requestAnimationFrame(() => setToast(prev => ({ ...prev, entered: true })))
      return () => cancelAnimationFrame(raf)
    }
  }, [toast.visible, toast.entered, toast.leaving])

  // Setelah beberapa detik, mulai animasi menutup
  useEffect(() => {
    if (toast.entered && !toast.leaving) {
      const startLeave = setTimeout(() => setToast(prev => ({ ...prev, leaving: true })), 3000)
      return () => clearTimeout(startLeave)
    }
  }, [toast.entered, toast.leaving])

  // Baru benar-benar dilepas dari DOM setelah animasi menutup selesai
  useEffect(() => {
    if (toast.leaving) {
      const unmount = setTimeout(() => setToast({ visible: false, entered: false, leaving: false }), 400)
      return () => clearTimeout(unmount)
    }
  }, [toast.leaving])

  // Pastikan user langsung "diarahin" ke posisi notifikasi, bukan cuma nongol diam-diam di tempat yang mungkin nggak kelihatan
  const toastRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (toast.entered && !toast.leaving) {
      const scrollTimer = setTimeout(() => {
        toastRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
      return () => clearTimeout(scrollTimer)
    }
  }, [toast.entered, toast.leaving])

  const kotaKantorPusat = useMemo(() => {
    const segments = profile.lokasi.split(',')
    const lastSegment = segments[segments.length - 1] || ''
    return lastSegment.replace(/\d+/g, '').trim()
  }, [profile.lokasi])

  const inisialAdmin = useMemo(() => {
    return profile.namaAdmin
      .trim()
      .split(/\s+/)
      .map((word: string) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }, [profile.namaAdmin])

  const detailFields = [
    { icon: Building2, label: 'Nama Resmi Perusahaan', value: profile.namaPerusahaan },
    { icon: Briefcase, label: 'Kategori Industri', value: profile.bidangIndustri },
    { icon: Globe, label: 'Situs Web Resmi', value: profile.website.replace(/^https?:\/\//, ''), href: profile.website },
    { icon: Hash, label: 'Nomor Induk Berusaha (NIB)', value: profile.nib },
  ]

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">

      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#e4e9f4] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center shrink-0 border border-[#d0e0ff]">
            <Building2 size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Profil Perusahaan</h1>
            <p className="text-sm text-[#5b6170] mt-0.5">Kelola identitas publik, informasi resmi, dan akun rekrutmen organisasi Anda.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/company/ubah-profil-perusahaan')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0f5ce0] rounded-xl text-sm font-bold text-white hover:bg-[#0d4ebf] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-95 shadow-sm shrink-0"
        >
          <Edit3 size={16} />
          Ubah Profil Perusahaan
        </button>
      </div>

      {/* Toast Notifikasi Sukses — di antara header & hero card, transisi tinggi + fade yang halus */}
      {toast.visible && (
        <div
          className={`grid transition-[grid-template-rows,opacity] ease-in-out ${
            toast.entered && !toast.leaving
              ? 'grid-rows-[1fr] opacity-100 duration-500'
              : 'grid-rows-[0fr] opacity-0 duration-400'
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div
              ref={toastRef}
              className={`flex items-start gap-3 px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm transition-transform ease-in-out ${
                toast.entered && !toast.leaving
                  ? 'translate-y-0 duration-500'
                  : '-translate-y-2 duration-400'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-emerald-800">Berhasil disimpan!</p>
                <p className="text-xs text-emerald-700 mt-0.5">Profil perusahaan berhasil diperbarui dan disimpan.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Identitas Perusahaan */}
      <div className="bg-white rounded-[24px] border border-[#e4e9f4] p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#0f5ce0] to-[#0d4ebf] text-white flex items-center justify-center shrink-0 shadow-md overflow-hidden border-2 border-white">
            {profile.logo ? (
              <img src={profile.logo} alt="Logo Perusahaan" className="w-full h-full object-cover" />
            ) : (
              <Building2 size={36} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl font-bold text-[#111827] tracking-tight">{profile.namaPerusahaan}</h2>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                <ShieldCheck size={14} /> Terverifikasi
              </span>
            </div>
            <p className="text-sm text-[#7b8191] font-medium mt-1">{profile.bidangIndustri}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full md:w-auto">
          <div className="flex items-center gap-3.5 px-5 py-3 bg-[#f8faff] border border-[#e4e9f4] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center shrink-0">
              <Users size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#7b8191] uppercase tracking-wider">Karyawan</p>
              <p className="text-xs font-bold text-[#111827] truncate">{profile.jumlahKaryawan}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 px-5 py-3 bg-[#f8faff] border border-[#e4e9f4] rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center shrink-0">
              <MapPin size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#7b8191] uppercase tracking-wider">Kantor Pusat</p>
              <p className="text-xs font-bold text-[#111827] truncate max-w-[140px]">{kotaKantorPusat}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Detail Perusahaan */}
          <div className="bg-white rounded-[24px] border border-[#e4e9f4] p-8 shadow-sm">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-6 pb-4 border-b border-[#f1f4f9] flex items-center justify-between gap-2">
              <span>Informasi Legal & Operasional</span>
              <span className="text-[11px] font-medium text-[#7b8191] normal-case">Data tervalidasi</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {detailFields.map((field) => {
                const Icon = field.icon
                return (
                  <div key={field.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#f8faff] border border-[#e4e9f4] text-[#0f5ce0] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider mb-1">{field.label}</p>
                      {field.href ? (
                        <a href={field.href} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#0f5ce0] hover:underline break-words">
                          {field.value}
                        </a>
                      ) : (
                        <p className="text-sm font-bold text-[#111827] break-words">{field.value}</p>
                      )}
                    </div>
                  </div>
                )
              })}
              
              <div className="flex items-start gap-4 sm:col-span-2 pt-2">
                <div className="w-10 h-10 rounded-xl bg-[#f8faff] border border-[#e4e9f4] text-[#0f5ce0] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-wider mb-1">Alamat Lengkap Kantor Pusat</p>
                  <p className="text-sm font-medium text-[#111827] leading-relaxed">{profile.lokasi}</p>
                </div>
              </div>
            </div>
          </div>

          {/* About Us */}
          <div className="bg-white rounded-[24px] border border-[#e4e9f4] p-8 shadow-sm flex-1 flex flex-col">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-6 pb-4 border-b border-[#f1f4f9]">
              Tentang Perusahaan (About Us)
            </h3>
            <div 
              className="text-sm text-[#5b6170] leading-relaxed text-justify font-normal 
                         [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-4 last:[&>p]:mb-0 [&>a]:text-[#0f5ce0] [&>a]:underline"
              dangerouslySetInnerHTML={{ __html: profile.description }}
            />
          </div>

        </div>

        <div className="flex flex-col gap-8">

          {/* Admin Akun */}
          <div className="bg-white rounded-[24px] border border-[#e4e9f4] p-8 shadow-sm">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-6 pb-4 border-b border-[#f1f4f9] flex items-center gap-2">
              <UserCheck size={15} className="text-[#0f5ce0]" />
              Penanggung Jawab (Admin)
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#eef4ff] text-[#0f5ce0] font-bold text-lg border-2 border-[#d0e0ff] flex items-center justify-center shrink-0 shadow-sm">
                <span>{inisialAdmin}</span>
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-[#111827] truncate">{profile.namaAdmin}</p>
                <p className="text-xs text-[#7b8191] font-medium mt-0.5">{profile.jabatanAdmin}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm text-[#5b6170] font-medium mb-6 bg-[#f8faff] p-4 rounded-2xl border border-[#e4e9f4]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#e4e9f4] text-[#7b8191] flex items-center justify-center shrink-0">
                  <Mail size={14} />
                </div>
                <span className="truncate text-xs">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#e4e9f4] text-[#7b8191] flex items-center justify-center shrink-0">
                  <Phone size={14} />
                </div>
                <span className="text-xs">{profile.phone}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/company/pengaturan-akun')}
              className="w-full py-3 bg-white border-2 border-[#e4e9f4] hover:bg-[#f8faff] hover:border-[#0f5ce0] text-sm font-bold text-[#111827] rounded-xl transition-all shadow-sm active:scale-95"
            >
              Pengaturan Akun & Keamanan
            </button>
          </div>

          {/* Aktivitas Rekrutmen */}
          <div className="bg-white rounded-[24px] border border-[#e4e9f4] p-8 shadow-sm">
            <h3 className="text-xs font-bold text-[#7b8191] uppercase tracking-wider mb-6 pb-4 border-b border-[#f1f4f9]">
              Statistik Aktivitas Rekrutmen
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3.5 bg-[#f8faff] rounded-2xl border border-[#e4e9f4]">
                <span className="text-sm text-[#5b6170] font-semibold flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center shrink-0">
                    <Briefcase size={16} />
                  </span>
                  Lowongan Aktif
                </span>
                <span className="text-sm font-bold text-[#0f5ce0] bg-white px-3 py-1.5 rounded-xl border border-[#e4e9f4] shadow-sm min-w-[45px] text-center">{stats.activeJobs}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#f8faff] rounded-2xl border border-[#e4e9f4]">
                <span className="text-sm text-[#5b6170] font-semibold flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Users size={16} />
                  </span>
                  Total Pelamar
                </span>
                <span className="text-sm font-bold text-[#111827] bg-white px-3 py-1.5 rounded-xl border border-[#e4e9f4] shadow-sm min-w-[45px] text-center">{stats.totalApplicants}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#f8faff] rounded-2xl border border-[#e4e9f4]">
                <span className="text-sm text-[#5b6170] font-semibold flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Eye size={16} />
                  </span>
                  Profil Dilihat
                </span>
                <span className="text-sm font-bold text-[#111827] bg-white px-3 py-1.5 rounded-xl border border-[#e4e9f4] shadow-sm min-w-[60px] text-center">{stats.profileViews.toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Company_ProfilePerusahaan