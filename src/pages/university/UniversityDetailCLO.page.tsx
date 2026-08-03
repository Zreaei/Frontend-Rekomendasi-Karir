import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Plus, Edit2, Trash2, BookOpen, CheckCircle2, X, AlertTriangle, FileText, LayoutGrid } from 'lucide-react'
import { UniversityService, type Subject, type SubjectCLO } from './UniversityData'

const UniversityDetailCLO = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const subjectData: Subject | undefined = location.state?.subjectData

  const [clos, setClos] = useState<SubjectCLO[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [notification, setNotification] = useState<string | null>(null)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const [isFormMode, setIsFormMode] = useState(false)
  const [currentSkillInput, setCurrentSkillInput] = useState('')
  const [formData, setFormData] = useState<SubjectCLO>({
    id: '', subjectId: subjectData?.id || '', code: '', description: '', skills: []
  })

  useEffect(() => {
    if (!subjectData) {
      navigate('/university/manajemen-clo')
    } else {
      loadData()
    }
  }, [subjectData, navigate])

  const loadData = async () => {
    if (subjectData) {
      const data = await UniversityService.getCLOsBySubject(subjectData.id)
      setClos(data)
    }
  }

  const filteredClos = clos.filter(clo => 
    clo.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    clo.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenAdd = () => {
    setFormData({ id: '', subjectId: subjectData!.id, code: `CLO ${clos.length + 1}`, description: '', skills: [] })
    setIsFormMode(true)
    setCurrentSkillInput('')
  }

  const handleOpenEdit = (clo: SubjectCLO) => {
    setFormData({ ...clo })
    setIsFormMode(true)
    setCurrentSkillInput('')
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      await UniversityService.deleteCLO(itemToDelete)
      await loadData()
      setItemToDelete(null)
      showNotification("Data CLO berhasil dihapus.")
    }
  }

  const handleSave = async () => {
    if (!formData.code || !formData.description) return
    
    const newClo: SubjectCLO = { ...formData, id: formData.id || Date.now().toString() }
    await UniversityService.saveCLO(newClo)
    await loadData()
    setIsFormMode(false)
    showNotification("Data CLO berhasil disimpan.")
  }

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = currentSkillInput.trim()
      if (trimmed && !formData.skills.includes(trimmed)) {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }))
      }
      setCurrentSkillInput('')
    }
  }

  const removeSkill = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, index) => index !== indexToRemove)
    }))
  }

  if (!subjectData) return null

  // =========================================================================
  //  FORM TAMBAH / EDIT CLO
  if (isFormMode) {
    const formTitle = formData.id ? "Edit Course Learning Outcome (CLO)" : "Tambah Course Learning Outcome (CLO)"

    return (
      <div className="w-full flex flex-col gap-6 animate-in slide-in-from-right-8 fade-in duration-300 pb-12 relative max-w-[1000px] mx-auto">
        <button onClick={() => setIsFormMode(false)} className="flex items-center gap-2 text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition w-fit">
          <ArrowLeft size={16} strokeWidth={2.5} /> Kembali ke Daftar CLO
        </button>

        <div className="flex flex-col">
          <h1 className="text-[24px] font-bold text-[#111827]">{formTitle}</h1>
          <div className="flex items-center gap-2 mt-2 text-[13px] text-[#5b6170]">
            <FileText size={16} className="text-[#0f5ce0]" />
            Mata Kuliah: <span className="font-semibold text-[#0f5ce0]">{subjectData.name} ({subjectData.code})</span>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm p-8 flex flex-col gap-6 border-t-[4px] border-t-[#0f5ce0]">
          
          <div className="flex flex-col gap-2 w-full max-w-[300px]">
            <label className="text-[13px] font-bold text-[#111827]">Kode CLO</label>
            <div className="relative">
              <input 
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="CLO 1"
                className="w-full px-4 py-3 bg-white border border-[#e4e9f4] rounded-xl text-[14px] font-semibold text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm"
              />
            </div>
            <p className="text-[11px] text-[#7b8191]">Gunakan kode unik untuk setiap learning outcome.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#111827]">Deskripsi CLO</label>
            <div className="relative">
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Masukkan deskripsi detail mengenai learning outcome yang diharapkan..."
                rows={5}
                className="w-full px-4 py-4 bg-white border border-[#e4e9f4] rounded-xl text-[14px] text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition resize-none leading-relaxed shadow-sm"
              />
              <span className="absolute bottom-4 right-4 text-[11px] font-medium text-[#a0a6b5]">
                {formData.description.length}/500
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-bold text-[#111827]">Skill yang Didapat</label>
            <div className="w-full min-h-[52px] p-2 bg-[#f8faff] border border-[#e4e9f4] rounded-xl flex flex-wrap items-center gap-2 transition focus-within:border-[#0f5ce0] shadow-sm">
              {formData.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f5ce0] text-white text-[12px] font-bold rounded-lg animate-in zoom-in-95 duration-200">
                  {skill}
                  <button onClick={() => removeSkill(idx)} className="hover:text-red-300 transition mt-0.5">
                    <X size={14} strokeWidth={3} />
                  </button>
                </div>
              ))}
              <input 
                type="text"
                value={currentSkillInput}
                onChange={(e) => setCurrentSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder={formData.skills.length === 0 ? "Ketik skill dan tekan Enter..." : "Ketik skill lain..."}
                className="flex-1 min-w-[200px] bg-transparent text-[13px] text-[#111827] focus:outline-none px-2 py-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#f1f4f9] mt-4">
            <button onClick={() => setIsFormMode(false)} className="px-8 py-3 text-[13px] font-bold text-[#5b6170] bg-white border border-[#e4e9f4] hover:bg-[#f8faff] rounded-xl transition-colors active:scale-95 shadow-sm">
              Batal
            </button>
            <button onClick={handleSave} disabled={!formData.code || !formData.description} className="px-8 py-3 text-[13px] font-bold text-white bg-[#0f5ce0] hover:bg-[#0d4ebf] disabled:bg-gray-300 shadow-sm rounded-xl transition-all active:scale-95">
              Simpan CLO
            </button>
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-5 animate-in fade-in duration-300 pb-12 relative max-w-[1200px] mx-auto">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-8 right-8 z-[100] flex items-start gap-4 p-4 bg-white border border-[#10b981]/40 border-l-4 border-l-[#10b981] rounded-xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)] w-full max-w-[420px] transform transition-all animate-in slide-in-from-top-10 fade-in duration-500 ease-out overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-[#e6f9f0] flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} className="text-[#10b981]" />
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="text-[14px] font-bold text-[#111827]">Berhasil!</h3>
            <p className="text-[13px] text-[#5b6170] mt-1 leading-relaxed">{notification}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1 shrink-0">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Tombol Kembali */}
      <button onClick={() => navigate('/university/manajemen-clo')} className="flex items-center gap-2 text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition w-fit mb-1">
        <ArrowLeft size={16} strokeWidth={2.5} /> Kembali ke Daftar Mata Kuliah
      </button>

      {/* Header Card (Mata Kuliah Info) */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-5 w-full">
          <div className="w-12 h-12 rounded-xl bg-[#f4f7ff] text-[#0f5ce0] flex items-center justify-center border border-[#eef2ff] shrink-0 mt-1">
            <BookOpen size={24} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 bg-[#eef4ff] text-[#0f5ce0] text-[10px] font-extrabold rounded uppercase">{subjectData.code}</span>
              <span className="text-[12px] font-semibold text-[#7b8191]">{subjectData.sks} SKS • Semester {subjectData.semester}</span>
            </div>
            <h1 className="text-[22px] font-bold text-[#111827] tracking-tight">{subjectData.name}</h1>
            <p className="text-[13px] text-[#7b8191] mt-1.5 max-w-[500px] leading-relaxed">
              Sistem manajemen Course Learning Outcome (CLO) untuk mata kuliah {subjectData.name}.
            </p>
          </div>
        </div>
        <button onClick={handleOpenAdd} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0f5ce0] text-white text-[13px] font-bold rounded-xl hover:bg-[#0d4ebf] transition-all shadow-sm active:scale-95 shrink-0">
          <Plus size={16} strokeWidth={2.5} /> Tambah CLO
        </button>
      </div>

      {/* Stats & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Total CLO */}
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col justify-center min-h-[96px]">
          <div className="w-7 h-7 rounded-md bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center mb-3">
            <LayoutGrid size={14} />
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[10px] font-extrabold text-[#7b8191] uppercase tracking-wider">Total CLO</p>
            <p className="text-[28px] font-black text-[#111827] leading-none">{clos.length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="md:col-span-3 bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex items-center justify-center min-h-[96px]">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a6b5]" size={16} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari CLO berdasarkan kode atau deskripsi..."
              className="w-full pl-11 pr-4 py-3 bg-[#f8faff] border border-transparent rounded-xl text-[13px] focus:outline-none focus:border-[#e4e9f4] transition shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Tabel CLO */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] uppercase tracking-wider">
                <th className="px-6 py-4 whitespace-nowrap w-[15%]">Kode</th>
                <th className="px-6 py-4 w-[45%]">Deskripsi CLO</th>
                <th className="px-6 py-4 w-[25%]">Skill yang Didapat</th>
                <th className="px-6 py-4 whitespace-nowrap text-center w-[15%]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f9]">
              {filteredClos.length > 0 ? (
                filteredClos.map((clo) => (
                  <tr key={clo.id} className="hover:bg-[#fafbfe] transition">
                    <td className="px-6 py-6 align-top">
                      <span className="text-[14px] font-black text-[#0f5ce0] tracking-wide">{clo.code}</span>
                    </td>
                    <td className="px-6 py-6 align-top">
                      <p className="text-[13px] text-[#111827] leading-relaxed text-justify pr-6">
                        {clo.description}
                      </p>
                    </td>
                    <td className="px-6 py-6 align-top">
                      <div className="flex flex-wrap gap-2">
                        {clo.skills.map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1.5 bg-[#eef4ff] text-[#0f5ce0] text-[11px] font-bold rounded-md">
                            {skill}
                          </span>
                        ))}
                        {clo.skills.length === 0 && <span className="text-xs text-[#a0a6b5] italic">- Belum ada skill -</span>}
                      </div>
                    </td>
                    <td className="px-6 py-6 align-top text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleOpenEdit(clo)} className="w-8 h-8 flex items-center justify-center text-[#a0a6b5] border border-transparent rounded-lg hover:text-[#0f5ce0] hover:border-[#e4e9f4] transition hover:bg-white hover:shadow-sm" title="Edit CLO">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setItemToDelete(clo.id)} className="w-8 h-8 flex items-center justify-center text-[#a0a6b5] border border-transparent rounded-lg hover:text-red-500 hover:border-[#e4e9f4] transition hover:bg-white hover:shadow-sm" title="Hapus CLO">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-16 text-[13px] text-[#a0a6b5] font-medium">
                    Tidak ada data CLO yang ditemukan. Silakan tambah data baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Hapus */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white rounded-[20px] p-6 w-full max-w-sm shadow-xl flex flex-col gap-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#111827]">Hapus CLO?</h3>
              <p className="text-sm text-[#5b6170] mt-2">
                Apakah Anda yakin ingin menghapus data CLO ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                onClick={() => setItemToDelete(null)}
                className="py-2.5 text-sm font-bold text-[#5b6170] bg-white border border-[#e4e9f4] rounded-xl hover:bg-gray-50 transition active:scale-95"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-sm transition active:scale-95"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default UniversityDetailCLO