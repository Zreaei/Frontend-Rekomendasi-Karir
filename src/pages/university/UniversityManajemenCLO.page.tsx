import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Trash2, ChevronDown, BookCopy, LayoutGrid, AlertTriangle, ArrowRight, CheckCircle2, X, RotateCcw, ArrowLeft, Info, Loader2 } from 'lucide-react'
import { subjectApi } from '../../services/university.service'

interface Subject {
  id: string
  code: string
  name: string
  sks: number
  semester: number
  cloCount: number
}

const UniversityManajemenCLO = () => {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [isAddingMode, setIsAddingMode] = useState(false)
  const [newSubject, setNewSubject] = useState({ code: '', name: '', sks: 3, semester: 1 })
  const [formError, setFormError] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const rows = await subjectApi.list()
      setSubjects(
        (rows ?? []).map((s: any) => ({
          id: s.id,
          code: s.code ?? '-',
          name: s.name ?? '-',
          sks: s.sks ?? 0,
          semester: s.semester ?? 0,
          cloCount: s.cloCount ?? 0,
        })),
      )
    } catch (err: any) {
      setLoadError(err?.response?.data?.message ?? 'Gagal memuat mata kuliah. Pastikan server berjalan.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Statistik diturunkan dari daftar yang sudah dimuat, tanpa permintaan tambahan.
  const subjectStats = useMemo(() => ({
    totalSubjects: subjects.length,
    totalCLO: subjects.reduce((acc, s) => acc + s.cloCount, 0),
    noCLO: subjects.filter((s) => s.cloCount === 0).length,
  }), [subjects])

  const [searchQuery, setSearchQuery] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('Semua Semester')
  const [sksFilter, setSksFilter] = useState('Filter SKS')
  
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const availableSemesters = useMemo(
    () => Array.from(new Set(subjects.map(s => s.semester))).filter(Boolean).sort((a, b) => a - b),
    [subjects],
  )
  const availableSks = useMemo(
    () => Array.from(new Set(subjects.map(s => s.sks))).filter(Boolean).sort((a, b) => a - b),
    [subjects],
  )

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchSemester = semesterFilter === 'Semua Semester' || subject.semester.toString() === semesterFilter
      const matchSks = sksFilter === 'Filter SKS' || subject.sks.toString() === sksFilter
      
      const searchLower = searchQuery.toLowerCase()
      const matchSearch =
        subject.name.toLowerCase().includes(searchLower) ||
        (subject.code ?? '').toLowerCase().includes(searchLower)
      
      return matchSemester && matchSks && matchSearch
    })
  }, [subjects, semesterFilter, sksFilter, searchQuery])

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE) || 1
  const startIndex = filteredSubjects.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredSubjects.length)
  
  const displayedSubjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredSubjects.slice(start, end)
  }, [filteredSubjects, currentPage])

  const getPaginationGroup = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }

  const confirmDelete = async () => {
    if (!subjectToDelete) return
    setDeleting(true)
    try {
      await subjectApi.remove(subjectToDelete)
      await loadData()
      setSubjectToDelete(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setNotification('Mata kuliah berhasil dihapus dari sistem.')
      setTimeout(() => setNotification(null), 4000)
    } catch (err: any) {
      setSubjectToDelete(null)
      setLoadError(err?.response?.data?.message ?? 'Gagal menghapus mata kuliah.')
    } finally {
      setDeleting(false)
    }
  }

  const handleSaveSubject = async () => {
    if (!newSubject.code || !newSubject.name) {
      setFormError('Kode dan Nama Mata Kuliah wajib diisi.')
      return
    }

    setSaving(true)
    setFormError(null)
    try {
      await subjectApi.create({
        code: newSubject.code.trim(),
        name: newSubject.name.trim(),
        sks: Number(newSubject.sks),
        semester: Number(newSubject.semester),
      })
      await loadData()

      setIsAddingMode(false)
      setNewSubject({ code: '', name: '', sks: 3, semester: 1 })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setNotification('Mata kuliah baru berhasil ditambahkan!')
      setTimeout(() => setNotification(null), 4000)
    } catch (err: any) {
      setFormError(err?.response?.data?.message ?? 'Gagal menyimpan mata kuliah.')
    } finally {
      setSaving(false)
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSemesterFilter('Semua Semester')
    setSksFilter('Filter SKS')
    setCurrentPage(1)
  }

  const isFilterActive = searchQuery !== '' || semesterFilter !== 'Semua Semester' || sksFilter !== 'Filter SKS'

  if (isAddingMode) {
    return (
      <div className="w-full flex flex-col gap-6 animate-in slide-in-from-right-8 fade-in duration-300 pb-12 relative max-w-[1000px] mx-auto">
        
        {/* Header Back Button */}
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => {
              setIsAddingMode(false);
              setFormError(null);
            }}
            className="w-10 h-10 flex items-center justify-center rounded-[12px] bg-[#E3F0FF]"
          >
            <ArrowLeft
              size={18}
              strokeWidth={2.5}
              className="text-[#3B82F6]"
            />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">Tambah Mata Kuliah Baru</h1>
            <p className="text-[15px] text-[#5b6170] mt-0.5">Tambahkan detail mata kuliah baru ke dalam kurikulum Program Studi.</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[20px] border border-[#e4e9f4] shadow-sm p-6 sm:p-8 flex flex-col gap-6">
          
          {formError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-xl flex items-center gap-2">
              <AlertTriangle size={18} /> {formError}
            </div>
          )}

          {/* Row 1: Kode & Nama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#111827]">Kode Mata Kuliah</label>
              <input 
                type="text"
                value={newSubject.code}
                onChange={(e) => { setNewSubject({...newSubject, code: e.target.value}); setFormError(null); }}
                placeholder="Contoh: ADP"
                className="w-full px-4 py-3 bg-white border border-[#e4e9f4] rounded-xl text-[14px] text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#111827]">Nama Mata Kuliah</label>
              <input 
                type="text"
                value={newSubject.name}
                onChange={(e) => { setNewSubject({...newSubject, name: e.target.value}); setFormError(null); }}
                placeholder="Contoh: Algoritma dan Pemrograman"
                className="w-full px-4 py-3 bg-white border border-[#e4e9f4] rounded-xl text-[14px] text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm"
              />
            </div>
          </div>

          {/* Row 2: SKS & Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#111827]">Jumlah SKS</label>
              <div className="relative">
                <select 
                  value={newSubject.sks}
                  onChange={(e) => setNewSubject({...newSubject, sks: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-[#f8faff] border border-transparent rounded-xl text-[14px] text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} SKS</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#111827]">Semester</label>
              <div className="relative">
                <select 
                  value={newSubject.semester}
                  onChange={(e) => setNewSubject({...newSubject, semester: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-[#f8faff] border border-transparent rounded-xl text-[14px] text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>Semester {num}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-[#eef4ff] rounded-[16px] p-5 flex items-start gap-4 mt-2">
            <div className="w-8 h-8 rounded-full bg-[#d0e0ff] text-[#0f5ce0] flex items-center justify-center shrink-0">
              <Info size={18} strokeWidth={2.5} />
            </div>
            <p className="text-[14px] text-[#5b6170] leading-relaxed pt-1.5">
              Setelah menyimpan, Anda dapat melanjutkan ke tab Kelola CLO untuk menentukan Course Learning Outcomes yang selaras dengan profil lulusan universitas.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#f1f4f9] mt-2">
            <button 
              onClick={() => { setIsAddingMode(false); setFormError(null); }}
              disabled={saving}
              className="px-6 py-2.5 text-[14px] font-bold text-[#0f5ce0] bg-white hover:bg-[#f8faff] rounded-xl transition-colors active:scale-95 disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              onClick={handleSaveSubject}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-bold text-white bg-[#0f5ce0] hover:bg-[#0d4ebf] shadow-sm rounded-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              Simpan Mata Kuliah
            </button>
          </div>

        </div>
      </div>
    )
  }

  // ---------- Loading ----------
  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-3 text-[#5b6170]">
        <Loader2 size={28} className="animate-spin text-[#0f5ce0]" />
        <p className="text-sm font-medium">Memuat mata kuliah...</p>
      </div>
    )
  }

  // ---------- Error ----------
  if (loadError && subjects.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl max-w-md">
          <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Gagal memuat data</p>
            <p className="text-xs text-red-700 mt-0.5">{loadError}</p>
          </div>
        </div>
        <button onClick={loadData} className="px-6 py-2.5 bg-[#0f5ce0] rounded-xl text-sm font-bold text-white hover:bg-[#0d4ebf] transition">
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative">
      
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

      {loadError && subjects.length > 0 && (
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl">
          <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{loadError}</p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">Manajemen CLO & Matakuliah</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col justify-between min-h-[136px]">
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-[10px] bg-[#f4f7ff] text-[#0f5ce0] flex items-center justify-center border border-[#eef2ff]">
              <BookCopy size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[13px] font-bold text-[#7b8191]">Total Mata Kuliah</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1.5">{subjectStats.totalSubjects}</p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-5 shadow-sm flex flex-col justify-between min-h-[136px]">
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-[10px] bg-[#f0fdf4] text-[#10b981] flex items-center justify-center border border-[#e6f9f0]">
              <LayoutGrid size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[13px] font-bold text-[#7b8191]">Total CLO</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1.5">{subjectStats.totalCLO}</p>
          </div>
        </div>

        <div className="bg-[#fffbfc] rounded-[16px] border border-[#fee2e2] p-5 shadow-[0_4px_20px_-10px_rgba(239,68,68,0.12)] flex flex-col justify-between min-h-[136px]">
          <div className="flex items-start justify-between w-full">
            <div className="w-11 h-11 rounded-[10px] bg-[#fef2f2] text-red-500 flex items-center justify-center border border-[#fee2e2]">
              <AlertTriangle size={20} strokeWidth={2.5} />
            </div>
            <span className="px-3 py-1.5 bg-[#fef2f2] text-red-600 text-[10px] font-extrabold uppercase tracking-wider rounded-md">
              Perlu Tindakan
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[13px] font-bold text-red-500">MK Belum Ada CLO</p>
            <p className="text-[32px] font-black text-red-600 leading-none mt-1.5">{subjectStats.noCLO}</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col">
        
        {/* Top Toolbar */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4 px-6 pt-6 pb-0 border-b border-[#e4e9f4]">
          <div className="flex w-full md:w-auto relative -bottom-[1px]">
            <button className="text-[#0f5ce0] font-bold text-sm border-b-[3px] border-[#0f5ce0] pb-4 px-1">
              Daftar Matakuliah
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 pb-4">
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" size={16} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari berdasarkan Kode atau nama MK"
                className="w-full pl-10 pr-4 py-2 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm"
              />
            </div>
            
            <button 
              onClick={() => setIsAddingMode(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-[#0f5ce0] text-white text-[13px] font-bold rounded-lg hover:bg-[#0d4ebf] transition-all shadow-sm active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} /> Tambah Mata Kuliah
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative">
              <select 
                value={semesterFilter}
                onChange={(e) => { setSemesterFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 pr-10 border border-[#e4e9f4] rounded-lg text-[13px] text-[#5b6170] font-semibold bg-white hover:bg-gray-50 focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer shadow-sm min-w-[150px]"
              >
                <option value="Semua Semester">Semua Semester</option>
                {availableSemesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={sksFilter}
                onChange={(e) => { setSksFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 pr-10 border border-[#e4e9f4] rounded-lg text-[13px] text-[#5b6170] font-semibold bg-white hover:bg-gray-50 focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer shadow-sm min-w-[120px]"
              >
                <option value="Filter SKS">Filter SKS</option>
                {availableSks.map(s => <option key={s} value={s}>{s} SKS</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>

            {/* Tombol Reset Filter */}
            {isFilterActive && (
              <button 
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-bold text-[#111827] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw size={14} strokeWidth={2.5} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[12px] font-bold text-[#7b8191]">
                <th className="px-6 py-4 whitespace-nowrap">Kode</th>
                <th className="px-6 py-4 whitespace-nowrap">Nama Mata Kuliah</th>
                <th className="px-6 py-4 whitespace-nowrap">SKS</th>
                <th className="px-6 py-4 whitespace-nowrap">Semester</th>
                <th className="px-6 py-4 whitespace-nowrap">Jumlah CLO</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e9f4]">
              {displayedSubjects.length > 0 ? (
                displayedSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-[#fafbfe] transition group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#0f5ce0]">
                      {subject.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#111827]">{subject.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-[#5b6170]">
                      {subject.sks} SKS
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-[#5b6170]">
                      {subject.semester ? `Semester ${subject.semester}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-[#5b6170]">
                      {subject.cloCount} CLO
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-5">
                        
                        {/* Tombol Hapus */}
                        <button 
                          onClick={() => setSubjectToDelete(subject.id)}
                          className="text-[#a0a6b5] hover:text-red-500 transition p-1"
                          title="Hapus Mata Kuliah"
                        >
                          <Trash2 size={16} />
                        </button>
                        
                        {/* Tombol Kelola CLO */}
                        <button 
                          onClick={() => navigate(`/university/detail-clo/${subject.id}`)}
                          className="flex items-center gap-1.5 text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition"
                        >
                          Kelola CLO <ArrowRight size={14} strokeWidth={2.5} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-sm text-[#a0a6b5] font-medium">
                    {subjects.length === 0
                      ? 'Belum ada mata kuliah. Tambahkan lewat tombol "Tambah Mata Kuliah".'
                      : 'Tidak ada mata kuliah yang sesuai dengan filter atau pencarian.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi */}
        {filteredSubjects.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm rounded-b-[16px]">
            
            <div className="text-[13px] text-[#7b8191] font-medium">
              Menampilkan <span className="text-[#111827] font-bold">{startIndex}-{endIndex}</span> dari <span className="text-[#111827] font-bold">{filteredSubjects.length}</span> matakuliah
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1} 
                className={`font-semibold transition-colors mr-2 ${currentPage === 1 ? 'text-[#a0a6b5] cursor-not-allowed' : 'text-[#7b8191] hover:text-[#0f5ce0]'}`}
              >
                Sebelumnya
              </button>
              
              <div className="flex items-center gap-1">
                {getPaginationGroup().map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => typeof item === 'number' && setCurrentPage(item)} 
                    disabled={item === '...'}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                      item === currentPage 
                        ? 'bg-[#0f5ce0] text-white shadow-sm' 
                        : item === '...' ? 'cursor-default text-[#a0a6b5]' : 'text-[#5b6170] hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages} 
                className={`font-semibold transition-colors ml-2 ${currentPage === totalPages ? 'text-[#a0a6b5] cursor-not-allowed' : 'text-[#0f5ce0] hover:text-[#0d4ebf]'}`}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Modal Hapus */}
      {subjectToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white rounded-[20px] p-6 w-full max-w-sm shadow-xl flex flex-col gap-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#111827]">Hapus Data?</h3>
              <p className="text-sm text-[#5b6170] mt-2">
                Mata kuliah beserta seluruh CLO-nya akan dihapus. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button 
                onClick={() => setSubjectToDelete(null)}
                disabled={deleting}
                className="py-2.5 text-sm font-bold text-[#5b6170] bg-white border border-[#e4e9f4] rounded-xl hover:bg-gray-50 transition active:scale-95 disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-sm transition active:scale-95 disabled:opacity-60"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default UniversityManajemenCLO