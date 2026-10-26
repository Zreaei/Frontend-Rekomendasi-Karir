import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Info, AlertCircle, X, ChevronDown, Loader2 } from 'lucide-react'
import { studentApi, importApi } from '../../services/university.service'

type StudentStatus = 'Active' | 'Inactive' | 'Graduated'
const LAINNYA = '__lainnya__'

const EditMahasiswa = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id

  const [isLoading, setIsLoading] = useState(isEditMode)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    year: '',
    faculty: '',
    major: '',
    email: '',
    gpa: '',
    status: 'Active' as StudentStatus,
  })

  // Fakultas & prodi belum punya data master tersendiri, jadi pilihannya
  // diturunkan dari mahasiswa yang sudah ada, dengan opsi isian bebas.
  const [masterMap, setMasterMap] = useState<Record<string, string[]>>({})
  const [customFaculty, setCustomFaculty] = useState(false)
  const [customMajor, setCustomMajor] = useState(false)
  const [errorNotification, setErrorNotification] = useState<string | null>(null)

  useEffect(() => {
    studentApi.facultyMajorMap().then(setMasterMap).catch(() => setMasterMap({}))
  }, [])

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }
    let aktif = true
    setIsLoading(true)

    studentApi
      .getDetail(id)
      .then((data: any) => {
        if (!aktif) return
        const s = data?.student ?? {}
        setFormData({
          name: s?.user?.name ?? '',
          nim: s.nim ?? '',
          year: s.entryYear ? String(s.entryYear) : '',
          faculty: s.faculty ?? '',
          major: s.major ?? '',
          email: s?.user?.email ?? '',
          gpa: s.gpa !== null && s.gpa !== undefined ? Number(s.gpa).toFixed(2) : '',
          status: s.graduatedAt ? 'Graduated' : s?.user?.status === 'suspended' ? 'Inactive' : 'Active',
        })
      })
      .catch(() => {
        if (!aktif) return
        setNotFound(true)
      })
      .finally(() => {
        if (aktif) setIsLoading(false)
      })

    return () => { aktif = false }
  }, [id])

  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 8 }, (_, i) => (currentYear - i).toString())
    if (formData.year && !years.includes(formData.year)) {
      years.push(formData.year)
      years.sort().reverse()
    }
    return years
  }, [formData.year])

  const availableFaculties = Object.keys(masterMap)
  const availableMajors = useMemo(() => {
    if (formData.faculty && masterMap[formData.faculty]) return masterMap[formData.faculty]
    return []
  }, [formData.faculty, masterMap])

  // Fakultas/prodi hasil isian bebas otomatis masuk mode teks agar tetap tampil.
  useEffect(() => {
    if (formData.faculty && availableFaculties.length > 0 && !availableFaculties.includes(formData.faculty)) {
      setCustomFaculty(true)
    }
  }, [formData.faculty, availableFaculties])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'gpa') {
      if (value !== '' && !/^([0-3](\.\d{0,2})?|4(\.0{0,2})?)$/.test(value)) return
    }

    setFormData(prev => {
      if (name === 'faculty') return { ...prev, faculty: value, major: '' }
      return { ...prev, [name]: value }
    })

    if (errorNotification) setErrorNotification(null)
  }

  const handleFacultySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === LAINNYA) {
      setCustomFaculty(true)
      setFormData(prev => ({ ...prev, faculty: '', major: '' }))
      setCustomMajor(true)
      return
    }
    setCustomFaculty(false)
    setCustomMajor(false)
    setFormData(prev => ({ ...prev, faculty: e.target.value, major: '' }))
  }

  const handleMajorSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === LAINNYA) {
      setCustomMajor(true)
      setFormData(prev => ({ ...prev, major: '' }))
      return
    }
    setFormData(prev => ({ ...prev, major: e.target.value }))
  }

  const showError = (msg: string) => {
    setErrorNotification(msg)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSave = async () => {
    if (!formData.name || !formData.nim || !formData.year || !formData.faculty || !formData.major || !formData.email || !formData.gpa) {
      showError('Pastikan semua data mahasiswa telah terisi lengkap sebelum menyimpan.')
      return
    }
    if (!/^([0-3]\.\d{2}|4\.00)$/.test(formData.gpa)) {
      showError('Format IPK tidak valid! Skala IPK maksimal 4.00 dengan dua desimal (Contoh: 3.85 atau 4.00).')
      return
    }

    setSaving(true)
    try {
      if (isEditMode) {
        await studentApi.update(id!, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          nim: formData.nim.trim(),
          major: formData.major.trim(),
          faculty: formData.faculty.trim(),
          entryYear: Number(formData.year),
          gpa: Number(formData.gpa),
          status: formData.status,
        })
      } else {
        // Mahasiswa baru dibuat lewat jalur impor; kata sandi awal = NIM.
        await importApi.addOne({
          name: formData.name.trim(),
          email: formData.email.trim(),
          nim: formData.nim.trim(),
          major: formData.major.trim(),
          faculty: formData.faculty.trim(),
          entryYear: Number(formData.year),
          gpa: Number(formData.gpa),
        } as any)
      }

      navigate('/university/manajemen-mahasiswa', {
        state: { successMessage: isEditMode ? 'Data mahasiswa berhasil diperbarui!' : 'Mahasiswa baru berhasil ditambahkan!' },
      })
    } catch (err: any) {
      showError(err?.response?.data?.message ?? 'Gagal menyimpan data mahasiswa.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-[#5b6170]">
        <Loader2 size={28} className="animate-spin text-[#0f5ce0]" />
        <p className="text-sm font-medium">Memuat data mahasiswa...</p>
      </div>
    )
  }

  if (isEditMode && notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-[#7b8191]">Data mahasiswa tidak ditemukan.</p>
        <button onClick={() => navigate('/university/manajemen-mahasiswa')} className="px-4 py-2 bg-[#0f5ce0] text-white rounded-xl text-sm font-bold">Kembali</button>
      </div>
    )
  }

  const inputClass = (invalid: boolean) =>
    `w-full px-4 py-3 bg-[#f8faff] border rounded-xl text-sm text-[#111827] focus:outline-none transition ${
      invalid ? 'border-red-400 focus:border-red-500 bg-red-50/30' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'
    }`

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative">
      
      {errorNotification && (
        <div className="absolute top-0 right-0 z-[100] flex items-start gap-4 p-4 bg-white border border-red-500/30 border-l-4 border-l-red-500 rounded-xl shadow-[0_10px_40px_-10px_rgba(239,68,68,0.15)] w-full max-w-[420px] transform transition-all animate-in slide-in-from-top-4 fade-in duration-300 ease-out overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertCircle size={22} className="text-red-500" />
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="text-[14px] font-bold text-[#111827]">Gagal Menyimpan</h3>
            <p className="text-[13px] text-[#5b6170] mt-1 leading-relaxed">{errorNotification}</p>
          </div>
          <button onClick={() => setErrorNotification(null)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1 shrink-0">
            <X size={18} />
          </button>
        </div>
      )}

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

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm p-6 sm:p-8 flex flex-col gap-8">
        
        {/* ROW 1: Nama & NIM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="Masukkan nama lengkap mahasiswa" autoComplete="off"
              className={inputClass(!!errorNotification && !formData.name)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              NIM (Nomor Induk Mahasiswa) <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" name="nim" value={formData.nim} onChange={handleChange}
              placeholder="Contoh: 2021008234" autoComplete="off"
              className={inputClass(!!errorNotification && !formData.nim)}
            />
          </div>
        </div>

        {/* ROW 2: Angkatan, Fakultas, Prodi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#f1f4f9] pt-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              Tahun Angkatan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select 
                name="year" value={formData.year} onChange={handleChange}
                className={`${inputClass(!!errorNotification && !formData.year)} pr-10 appearance-none cursor-pointer`}
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
            {customFaculty || availableFaculties.length === 0 ? (
              <input
                type="text" name="faculty" value={formData.faculty} onChange={handleChange}
                placeholder="Ketik nama fakultas" autoComplete="off"
                className={inputClass(!!errorNotification && !formData.faculty)}
              />
            ) : (
              <div className="relative">
                <select 
                  value={formData.faculty} onChange={handleFacultySelect}
                  className={`${inputClass(!!errorNotification && !formData.faculty)} pr-10 appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Pilih Fakultas</option>
                  {availableFaculties.map(f => <option key={f} value={f}>{f}</option>)}
                  <option value={LAINNYA}>Lainnya...</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              Program Studi <span className="text-red-500">*</span>
            </label>
            {customMajor || availableMajors.length === 0 ? (
              <input
                type="text" name="major" value={formData.major} onChange={handleChange}
                placeholder="Ketik nama program studi" autoComplete="off"
                className={inputClass(!!errorNotification && !formData.major)}
              />
            ) : (
              <div className="relative">
                <select 
                  value={formData.major} onChange={handleMajorSelect}
                  className={`${inputClass(!!errorNotification && !formData.major)} pr-10 appearance-none cursor-pointer`}
                >
                  <option value="" disabled>Pilih Program Studi</option>
                  {availableMajors.map(m => <option key={m} value={m}>{m}</option>)}
                  <option value={LAINNYA}>Lainnya...</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* ROW 3: Email & IPK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#f1f4f9] pt-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              Email Institusi <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="email@univ.ac.id" autoComplete="off"
              className={inputClass(!!errorNotification && !formData.email)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#111827]">
              IPK (Indeks Prestasi Kumulatif) <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" name="gpa" value={formData.gpa} onChange={handleChange}
              placeholder="Contoh: 3.85" autoComplete="off"
              className={inputClass(!!errorNotification && (!formData.gpa || !/^([0-3]\.\d{2}|4\.00)$/.test(formData.gpa)))}
            />
          </div>
        </div>

        {/* Status Mahasiswa - hanya saat mengedit */}
        {isEditMode && (
          <div className="flex items-center justify-between p-5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl mt-2 gap-4">
            <div>
              <p className="text-sm font-bold text-[#111827]">Status Mahasiswa</p>
              <p className="text-xs text-[#7b8191] mt-0.5">
                {formData.status === 'Graduated'
                  ? 'Berstatus Lulus. Akun alumni tetap dapat masuk agar pemulihan kata sandi masih memungkinkan.'
                  : 'Nonaktifkan untuk menutup akses portal, atau ubah ke Lulus jika mahasiswa telah menyelesaikan studi.'}
              </p>
            </div>
            <div className="relative shrink-0">
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as StudentStatus }))}
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
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f1f4f9]">
          <button 
            onClick={() => navigate('/university/manajemen-mahasiswa')}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-bold text-[#5b6170] bg-white border border-[#e4e9f4] rounded-xl hover:bg-gray-50 transition active:scale-95 disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#0f5ce0] rounded-xl hover:bg-[#0d4ebf] shadow-sm transition active:scale-95 disabled:opacity-60"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {isEditMode ? 'Simpan Perubahan' : 'Tambah Mahasiswa'}
          </button>
        </div>
      </div>

      <div className="bg-[#eef4ff] rounded-[16px] border border-[#d0e0ff] p-5 flex items-start gap-4">
        <div className="text-[#0f5ce0] shrink-0 mt-0.5">
          <Info size={20} />
        </div>
        <p className="text-sm text-[#5b6170] leading-relaxed">
          {isEditMode
            ? 'Pastikan informasi yang dimasukkan sesuai dokumen resmi universitas untuk menjaga integritas data akademik.'
            : 'Kata sandi awal mahasiswa baru adalah NIM-nya. Sampaikan kepada mahasiswa untuk segera menggantinya setelah masuk pertama kali.'}
        </p>
      </div>
    </div>
  )
}

export default EditMahasiswa