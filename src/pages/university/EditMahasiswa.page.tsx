import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Info, AlertCircle, X, ChevronDown } from 'lucide-react'
import { UniversityService, type Student } from './UniversityData'

const EditMahasiswa = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [studentData, setStudentData] = useState<Student | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(!!id)

  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    year: '',
    faculty: '',
    major: '',
    email: '',
    gpa: '', 
    status: 'Active' as Student['status']
  })

  const [masterMap, setMasterMap] = useState<Record<string, string[]>>({})
  const [errorNotification, setErrorNotification] = useState<string | null>(null)

  useEffect(() => {
    UniversityService.getFacultyMajorMap().then(data => {
      setMasterMap(data)
    })
  }, [])

  useEffect(() => {
    if (!id) {
      setStudentData(undefined)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    UniversityService.getStudentDetail(id).then(data => {
      setStudentData(data)
      setIsLoading(false)
      if (!data) {
        setErrorNotification("Data mahasiswa tidak ditemukan atau sudah dihapus.")
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }, [id])

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 8 }, (_, i) => (currentYear - i).toString())
    if (studentData?.year && !years.includes(studentData.year)) {
      years.push(studentData.year)
      years.sort().reverse() 
    }
    return years
  }, [studentData])

  const availableFaculties = Object.keys(masterMap)
  const availableMajors = useMemo(() => {
    if (formData.faculty && masterMap[formData.faculty]) {
      return masterMap[formData.faculty]
    }
    return [] 
  }, [formData.faculty, masterMap])

  useEffect(() => {
    if (studentData) {
      setFormData({
        name: studentData.name,
        nim: studentData.nim,
        year: studentData.year,
        faculty: studentData.faculty,
        major: studentData.major,
        email: studentData.email,
        gpa: studentData.gpa,
        status: studentData.status
      })
    }
  }, [studentData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'gpa') {
      if (value !== '' && !/^([0-3](\.\d{0,2})?|4(\.0{0,2})?)$/.test(value)) return;
    }

    setFormData(prev => {
      if (name === 'faculty') {
        return { ...prev, [name]: value, major: '' }
      }
      return { ...prev, [name]: value }
    })
    
    if (errorNotification) setErrorNotification(null)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, status: e.target.value as Student['status'] }))
  }

  const handleSave = async () => {
    if (!formData.name || !formData.nim || !formData.year || !formData.faculty || !formData.major || !formData.email || !formData.gpa) {
      setErrorNotification("Pastikan semua data mahasiswa telah terisi lengkap sebelum menyimpan.")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setErrorNotification(null), 4000)
      return
    }

    if (!/^([0-3]\.\d{2}|4\.00)$/.test(formData.gpa)) {
      setErrorNotification("Format IPK tidak valid! Skala IPK maksimal 4.00 dengan dua desimal (Contoh: 3.85 atau 4.00).")
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setErrorNotification(null), 4000)
      return
    }

    const initials = formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'
    
    const newStudentData: Student = {
      id: studentData?.id || Date.now().toString(),
      name: formData.name,
      nim: formData.nim,
      year: formData.year,
      faculty: formData.faculty,
      major: formData.major,
      email: formData.email,
      status: formData.status,
      initial: initials,
      gpa: formData.gpa,
      bgColor: studentData?.bgColor || 'bg-[#0f5ce0] text-white',
      avatarUrl: studentData?.avatarUrl,
      totalSks: studentData?.totalSks ?? 0,
    }

    await UniversityService.saveStudent(newStudentData)
    
    navigate('/university/manajemen-mahasiswa', { 
      state: { successMessage: isEditMode ? 'Data mahasiswa berhasil diperbarui!' : 'Mahasiswa baru berhasil ditambahkan!' }
    })
  }

  const isEditMode = !!id

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#7b8191]">Memuat data mahasiswa...</p>
      </div>
    )
  }

  if (isEditMode && !studentData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-[#7b8191]">Data mahasiswa tidak ditemukan.</p>
        <button onClick={() => navigate('/university/manajemen-mahasiswa')} className="px-4 py-2 bg-[#0f5ce0] text-white rounded-xl text-sm font-bold">Kembali</button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative">
      
      {/* Premium Error Toast Notification */}
      {errorNotification && (
        <div className="absolute top-0 right-0 z-[100] flex items-start gap-4 p-4 bg-white border border-red-500/30 border-l-4 border-l-red-500 rounded-xl shadow-[0_10px_40px_-10px_rgba(239,68,68,0.15)] w-full max-w-[420px] transform transition-all animate-in slide-in-from-top-4 fade-in duration-300 ease-out overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertCircle size={22} className="text-red-500" />
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="text-[14px] font-bold text-[#111827]">Validasi Gagal</h3>
            <p className="text-[13px] text-[#5b6170] mt-1 leading-relaxed">{errorNotification}</p>
          </div>
          <button onClick={() => setErrorNotification(null)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1 shrink-0">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-[#7b8191] font-medium mb-2">
          <button onClick={() => navigate('/university/manajemen-mahasiswa')} className="hover:text-[#0f5ce0] transition">
            Manajemen Mahasiswa
          </button>
          <ChevronRight size={16} />
          <span className="text-[#0f5ce0]">{isEditMode ? 'Edit Mahasiswa' : 'Tambah Mahasiswa'}</span>
        </div>
        <h1 className="text-[26px] font-bold text-[#111827]">
          {isEditMode ? 'Edit Data Mahasiswa' : 'Tambah Data Mahasiswa'}
        </h1>
        <p className="text-sm text-[#5b6170] mt-1">
          {isEditMode ? 'Perbarui informasi profil dan status akademik mahasiswa.' : 'Masukkan informasi profil mahasiswa baru ke dalam sistem otomatis.'}
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm p-6 sm:p-8 flex flex-col gap-8">
        
        {/* ROW 1: Nama & NIM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap mahasiswa"
              autoComplete="off"
              className={`w-full px-4 py-3 bg-[#f8faff] border rounded-xl text-sm text-[#111827] focus:outline-none transition ${
                errorNotification && !formData.name ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              NIM (Nomor Induk Mahasiswa) <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              placeholder="Contoh: 2021008234"
              autoComplete="off"
              className={`w-full px-4 py-3 bg-[#f8faff] border rounded-xl text-sm text-[#111827] focus:outline-none transition ${
                errorNotification && !formData.nim ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'
              }`}
            />
          </div>
        </div>

        {/* ROW 2: Dropdown Angkatan, Fakultas, Prodi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#f1f4f9] pt-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              Tahun Angkatan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-10 bg-[#f8faff] border rounded-xl text-sm text-[#111827] focus:outline-none transition appearance-none cursor-pointer ${
                  errorNotification && !formData.year ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'
                }`}
              >
                <option value="" disabled>Pilih Tahun Angkatan</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              Fakultas <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-10 bg-[#f8faff] border rounded-xl text-sm text-[#111827] focus:outline-none transition appearance-none cursor-pointer ${
                  errorNotification && !formData.faculty ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'
                }`}
              >
                <option value="" disabled>Pilih Fakultas</option>
                {availableFaculties.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              Program Studi <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                name="major"
                value={formData.major}
                onChange={handleChange}
                disabled={!formData.faculty}
                className={`w-full px-4 py-3 pr-10 bg-[#f8faff] border rounded-xl text-sm text-[#111827] focus:outline-none transition appearance-none ${
                  !formData.faculty ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                } ${
                  errorNotification && !formData.major ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'
                }`}
              >
                <option value="" disabled>
                  {formData.faculty ? 'Pilih Program Studi' : 'Pilih Fakultas Terlebih Dahulu'}
                </option>
                {availableMajors.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>
          </div>

        </div>

        {/* ROW 3: Email Institusi & IPK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#f1f4f9] pt-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              Email Institusi <span className="text-red-500">*</span>
            </label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@univ.ac.id"
              autoComplete="off"
              className={`w-full px-4 py-3 bg-[#f8faff] border rounded-xl text-sm text-[#111827] focus:outline-none transition ${
                errorNotification && !formData.email ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              IPK (Indeks Prestasi Kumulatif) <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              placeholder="Contoh: 3.85"
              autoComplete="off"
              className={`w-full px-4 py-3 bg-[#f8faff] border rounded-xl text-sm text-[#111827] focus:outline-none transition ${
                errorNotification && (!formData.gpa || !/^([0-3]\.\d{2}|4\.00)$/.test(formData.gpa)) ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'
              }`}
            />
          </div>
        </div>

        {/* Status Mahasiswa */}
        <div className="flex items-center justify-between p-5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl mt-2 gap-4">
          <div>
            <p className="text-sm font-bold text-[#111827]">Status Mahasiswa</p>
            <p className="text-xs text-[#7b8191] mt-0.5">
              {formData.status === 'Graduated'
                ? 'Mahasiswa berstatus Lulus. Ubah status di sini jika terjadi kesalahan input.'
                : 'Nonaktifkan untuk membatasi akses portal, atau ubah ke Lulus jika mahasiswa telah menyelesaikan studi.'}
            </p>
          </div>
          <div className="relative shrink-0">
            <select
              value={formData.status}
              onChange={handleStatusChange}
              className={`px-4 py-2.5 pr-10 border rounded-xl text-sm font-bold focus:outline-none transition appearance-none cursor-pointer ${
                formData.status === 'Active' ? 'border-[#0f5ce0] text-[#0f5ce0] bg-white' :
                formData.status === 'Graduated' ? 'border-[#6366f1] text-[#6366f1] bg-white' :
                'border-[#e4e9f4] text-[#7b8191] bg-white'
              }`}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated (Lulus)</option>
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f1f4f9]">
          <button 
            onClick={() => navigate('/university/manajemen-mahasiswa')}
            className="px-6 py-2.5 text-sm font-bold text-[#5b6170] bg-white border border-[#e4e9f4] rounded-xl hover:bg-gray-50 transition active:scale-95"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#0f5ce0] rounded-xl hover:bg-[#0d4ebf] shadow-sm transition active:scale-95"
          >
            Simpan Perubahan
          </button>
        </div>

      </div>

      {/* Banner Info */}
      <div className="bg-[#eef4ff] rounded-[16px] border border-[#d0e0ff] p-5 flex items-start gap-4">
        <div className="text-[#0f5ce0] shrink-0 mt-0.5">
          <Info size={20} />
        </div>
        <p className="text-sm text-[#5b6170] leading-relaxed">
          Perubahan data mahasiswa akan tercatat dalam sistem audit log. Pastikan informasi yang dimasukkan sudah sesuai dengan dokumen resmi universitas untuk menjaga integritas data akademik.
        </p>
      </div>

    </div>
  )
}

export default EditMahasiswa