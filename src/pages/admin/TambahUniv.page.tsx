import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Building2, User, Eye, EyeOff } from 'lucide-react'
import { adminUniversityApi } from '../../services/admin.service'
import Toast from './components/Toast'

const AdminTambahUniv = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'warning'} | null>(null)

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    website: '',
    adminName: '',
    nip: '',
    email: '',
    phone: '',
    password: ''
  })

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({})

  const showNotification = (msg: string, type: 'success' | 'warning') => {
    setNotification({ message: msg, type })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (type === 'warning') {
      setTimeout(() => setNotification(null), 4000)
    }
  }

  const handleSimpanData = async (e: React.FormEvent) => {
    e.preventDefault()
    let newErrors: Record<string, string> = {}

    // Validasi Kosong
    if (!formData.name.trim()) newErrors.name = 'Nama Universitas wajib diisi.'
    if (!formData.location.trim()) newErrors.location = 'Kota / Kabupaten wajib diisi.'
    if (!formData.address.trim()) newErrors.address = 'Alamat lengkap wajib diisi.'
    if (!formData.website.trim()) newErrors.website = 'Website wajib diisi.'
    if (!formData.adminName.trim()) newErrors.adminName = 'Nama admin wajib diisi.'
    if (!formData.nip.trim()) newErrors.nip = 'NIP / ID Pegawai wajib diisi.'
    if (!formData.phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi.'

    // Validasi Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email institusi wajib diisi.'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid (harus mengandung @ dan domain).'
    }

    // Validasi Password (Minimal 8, ada huruf dan angka)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!formData.password.trim()) {
      newErrors.password = 'Password admin wajib diisi.'
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password minimal 8 karakter dan harus kombinasi huruf & angka.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      showNotification('Mohon perbaiki isian form yang ditandai merah.', 'warning')
      return
    }

    // Validasi lulus -> kirim ke backend (buat universitas + akun Admin Kampus)
    setIsSubmitting(true)
    try {
      await adminUniversityApi.create({
        name: formData.name,
        city: formData.location,
        address: formData.address,
        website: formData.website,
        admin: {
          name: formData.adminName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          nip: formData.nip,
        },
      })

      showNotification('Universitas berhasil didaftarkan!', 'success')

      // Tunggu 2 detik agar user lihat notifikasi, lalu kembali ke daftar
      setTimeout(() => {
        navigate('/admin/kelola-universitas')
      }, 2000)
    } catch (err: any) {
      setIsSubmitting(false)
      const apiMsg = err?.response?.data?.message
      showNotification(apiMsg || 'Gagal mendaftarkan universitas. Coba lagi.', 'warning')
    }
  }

  return (
    <div className="w-full pb-12 animate-in fade-in duration-300">
      
      <Toast notification={notification} onClose={() => setNotification(null)} />

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[13px] font-bold text-[#5b6170] mb-5">
        <Link to="/admin/kelola-universitas" className="hover:text-[#0f5ce0] transition-colors flex items-center gap-1">Kelola Admin Universitas</Link>
        <ChevronRight size={16} strokeWidth={2.5} className="text-[#a0a6b5]" />
        <span className="text-[#111827]">Tambah Universitas</span>
      </div>

      <div className="mb-8">
        <h1 className="text-[24px] font-bold text-[#111827]">Tambah Universitas Baru</h1>
        <p className="text-[14px] text-[#7b8191] mt-1.5">
          Lengkapi formulir di bawah ini untuk mendaftarkan institusi pendidikan baru ke dalam ekosistem CareerSync dan menetapkan administrator utama.
        </p>
      </div>

      {/* Di formnya e.preventDefault() ditaruh di handleSimpanData, onSubmit diilangin dari form element biar trigger via button custom */}
      <form className="flex flex-col gap-6" noValidate>
        
        {/* INFORMASI UNIVERSITAS CARD */}
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm overflow-hidden">
          <div className="bg-[#f8faff] px-6 py-4 border-b border-[#e4e9f4] flex items-center gap-3">
            <Building2 size={20} className="text-[#0f5ce0]" strokeWidth={2.5} />
            <h3 className="text-[16px] font-bold text-[#111827]">Informasi Universitas</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-2">Nama Universitas <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => {setFormData({...formData, name: e.target.value}); setErrors({...errors, name: ''})}}
                  placeholder="Contoh: Universitas Indonesia" 
                  className={`w-full h-11 px-4 bg-[#f8faff] border ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'} rounded-lg text-[13px] font-medium text-[#111827] outline-none transition shadow-sm placeholder:text-[#a0a6b5]`} 
                />
                {errors.name && <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-2">Kota / Kabupaten Domisili <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={e => {setFormData({...formData, location: e.target.value}); setErrors({...errors, location: ''})}}
                  placeholder="Ketik kota atau kabupaten asal..." 
                  className={`w-full h-11 px-4 bg-[#f8faff] border ${errors.location ? 'border-red-400 focus:border-red-400' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'} rounded-lg text-[13px] font-medium text-[#111827] outline-none transition shadow-sm placeholder:text-[#a0a6b5]`} 
                />
                {errors.location && <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errors.location}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-2">Alamat Lengkap <span className="text-red-500">*</span></label>
              <textarea 
                value={formData.address}
                onChange={e => {setFormData({...formData, address: e.target.value}); setErrors({...errors, address: ''})}}
                placeholder="Masukkan alamat lengkap kampus pusat..." 
                className={`w-full h-24 p-4 bg-[#f8faff] border ${errors.address ? 'border-red-400 focus:border-red-400' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'} rounded-lg text-[13px] font-medium text-[#111827] outline-none transition shadow-sm resize-none placeholder:text-[#a0a6b5]`} 
              ></textarea>
              {errors.address && <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-2">Website Resmi <span className="text-red-500">*</span></label>
              <div className={`flex border ${errors.website ? 'border-red-400' : 'border-[#e4e9f4] focus-within:border-[#0f5ce0]'} rounded-lg overflow-hidden shadow-sm transition`}>
                <span className={`flex items-center px-4 bg-[#f8faff] border-r ${errors.website ? 'border-red-400' : 'border-[#e4e9f4]'} text-[13px] font-bold text-[#7b8191]`}>https://</span>
                <input 
                  type="text" 
                  value={formData.website}
                  onChange={e => {setFormData({...formData, website: e.target.value}); setErrors({...errors, website: ''})}}
                  placeholder="www.universitas.ac.id" 
                  className="w-full h-11 px-4 bg-[#f8faff] text-[13px] font-medium text-[#111827] outline-none placeholder:text-[#a0a6b5]" 
                />
              </div>
              {errors.website && <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errors.website}</p>}
            </div>
          </div>
        </div>

        {/* DATA ADMIN UTAMA CARD */}
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm overflow-hidden">
          <div className="bg-[#f8faff] px-6 py-4 border-b border-[#e4e9f4] flex items-center gap-3">
            <User size={20} className="text-[#0f5ce0]" strokeWidth={2.5} />
            <h3 className="text-[16px] font-bold text-[#111827]">Data Admin Utama</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-2">Nama Lengkap Admin <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.adminName}
                  onChange={e => {setFormData({...formData, adminName: e.target.value}); setErrors({...errors, adminName: ''})}}
                  placeholder="Masukkan nama lengkap beserta gelar" 
                  className={`w-full h-11 px-4 bg-[#f8faff] border ${errors.adminName ? 'border-red-400 focus:border-red-400' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'} rounded-lg text-[13px] font-medium text-[#111827] outline-none transition shadow-sm placeholder:text-[#a0a6b5]`} 
                />
                {errors.adminName && <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errors.adminName}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-2">NIP / ID Pegawai <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.nip}
                  onChange={e => {setFormData({...formData, nip: e.target.value}); setErrors({...errors, nip: ''})}}
                  placeholder="Contoh: 198501012010121001" 
                  className={`w-full h-11 px-4 bg-[#f8faff] border ${errors.nip ? 'border-red-400 focus:border-red-400' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'} rounded-lg text-[13px] font-medium text-[#111827] outline-none transition shadow-sm placeholder:text-[#a0a6b5]`} 
                />
                {errors.nip && <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errors.nip}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-2">Email Institusi <span className="text-red-500">*</span></label>
                <input 
                  type="text" // Diubah ke text biar bypass html validasi, di handle via regex
                  value={formData.email}
                  onChange={e => {setFormData({...formData, email: e.target.value}); setErrors({...errors, email: ''})}}
                  placeholder="admin@univ.ac.id" 
                  className={`w-full h-11 px-4 bg-[#f8faff] border ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'} rounded-lg text-[13px] font-medium text-[#111827] outline-none transition shadow-sm placeholder:text-[#a0a6b5]`} 
                />
                {errors.email && <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-2">Nomor Telepon <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => {setFormData({...formData, phone: e.target.value}); setErrors({...errors, phone: ''})}}
                  placeholder="+62 8xx xxxx xxxx" 
                  className={`w-full h-11 px-4 bg-[#f8faff] border ${errors.phone ? 'border-red-400 focus:border-red-400' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'} rounded-lg text-[13px] font-medium text-[#111827] outline-none transition shadow-sm placeholder:text-[#a0a6b5]`} 
                />
                {errors.phone && <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errors.phone}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-2">Password Admin <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={e => {setFormData({...formData, password: e.target.value}); setErrors({...errors, password: ''})}}
                  placeholder="••••••••" 
                  className={`w-full h-11 pl-4 pr-12 bg-[#f8faff] border ${errors.password ? 'border-red-400 focus:border-red-400' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'} rounded-lg text-[14px] font-black tracking-widest text-[#111827] outline-none transition shadow-sm placeholder:text-[#a0a6b5] placeholder:tracking-normal placeholder:font-medium`} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a6b5] hover:text-[#5b6170] transition-colors"
                >
                  {showPassword ? <Eye size={18} strokeWidth={2.5} /> : <EyeOff size={18} strokeWidth={2.5} />}
                </button>
              </div>
              {errors.password 
                ? <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errors.password}</p>
                : <p className="text-[11px] font-medium text-[#7b8191] mt-2">Password minimal 8 karakter dengan kombinasi huruf dan angka.</p>
              }
            </div>
          </div>
        </div>

        {/* BUTTON ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button 
            type="button"
            onClick={() => navigate('/admin/kelola-universitas')}
            className="px-8 py-3 bg-white border border-[#e4e9f4] text-[#5b6170] text-[13px] font-bold rounded-lg hover:bg-[#f8faff] transition shadow-sm"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSimpanData}
            className="px-8 py-3 bg-[#052960] text-white text-[13px] font-bold rounded-lg hover:bg-[#031635] disabled:opacity-60 transition shadow-sm flex items-center gap-2"
          >
            <User size={16} strokeWidth={2.5} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
          </button>
        </div>

      </form>
    </div>
  )
}

export default AdminTambahUniv