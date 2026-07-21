import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Globe, UploadCloud, ChevronDown, ArrowLeft,
  Bold, Italic, Underline, List, Link2, Building2, ImagePlus, Edit3
} from 'lucide-react'
import { CompanyService, initialCompanyProfile, type CompanyProfileData } from './CompanyData'

const UKURAN_PERUSAHAAN_OPTIONS = [
  '1-50 Anggota',
  '51-200 Anggota',
  '201-500 Anggota',
  '501-1000 Anggota',
  '1000+ Anggota',
]

const INDUSTRI_OPTIONS = [
  'Teknologi Informasi',
  'Keuangan',
  'Manufaktur',
  'Pendidikan',
  'Kesehatan',
  'Retail',
  'Lainnya'
]

const Company_UbahProfile = () => {
  const navigate = useNavigate()
  
  const [profile, setProfile] = useState<CompanyProfileData>(initialCompanyProfile)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isCustomIndustri, setIsCustomIndustri] = useState(false)
  
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const errorBannerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    CompanyService.getProfile().then(data => {
      setProfile(data)
      setLogoPreview(data.logo)
      setIsCustomIndustri(!INDUSTRI_OPTIONS.includes(data.bidangIndustri) && data.bidangIndustri !== '')
      if (editorRef.current) {
        editorRef.current.innerHTML = data.description
      }
    })
  }, [])

  const handleChange = (field: keyof CompanyProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
    if (errorMessage) setErrorMessage(null)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('Ukuran file logo terlalu besar. Maksimal ukuran file adalah 2MB.')
        errorBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
      const url = URL.createObjectURL(file)
      setLogoPreview(url)
      handleChange('logo', url)
    }
  }

  const handleCancel = () => {
    navigate('/company/profil-perusahaan')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, boolean> = {}
    
    if (!profile.namaPerusahaan || !profile.namaPerusahaan.trim()) newErrors.namaPerusahaan = true
    if (!profile.bidangIndustri || !profile.bidangIndustri.trim()) newErrors.bidangIndustri = true
    if (!profile.jumlahKaryawan || !profile.jumlahKaryawan.trim()) newErrors.jumlahKaryawan = true
    if (!profile.nib || !profile.nib.trim()) newErrors.nib = true
    
    const websiteClean = profile.website ? profile.website.replace(/^https?:\/\//, '').trim() : ''
    if (!websiteClean) newErrors.website = true
    if (!profile.lokasi || !profile.lokasi.trim()) newErrors.lokasi = true

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setErrorMessage('Mohon lengkapi seluruh kolom wajib bertanda bintang merah (*) sebelum menyimpan perubahan.')
      
      setTimeout(() => {
        errorBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }

    const finalDescription = editorRef.current ? editorRef.current.innerHTML : profile.description
    const updatedPayload = { ...profile, description: finalDescription }
    
    await CompanyService.saveProfile(updatedPayload)
    
    navigate('/company/profil-perusahaan', { state: { saved: true } })
  }

  const handleFormat = (e: React.MouseEvent, command: string, value?: string) => {
    e.preventDefault() 
    document.execCommand(command, false, value)
  }

  const handleLink = (e: React.MouseEvent) => {
    e.preventDefault()
    const url = prompt('Masukkan URL Link (contoh: https://google.com):')
    if (url) {
      document.execCommand('createLink', false, url)
    }
  }

  const getInputStyle = (fieldName: string) => {
    const base = "w-full px-4 py-3 bg-[#f8faff] rounded-xl text-sm text-[#111827] transition-all duration-200 focus:bg-white focus:outline-none"
    if (errors[fieldName]) {
      return `${base} border-2 border-red-500 ring-4 ring-red-100`
    }
    return `${base} border border-[#e4e9f4] focus:border-[#0f5ce0] focus:ring-4 focus:ring-[#0f5ce0]/10`
  }

  const labelStyles = "block text-[11px] font-bold text-[#7b8191] uppercase tracking-wider mb-2"

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-10">

      <div>
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-1.5 text-[15px] font-semibold text-[#7b8191] hover:text-[#0f5ce0] transition mb-3 w-fit"
        >
          <span>Profil Perusahaan</span>
          <span className="text-[#cbd5e1] font-normal mx-0.5">/</span>
          <span className="text-[#111827]">Ubah Profil</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">Ubah Profil Perusahaan</h1>
        <p className="text-sm text-[#5b6170] mt-1.5">Perbarui identitas, informasi kontak, dan deskripsi publik perusahaan Anda.</p>
      </div>

      {errorMessage && (
        <div 
          ref={errorBannerRef} 
          className="flex flex-col gap-1 px-5 py-4 bg-red-50 border border-red-300 text-red-900 rounded-2xl text-sm font-semibold animate-in slide-in-from-top-2 duration-300 shadow-sm"
        >
          <span className="font-bold text-red-800">Validasi Gagal</span>
          <span className="text-xs text-red-700 font-normal">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8 mt-2">

        <div className="bg-white rounded-[20px] border border-[#e4e9f4] shadow-sm overflow-hidden">
          <div className="bg-[#f8faff] px-7 py-5 border-b border-[#e4e9f4] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center shrink-0 border border-[#d0e0ff]">
              <Building2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">Informasi Legal & Bisnis</h3>
              <p className="text-xs text-[#7b8191] font-medium mt-0.5">Detail utama yang akan dilihat oleh kandidat pelamar.</p>
            </div>
          </div>

          <div className="p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
              
              <div>
                <label className={labelStyles}>
                  Nama Resmi Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.namaPerusahaan}
                  onChange={(e) => handleChange('namaPerusahaan', e.target.value)}
                  className={getInputStyle('namaPerusahaan')}
                  placeholder="Contoh: PT. Teknologi Nusantara"
                />
                {errors.namaPerusahaan && <p className="text-xs text-red-500 font-medium mt-1.5">Nama resmi perusahaan wajib diisi.</p>}
              </div>

              <div>
                <label className={labelStyles}>
                  Kategori Industri <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <select
                      value={isCustomIndustri ? 'Lainnya' : (INDUSTRI_OPTIONS.includes(profile.bidangIndustri) ? profile.bidangIndustri : '')}
                      onChange={(e) => {
                        if (e.target.value === 'Lainnya') {
                          setIsCustomIndustri(true)
                          handleChange('bidangIndustri', '')
                        } else {
                          setIsCustomIndustri(false)
                          handleChange('bidangIndustri', e.target.value)
                        }
                      }}
                      className={`${getInputStyle('bidangIndustri')} appearance-none pr-10 cursor-pointer`}
                    >
                      <option value="" disabled>Pilih opsi</option>
                      {INDUSTRI_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
                  </div>
                  
                  {isCustomIndustri && (
                    <input
                      type="text"
                      placeholder="Ketik nama industri Anda..."
                      value={profile.bidangIndustri}
                      onChange={(e) => handleChange('bidangIndustri', e.target.value)}
                      className={`${getInputStyle('bidangIndustri')} animate-in fade-in slide-in-from-top-1`}
                      autoFocus
                    />
                  )}
                  {errors.bidangIndustri && <p className="text-xs text-red-500 font-medium mt-1.5">Kategori industri wajib dipilih atau diisi.</p>}
                </div>
              </div>

              <div>
                <label className={labelStyles}>
                  Ukuran Perusahaan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={profile.jumlahKaryawan}
                    onChange={(e) => handleChange('jumlahKaryawan', e.target.value)}
                    className={`${getInputStyle('jumlahKaryawan')} appearance-none pr-10 cursor-pointer`}
                  >
                    {UKURAN_PERUSAHAAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
                </div>
                {errors.jumlahKaryawan && <p className="text-xs text-red-500 font-medium mt-1.5">Ukuran perusahaan wajib dipilih.</p>}
              </div>

              <div>
                <label className={labelStyles}>
                  NIB (Nomor Induk Berusaha) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={profile.nib}
                  onChange={(e) => handleChange('nib', e.target.value)}
                  className={`${getInputStyle('nib')} tracking-widest font-medium`}
                  placeholder="Contoh: 01230495817260001"
                />
                {errors.nib && <p className="text-xs text-red-500 font-medium mt-1.5">NIB wajib diisi.</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={labelStyles}>
                  Situs Web Resmi <span className="text-red-500">*</span>
                </label>
                <div className={`flex rounded-xl overflow-hidden transition-all duration-200 bg-[#f8faff] ${errors.website ? 'border-2 border-red-500 ring-4 ring-red-100' : 'border border-[#e4e9f4] focus-within:border-[#0f5ce0] focus-within:ring-4 focus-within:ring-[#0f5ce0]/10'}`}>
                  <span className="flex items-center gap-2 px-4 text-sm font-semibold text-[#7b8191] bg-[#eef4ff] border-r border-[#e4e9f4] shrink-0">
                    <Globe size={16} className="text-[#0f5ce0]" /> https://
                  </span>
                  <input
                    type="text"
                    value={profile.website ? profile.website.replace(/^https?:\/\//, '') : ''}
                    onChange={(e) => handleChange('website', `https://${e.target.value}`)}
                    className="w-full px-4 py-3 bg-transparent text-sm text-[#111827] focus:outline-none min-w-0 font-medium"
                    placeholder="www.perusahaananda.com"
                  />
                </div>
                {errors.website && <p className="text-xs text-red-500 font-medium mt-1.5">Situs web resmi wajib diisi.</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={labelStyles}>
                  Alamat Kantor Pusat <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={profile.lokasi}
                  onChange={(e) => handleChange('lokasi', e.target.value)}
                  className={`${getInputStyle('lokasi')} resize-y leading-relaxed`}
                  placeholder="Tuliskan alamat lengkap beserta kode pos..."
                />
                {errors.lokasi && <p className="text-xs text-red-500 font-medium mt-1.5">Alamat kantor pusat wajib diisi.</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={labelStyles}>
                  Deskripsi Perusahaan (About Us)
                </label>
                <div className="border border-[#e4e9f4] rounded-xl overflow-hidden bg-white focus-within:border-[#0f5ce0] focus-within:ring-4 focus-within:ring-[#0f5ce0]/10 transition-all duration-200">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f8faff] border-b border-[#e4e9f4]">
                    <button type="button" onMouseDown={(e) => handleFormat(e, 'bold')} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5b6170] hover:bg-white hover:text-[#0f5ce0] hover:shadow-sm transition-all"><Bold size={16} /></button>
                    <button type="button" onMouseDown={(e) => handleFormat(e, 'italic')} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5b6170] hover:bg-white hover:text-[#0f5ce0] hover:shadow-sm transition-all"><Italic size={16} /></button>
                    <button type="button" onMouseDown={(e) => handleFormat(e, 'underline')} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5b6170] hover:bg-white hover:text-[#0f5ce0] hover:shadow-sm transition-all"><Underline size={16} /></button>
                    <button type="button" onMouseDown={(e) => handleFormat(e, 'insertUnorderedList')} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5b6170] hover:bg-white hover:text-[#0f5ce0] hover:shadow-sm transition-all"><List size={16} /></button>
                    <button type="button" onMouseDown={handleLink} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5b6170] hover:bg-white hover:text-[#0f5ce0] hover:shadow-sm transition-all"><Link2 size={16} /></button>
                  </div>
                  
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    className="w-full px-5 py-4 min-h-[160px] text-sm text-[#111827] leading-relaxed text-justify focus:outline-none 
                               [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-3 last:[&>p]:mb-0 [&>a]:text-[#0f5ce0] [&>a]:underline"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#e4e9f4] shadow-sm overflow-hidden">
          <div className="bg-[#f8faff] px-7 py-5 border-b border-[#e4e9f4] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center shrink-0 border border-[#d0e0ff]">
              <ImagePlus size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">Logo Perusahaan</h3>
              <p className="text-xs text-[#7b8191] font-medium mt-0.5">Representasi visual brand usaha Anda.</p>
            </div>
          </div>

          <div className="p-7">
            <label htmlFor="logoUpload" className="group flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#cbd5e1] bg-[#f8faff] rounded-[16px] py-10 px-4 cursor-pointer hover:border-[#0f5ce0] hover:bg-[#eef4ff]/50 transition-all duration-300">
              <input id="logoUpload" type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoChange} className="hidden" />
              
              {logoPreview ? (
                <div className="relative">
                  <img src={logoPreview} alt="Preview logo perusahaan" className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-[#e4e9f4] bg-white p-2" />
                  <div className="absolute -bottom-3 -right-3 bg-white rounded-full p-1.5 shadow-md border border-[#e4e9f4]">
                    <Edit3 size={14} className="text-[#0f5ce0]" />
                  </div>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-[#e4e9f4] text-[#a0a6b5] flex items-center justify-center group-hover:scale-110 group-hover:text-[#0f5ce0] transition-all duration-300">
                  <UploadCloud size={24} />
                </div>
              )}
              
              <div className="text-center mt-2">
                <p className="text-sm font-bold text-[#0f5ce0] group-hover:underline underline-offset-2">Klik untuk Unggah Logo</p>
                <p className="text-xs text-[#7b8191] mt-1.5 font-medium">Format: JPG, PNG, atau SVG. <br className="sm:hidden" />Maksimal ukuran file 2MB.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-[#e4e9f4] text-[#5b6170] hover:text-[#111827] hover:bg-gray-50 hover:border-[#cbd5e1] rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            Batalkan
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3 bg-[#0f5ce0] text-white rounded-xl text-sm font-bold hover:bg-[#0d4ebf] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 shadow-md active:scale-95 active:translate-y-0"
          >
            Simpan Profil
          </button>
        </div>
        
      </form>
    </div>
  )
}

export default Company_UbahProfile