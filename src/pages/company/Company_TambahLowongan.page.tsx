import { useState } from 'react'
import { Info, MapPin, Plus, X, Send, ChevronDown, Save, AlertCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { initialLowongan } from './CompanyData' 

interface Responsibility {
  id: number
  description: string
  skills: string[]
  skillInput: string
}

const Company_TambahLowongan = () => {
  const navigate = useNavigate()
  const routerLocation = useLocation()
  
  const editJob = routerLocation.state?.editJob

  const [jobTitle, setJobTitle] = useState(editJob?.role || '')
  const [department, setDepartment] = useState(() => {
    if (!editJob) return ''
    const standardDepts = ['Technology', 'Marketing', 'Design', 'Human Resources']
    return standardDepts.includes(editJob.department) ? editJob.department : 'Lainnya'
  })
  const [customDepartment, setCustomDepartment] = useState(() => {
    if (!editJob) return ''
    const standardDepts = ['Technology', 'Marketing', 'Design', 'Human Resources']
    return standardDepts.includes(editJob.department) ? '' : editJob.department
  })
  const [jobType, setJobType] = useState(editJob?.type || '')
  const [jobLocation, setJobLocation] = useState(editJob?.location || '')

  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([
    { id: Date.now(), description: '', skills: [], skillInput: '' }
  ])

  // Menampung pesan error jika validasi gagal
  const [errorMessage, setErrorMessage] = useState('')

  const addResponsibility = () => {
    setResponsibilities([
      ...responsibilities, 
      { id: Date.now(), description: '', skills: [], skillInput: '' }
    ])
  }

  const updateDescription = (id: number, value: string) => {
    setResponsibilities(responsibilities.map(resp => 
      resp.id === id ? { ...resp, description: value } : resp
    ))
  }

  const updateSkillInput = (id: number, value: string) => {
    setResponsibilities(responsibilities.map(resp => 
      resp.id === id ? { ...resp, skillInput: value } : resp
    ))
  }

  const handleAddSkill = (id: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setResponsibilities(responsibilities.map(resp => {
        if (resp.id === id && resp.skillInput.trim() !== '') {
          return {
            ...resp,
            skills: [...resp.skills, resp.skillInput.trim()],
            skillInput: ''
          }
        }
        return resp
      }))
    }
  }

  const removeSkill = (respId: number, skillToRemove: string) => {
    setResponsibilities(responsibilities.map(resp => {
      if (resp.id === respId) {
        return {
          ...resp,
          skills: resp.skills.filter(skill => skill !== skillToRemove)
        }
      }
      return resp
    }))
  }

  const saveJobData = (statusToSave: 'Aktif' | 'Draft') => {
    setErrorMessage('') // Reset error

    const finalDepartment = department === 'Lainnya' ? customDepartment : department

    // Validasi form jika HR ingin langsung Tayangkan (Aktif)
    if (statusToSave === 'Aktif') {
      if (!jobTitle.trim() || !finalDepartment.trim() || !jobType || !jobLocation.trim()) {
        setErrorMessage('Harap lengkapi semua Informasi Lowongan dasar sebelum menayangkan.')
        return
      }
      
      const hasValidResponsibility = responsibilities.some(r => r.description.trim() !== '')
      if (!hasValidResponsibility) {
        setErrorMessage('Harap isi setidaknya satu Deskripsi Tanggung Jawab pekerjaan.')
        return
      }
    }

    if (editJob) {
      const index = initialLowongan.findIndex(j => j.id === editJob.id)
      if (index > -1) {
        initialLowongan[index] = {
          ...initialLowongan[index],
          role: jobTitle || 'Posisi Baru',
          department: finalDepartment || 'Belum Ditentukan',
          type: jobType || 'Full-time',
          location: jobLocation || 'Remote',
          status: statusToSave
        }
      }
    } else {
      const newJob = {
        id: initialLowongan.length > 0 ? Math.max(...initialLowongan.map(j => j.id)) + 1 : 1,
        role: jobTitle || 'Posisi Baru',
        department: finalDepartment || 'Belum Ditentukan',
        type: jobType || 'Full-time',
        location: jobLocation || 'Remote',
        date: 'HARI INI', 
        status: statusToSave,
        applicantsCount: 0,
        avgMatch: 0
      }
      initialLowongan.unshift(newJob)
    }

    navigate('/company/kelola-lowongan')
  }

  return (
    <div className="w-full flex flex-col gap-6">
      
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#7b8191] mb-2">
          <button onClick={() => navigate('/company/kelola-lowongan')} className="hover:text-[#111827] transition">Lowongan</button>
          <span>›</span>
          <span className="text-[#0f5ce0]">{editJob ? 'Edit Lowongan' : 'Tambah Lowongan Baru'}</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">{editJob ? 'Lanjutkan Pembuatan Lowongan' : 'Buat Lowongan Baru'}</h1>
        <p className="text-sm text-[#5b6170] mt-1">Isi detail lengkap dan persyaratan kompetensi untuk proses seleksi kandidat</p>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm overflow-hidden">
        
        <div className="bg-[#f8faff] border-b border-[#e4e9f4] px-6 py-4 flex items-center gap-2 text-[#0f5ce0] font-bold">
          <Info size={18} />
          Informasi Lowongan
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold text-[#111827] mb-2">Nama Posisi</label>
            <input 
              type="text" 
              placeholder="Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#111827] mb-2">Departemen</label>
              <div className="relative">
                <select 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled>Pilih departemen...</option>
                  <option value="Technology">Technology</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Design">Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Lainnya">Lainnya...</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#7b8191]">
                  <ChevronDown size={16} />
                </div>
              </div>
              
              {department === 'Lainnya' && (
                <input 
                  type="text" 
                  placeholder="Masukkan nama departemen baru"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  className="w-full mt-3 px-4 py-2.5 bg-white border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition animate-in fade-in slide-in-from-top-2 duration-300"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] mb-2">Jenis Pekerjaan</label>
              <div className="relative">
                <select 
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled>Pilih jenis pekerjaan...</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#7b8191]">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#111827] mb-2">Lokasi</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#7b8191]">
                <MapPin size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Jakarta, Indonesia (Hybrid)"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-bold text-[#111827] mb-4">Detail Persyaratan</h3>
            
            <div className="flex flex-col gap-4">
              {responsibilities.map((resp, index) => (
                <div key={resp.id} className="bg-[#f8faff] border border-[#e4e9f4] rounded-[12px] p-5">
                  <label className="block text-xs font-bold text-[#111827] mb-3">Tanggung Jawab {index + 1}</label>
                  
                  <div className="flex gap-3 mb-4">
                    <span className="text-sm font-bold text-[#0f5ce0] pt-2">{index + 1}.</span>
                    <textarea 
                      placeholder="Deskripsikan tanggung jawab untuk posisi ini..."
                      value={resp.description}
                      onChange={(e) => updateDescription(resp.id, e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#e4e9f4] rounded-xl text-sm text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition min-h-[100px] resize-y"
                    />
                  </div>

                  <div className="pl-6">
                    <label className="block text-[11px] font-semibold text-[#7b8191] mb-2">Keahlian untuk tanggung jawab ini</label>
                    <div className="flex flex-wrap items-center gap-2 p-2 bg-white border border-[#e4e9f4] rounded-xl min-h-[46px]">
                      {resp.skills.map((skill, sIndex) => (
                        <span key={sIndex} className="flex items-center gap-1.5 px-3 py-1 bg-[#0f5ce0] text-white text-[12px] font-medium rounded-full">
                          {skill}
                          <button onClick={() => removeSkill(resp.id, skill)} className="hover:text-gray-200 focus:outline-none transition">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      <input 
                        type="text" 
                        placeholder={resp.skills.length === 0 ? "Tambah keahlian (Tekan Enter)..." : ""}
                        value={resp.skillInput}
                        onChange={(e) => updateSkillInput(resp.id, e.target.value)}
                        onKeyDown={(e) => handleAddSkill(resp.id, e)}
                        className="flex-1 min-w-[150px] bg-transparent text-sm text-[#111827] placeholder-[#a0a6b5] focus:outline-none px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={addResponsibility}
              className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-white border border-[#0f5ce0] text-[#0f5ce0] rounded-xl text-sm font-bold hover:bg-[#f8faff] hover:shadow-sm transition-all duration-200 active:scale-95 self-start"
            >
              <Plus size={16} />
              Tambah Tanggung Jawab Baru
            </button>

          </div>
        </div>
      </div>

      {/* Render Pesan Error Jika Validasi Gagal */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-4 bg-[#fee2e2] text-[#ef4444] rounded-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button 
          onClick={() => saveJobData('Draft')}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-[#e4e9f4] rounded-xl text-sm font-bold text-[#5b6170] hover:text-[#111827] hover:bg-gray-50 hover:border-[#cbd5e1] transition-all duration-200 shadow-sm active:scale-95"
        >
          <Save size={16} />
          Simpan sebagai Draft
        </button>
        <button 
          onClick={() => saveJobData('Aktif')}
          className="flex items-center gap-2 px-6 py-3 bg-[#0f5ce0] border border-transparent rounded-xl text-sm font-bold text-white hover:bg-[#0d4ebf] hover:shadow-lg transition-all duration-200 shadow-md active:scale-95"
        >
          <Send size={16} />
          Tayangkan Lowongan
        </button>
      </div>

    </div>
  )
}

export default Company_TambahLowongan