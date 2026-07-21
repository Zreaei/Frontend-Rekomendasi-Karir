import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, ShieldCheck, CheckCircle2, X, KeyRound, AlertCircle } from 'lucide-react'
import { CompanyService, initialCompanyProfile, type CompanyProfileData } from './CompanyData'

const Company_PengaturanAkun = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<CompanyProfileData>(initialCompanyProfile)

  const [pwCurrent, setPwCurrent] = useState('')
  const [pwNew, setPwNew] = useState('')
  const [pwConfirm, setPwConfirm] = useState('')
  
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)

  useEffect(() => {
    CompanyService.getProfile().then(data => setProfile(data))
  }, [])

  const inisialAdmin = profile.namaAdmin
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleClose = () => {
    navigate('/company/profil-perusahaan')
  }

  const handleChange = (field: 'namaAdmin' | 'email' | 'phone', value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleUpdatePassword = () => {
    setPwError(null)

    if (!pwCurrent || !pwNew || !pwConfirm) {
      setPwError('Semua kolom kata sandi wajib diisi.')
      return
    }

    if (pwNew.length < 8) {
      setPwError('Kata sandi baru harus memiliki panjang minimal 8 karakter.')
      return
    }

    if (pwNew !== pwConfirm) {
      setPwError('Konfirmasi kata sandi baru tidak cocok dengan kata sandi baru.')
      return
    }

    setPwSuccess(true)
    setPwCurrent('')
    setPwNew('')
    setPwConfirm('')
    setTimeout(() => setPwSuccess(false), 3000)
  }

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await CompanyService.saveProfile(profile)

    navigate('/company/profil-perusahaan', { state: { saved: true } })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e4e9f4]">

        {/* Header */}
        <div className="flex items-start justify-between px-8 py-6 border-b border-[#e4e9f4] sticky top-0 bg-white/95 backdrop-blur z-20">
          <div>
            <h3 className="text-xl font-bold text-[#111827]">Pengaturan Akun & Keamanan</h3>
            <p className="text-xs text-[#7b8191] mt-1">Kelola informasi kontak penanggung jawab dan preferensi kata sandi sistem rekrutmen Anda.</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-[#7b8191] hover:text-[#111827] rounded-xl transition hover:bg-gray-100 shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="p-8 flex flex-col gap-6">

          {/* Section: Profil Pribadi & Kontak */}
          <div className="bg-[#f8faff] border border-[#e4e9f4] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                <User size={16} className="text-[#0f5ce0]" />
                Profil Penanggung Jawab (Admin)
              </h4>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <CheckCircle2 size={13} />
                Aktif
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#eef4ff] text-[#0f5ce0] font-bold text-lg border border-[#d0e0ff] flex items-center justify-center shrink-0 shadow-sm">
                <span>{inisialAdmin}</span>
              </div>
              <div className="flex-1 w-full min-w-0">
                <label className="block text-[11px] font-bold text-[#7b8191] uppercase tracking-wider mb-2">Nama Lengkap Admin</label>
                <input
                  type="text"
                  value={profile.namaAdmin}
                  onChange={(e) => handleChange('namaAdmin', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] focus:ring-4 focus:ring-[#0f5ce0]/10 transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#7b8191] uppercase tracking-wider mb-2">Alamat Email Resmi</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] focus:ring-4 focus:ring-[#0f5ce0]/10 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#7b8191] uppercase tracking-wider mb-2">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Contoh: +62 811-xxxx-xxxx"
                  className="w-full px-4 py-3 bg-white border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] focus:ring-4 focus:ring-[#0f5ce0]/10 transition font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section: Keamanan & Sandi */}
          <div className="bg-[#f8faff] border border-[#e4e9f4] rounded-2xl p-6">
            <h4 className="text-sm font-bold text-[#111827] flex items-center gap-2 mb-4">
              <ShieldCheck size={16} className="text-[#0f5ce0]" />
              Keamanan Akun
            </h4>

            <div className="bg-white border border-[#e4e9f4] rounded-2xl p-5 shadow-sm">
              <p className="text-sm font-bold text-[#111827]">Ubah Kata Sandi</p>
              <p className="text-xs text-[#7b8191] mt-0.5 mb-5">Gunakan kombinasi minimal 8 karakter untuk menjaga keamanan akses sistem rekrutmen Anda.</p>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#7b8191] uppercase tracking-wider mb-2">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    value={pwCurrent}
                    onChange={(e) => setPwCurrent(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#f8faff] border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] focus:ring-4 focus:ring-[#0f5ce0]/10 transition"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#7b8191] uppercase tracking-wider mb-2">Kata Sandi Baru</label>
                    <input
                      type="password"
                      value={pwNew}
                      onChange={(e) => setPwNew(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      className="w-full px-4 py-3 bg-[#f8faff] border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] focus:ring-4 focus:ring-[#0f5ce0]/10 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#7b8191] uppercase tracking-wider mb-2">Konfirmasi Sandi Baru</label>
                    <input
                      type="password"
                      value={pwConfirm}
                      onChange={(e) => setPwConfirm(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      className="w-full px-4 py-3 bg-[#f8faff] border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] focus:ring-4 focus:ring-[#0f5ce0]/10 transition"
                    />
                  </div>
                </div>

                {pwError && (
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span>{pwError}</span>
                  </div>
                )}

                {pwSuccess && (
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Kata sandi berhasil diperbarui.</span>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleUpdatePassword}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#0f5ce0] text-[#0f5ce0] hover:bg-[#0f5ce0] hover:text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
                  >
                    <KeyRound size={14} />
                    Perbarui Kata Sandi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Aksi */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e4e9f4]">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-white border border-[#e4e9f4] text-[#5b6170] hover:text-[#111827] hover:bg-gray-50 rounded-xl text-sm font-bold transition shadow-sm active:scale-95"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#0f5ce0] text-white rounded-xl text-sm font-bold hover:bg-[#0d4ebf] hover:-translate-y-0.5 transition shadow-md active:scale-95"
            >
              Simpan Semua Perubahan
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Company_PengaturanAkun