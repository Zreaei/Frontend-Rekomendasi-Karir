import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Users, Edit2, Download, Search, ChevronDown, ChevronUp, CheckCircle2, X, Code, Layers, GraduationCap, AlertTriangle, Loader2 } from 'lucide-react'
import { cloGradeApi, type SubjectGradeData } from '../../services/university.service'

type CLOItem = SubjectGradeData['clos'][number]
type StudentItem = SubjectGradeData['students'][number]

const AVATAR_COLORS = [
  'bg-[#eef4ff] text-[#0f5ce0]',
  'bg-[#e6f9f0] text-[#10b981]',
  'bg-[#fffbeb] text-[#f59e0b]',
  'bg-[#f4f3ff] text-[#6366f1]',
  'bg-[#fee2e2] text-[#ef4444]',
  'bg-[#ecfeff] text-[#06b6d4]',
]
const colorFromName = (name: string) => {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}
const initialFromName = (name: string) =>
  name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

const UniversityKelolaNilai = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [subjectData, setSubjectData] = useState<SubjectGradeData['subject'] | null>(null)
  const [clos, setClos] = useState<CLOItem[]>([])
  const [students, setStudents] = useState<StudentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savingWeights, setSavingWeights] = useState(false)

  const [searchStudentQuery, setSearchStudentQuery] = useState('')
  const [isEditingBobot, setIsEditingBobot] = useState(false)
  const [draftWeights, setDraftWeights] = useState<Record<string, string>>({})
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null)
  // Nilai dikunci pada id CLO, bukan kodenya, karena kode bisa berulang.
  const [draftGrades, setDraftGrades] = useState<Record<string, Record<string, string>>>({})
  const [initialGrades, setInitialGrades] = useState<Record<string, Record<string, string>>>({})
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'warning'} | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const loadData = useCallback(async () => {
    if (!id) {
      navigate('/university/manajemen-nilai')
      return
    }
    setIsLoading(true)
    setLoadError('')
    try {
      const data = await cloGradeApi.getBySubject(id)
      setSubjectData(data.subject)
      setClos(data.clos)
      setStudents(data.students)

      const drafts: Record<string, Record<string, string>> = {}
      for (const s of data.students) {
        drafts[s.id] = {}
        for (const c of data.clos) {
          const nilai = s.grades?.[c.id]
          drafts[s.id][c.id] = nilai !== undefined && nilai !== null ? String(nilai) : ''
        }
      }
      setDraftGrades(drafts)
      setInitialGrades(JSON.parse(JSON.stringify(drafts)))
    } catch (err: any) {
      setLoadError(err?.response?.data?.message ?? 'Gagal memuat data nilai. Pastikan server berjalan.')
    } finally {
      setIsLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    loadData()
  }, [loadData])

  const showNotification = (msg: string, type: 'success' | 'warning') => {
    setNotification({ message: msg, type })
    setTimeout(() => setNotification(null), 4000)
    if (type === 'success') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditBobotClick = () => {
    const initialWeights: Record<string, string> = {}
    clos.forEach(c => initialWeights[c.id] = c.weight ? c.weight.toString() : '')
    setDraftWeights(initialWeights)
    setIsEditingBobot(true)
  }

  const totalDraftWeight = useMemo(() => {
    return Object.values(draftWeights).reduce((sum, current) => sum + (Number(current) || 0), 0)
  }, [draftWeights])

  const handleWeightChange = (cloId: string, val: string) => {
    if (val === '') {
      setDraftWeights(prev => ({ ...prev, [cloId]: '' }))
      return
    }
    const numVal = parseInt(val, 10)
    if (!isNaN(numVal) && numVal >= 0) {
      setDraftWeights(prev => ({ ...prev, [cloId]: numVal.toString() }))
    }
  }

  const handleSaveBobot = async () => {
    if (totalDraftWeight !== 100 || !id) return
    setSavingWeights(true)
    try {
      await cloGradeApi.setWeights(
        id,
        clos.map(c => ({ cloId: c.id, weight: Number(draftWeights[c.id]) || 0 })),
      )
      setClos(prev => prev.map(c => ({ ...c, weight: Number(draftWeights[c.id]) || 0 })))
      setIsEditingBobot(false)
      showNotification('Distribusi bobot CLO berhasil diperbarui.', 'success')
    } catch (err: any) {
      showNotification(err?.response?.data?.message ?? 'Gagal menyimpan bobot CLO.', 'warning')
    } finally {
      setSavingWeights(false)
    }
  }

  const calculateFinalScore = (studentId: string) => {
    if (clos.length === 0) return '0.0'
    const totalBobot = clos.reduce((a, c) => a + (c.weight || 0), 0)
    if (totalBobot === 0) {
      // bobot belum diatur -> rata-rata sederhana
      const rata = clos.reduce((a, c) => a + (Number(draftGrades[studentId]?.[c.id]) || 0), 0) / clos.length
      return rata.toFixed(1)
    }
    let total = 0
    clos.forEach(clo => {
      const score = Number(draftGrades[studentId]?.[clo.id]) || 0
      total += (score * (clo.weight || 0)) / 100
    })
    return total.toFixed(1)
  }

  const checkStatus = (studentId: string) => {
    if (clos.length === 0) return 'Tidak Lengkap'
    const isComplete = clos.every(clo => (Number(draftGrades[studentId]?.[clo.id]) || 0) > 0)
    return isComplete ? 'Selesai' : 'Tidak Lengkap'
  }

  const gradedStudentsCount = useMemo(() => {
    return students.filter(s => checkStatus(s.id) === 'Selesai').length
  }, [students, clos, draftGrades])

  const hasUnsavedChanges = (studentId: string) => {
    const currentDraft = draftGrades[studentId]
    const original = initialGrades[studentId]
    if (!currentDraft || !original) return false
    return clos.some(clo => (currentDraft[clo.id] || '') !== (original[clo.id] || ''))
  }

  const handleSaveStudentGrades = async (studentId: string) => {
    if (!id) return
    if (!hasUnsavedChanges(studentId)) {
      showNotification('Tidak ada perubahan nilai yang dilakukan.', 'warning')
      return
    }

    const currentDraft = draftGrades[studentId]
    const scores = clos
      .filter(c => currentDraft[c.id] !== '' && currentDraft[c.id] !== undefined)
      .map(c => ({ cloId: c.id, score: Number(currentDraft[c.id]) }))

    if (scores.length === 0) {
      showNotification('Isi minimal satu nilai CLO sebelum menyimpan.', 'warning')
      return
    }

    setSavingId(studentId)
    try {
      const hasil: any = await cloGradeApi.save(studentId, id, scores)
      setInitialGrades(prev => ({ ...prev, [studentId]: { ...currentDraft } }))
      setExpandedStudentId(null)
      showNotification(
        hasil?.skillsGranted
          ? `Nilai tersimpan. Nilai akhir ${hasil.finalScore} — ${hasil.skillsGranted} keahlian matkul ditambahkan ke kompetensi mahasiswa.`
          : `Nilai tersimpan. Nilai akhir mata kuliah: ${hasil?.finalScore ?? '-'}.`,
        'success',
      )
    } catch (err: any) {
      showNotification(err?.response?.data?.message ?? 'Gagal menyimpan nilai.', 'warning')
    } finally {
      setSavingId(null)
    }
  }

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) || 
      (s.nim ?? '').toLowerCase().includes(searchStudentQuery.toLowerCase())
    )
  }, [students, searchStudentQuery])

  const handleExportExcel = () => {
    if (filteredStudents.length === 0) return
    const headers = ['NIM', 'Nama', ...clos.map(c => `${c.code} (${c.weight || 0}%)`), 'Nilai Akhir', 'Status']
    const rows = filteredStudents.map(s => [
      `"${s.nim ?? '-'}"`,
      `"${s.name}"`,
      ...clos.map(c => draftGrades[s.id]?.[c.id] || ''),
      calculateFinalScore(s.id),
      `"${checkStatus(s.id)}"`,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Nilai_${subjectData?.code ?? 'MataKuliah'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const anyUnsavedChanges = useMemo(() => {
    return students.some(s => hasUnsavedChanges(s.id))
  }, [students, clos, draftGrades, initialGrades])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (anyUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [anyUnsavedChanges])

  const handleBackToList = () => {
    if (anyUnsavedChanges && !window.confirm('Ada perubahan nilai yang belum disimpan dan akan hilang. Tetap kembali?')) {
      return
    }
    navigate('/university/manajemen-nilai')
  }

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) || 1
  const startIndex = filteredStudents.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)
  
  const displayedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredStudents.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredStudents, currentPage])

  const getPaginationGroup = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }

  const handleGradeChange = (studentId: string, cloId: string, value: string) => {
    if (value === '') {
      setDraftGrades(prev => ({...prev, [studentId]: {...prev[studentId], [cloId]: ''}}))
      return
    }
    const numVal = parseInt(value, 10)
    if (!isNaN(numVal) && numVal >= 0 && numVal <= 100) {
      setDraftGrades(prev => ({...prev, [studentId]: {...prev[studentId], [cloId]: numVal.toString()}}))
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-[#5b6170]">
        <Loader2 size={28} className="animate-spin text-[#0f5ce0]" />
        <p className="text-sm font-medium">Memuat data mata kuliah...</p>
      </div>
    )
  }

  if (loadError || !subjectData) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 gap-4">
        <div className="flex items-start gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl max-w-md">
          <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800">Gagal memuat data</p>
            <p className="text-xs text-red-700 mt-0.5">{loadError || 'Mata kuliah tidak ditemukan.'}</p>
          </div>
        </div>
        <button onClick={() => navigate('/university/manajemen-nilai')} className="px-6 py-2.5 bg-[#0f5ce0] rounded-xl text-sm font-bold text-white hover:bg-[#0d4ebf] transition">
          Kembali ke Daftar
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative max-w-[1200px] mx-auto">
      
      {notification && (
        <div className={`fixed top-8 right-8 z-[100] flex items-start gap-4 p-4 bg-white border rounded-xl w-full max-w-[420px] transform transition-all animate-in slide-in-from-top-10 fade-in duration-500 ease-out overflow-hidden ${
          notification.type === 'success' 
            ? 'border-[#10b981]/40 border-l-4 border-l-[#10b981] shadow-[0_10px_40px_-10px_rgba(16,185,129,0.2)]' 
            : 'border-[#f59e0b]/40 border-l-4 border-l-[#f59e0b] shadow-[0_10px_40px_-10px_rgba(245,158,11,0.2)]'
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            notification.type === 'success' ? 'bg-[#e6f9f0]' : 'bg-[#fffbeb]'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 size={22} className="text-[#10b981]" />
            ) : (
              <AlertTriangle size={22} className="text-[#f59e0b]" />
            )}
          </div>
          <div className="flex-1 pt-0.5">
            <h3 className="text-[14px] font-bold text-[#111827]">
              {notification.type === 'success' ? 'Berhasil!' : 'Perhatian'}
            </h3>
            <p className="text-[13px] text-[#5b6170] mt-1 leading-relaxed">{notification.message}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1 shrink-0">
            <X size={18} />
          </button>
        </div>
      )}

      <button onClick={handleBackToList} className="flex items-center gap-2 text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition w-fit mb-1">
        <ArrowLeft size={16} strokeWidth={2.5} /> Kembali ke Daftar Mata Kuliah
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm p-6 flex flex-col sm:flex-row justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-[14px] bg-[#f4f7ff] text-[#0f5ce0] flex items-center justify-center border border-[#eef2ff] shrink-0">
              <BookOpen size={26} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-[#111827] mb-2.5">{subjectData.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-[13px] font-semibold text-[#7b8191]">
                <span className="flex items-center gap-1.5 text-[#5b6170]">
                  <Code size={16} strokeWidth={2.5} className="text-[#0f5ce0]" /> 
                  {subjectData.code}
                </span>
                <span className="flex items-center gap-1.5 text-[#5b6170]">
                  <Layers size={16} strokeWidth={2.5} className="text-[#10b981]" /> 
                  {subjectData.sks} SKS
                </span>
                {subjectData.semester ? (
                  <span className="flex items-center gap-1.5 text-[#5b6170]">
                    <GraduationCap size={16} strokeWidth={2.5} className="text-[#f59e0b]" /> 
                    Semester {subjectData.semester}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:items-end justify-center">
            <p className="text-[10px] font-extrabold text-[#a0a6b5] uppercase tracking-widest mb-1.5">Status Penilaian</p>
            <p className="text-[14px] font-bold text-[#111827]">
              <span className="text-[#0f5ce0] text-[20px] font-black">{gradedStudentsCount}</span> / {students.length} Mahasiswa
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm p-6 flex flex-col justify-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#e6f9f0] text-[#10b981] flex items-center justify-center border border-[#d1f4e0]">
            <Users size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[32px] font-black text-[#111827] leading-none mb-1">{students.length}</p>
            <p className="text-[12px] font-bold text-[#7b8191]">Mahasiswa Terdaftar</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#111827]">Distribusi Bobot CLO</h2>
            <p className="text-[13px] text-[#7b8191] mt-0.5">Matriks evaluasi yang dihitung untuk hasil pembelajaran kursus.</p>
          </div>
          <button onClick={handleEditBobotClick} disabled={clos.length === 0} className="flex items-center gap-1.5 text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition disabled:opacity-40">
            <Edit2 size={14} strokeWidth={2.5} /> Edit Bobot
          </button>
        </div>

        <div className="flex flex-wrap gap-4 animate-in fade-in duration-200">
          {clos.map(clo => (
            <div key={clo.id} className="bg-[#f4f7ff] border border-[#eef2ff] rounded-xl px-5 py-4 flex flex-col justify-center min-w-[140px] shadow-sm">
              <p className="text-[12px] font-bold text-[#0f5ce0] mb-1">{clo.code}</p>
              <p className="text-[24px] font-black text-[#0f5ce0] leading-none">{clo.weight || 0}%</p>
            </div>
          ))}
          {clos.length === 0 && <p className="text-[13px] text-[#a0a6b5] italic">Belum ada data CLO untuk mata kuliah ini.</p>}
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-hidden mt-2">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-[#e4e9f4]">
          <h2 className="text-[16px] font-bold text-[#111827] whitespace-nowrap">Daftar Nilai Siswa</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-[250px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" size={14} />
              <input 
                type="text"
                value={searchStudentQuery}
                onChange={(e) => { setSearchStudentQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari Mahasiswa / NIM..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm"
              />
            </div>
            <button 
              onClick={handleExportExcel}
              disabled={filteredStudents.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0f5ce0] text-white text-[13px] font-bold rounded-lg hover:bg-[#0d4ebf] transition-all shadow-sm disabled:opacity-50"
            >
              <Download size={14} strokeWidth={2.5} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] uppercase tracking-widest">
                <th className="px-6 py-4 whitespace-nowrap">Nama & NIM Siswa</th>
                <th className="px-6 py-4 whitespace-nowrap">Nilai Akhir</th>
                <th className="px-6 py-4 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f9]">
              {displayedStudents.length > 0 ? (
                displayedStudents.map(student => {
                  const isExpanded = expandedStudentId === student.id
                  const finalScore = calculateFinalScore(student.id)
                  const status = checkStatus(student.id)
                  return (
                    <React.Fragment key={student.id}>
                      <tr className={`transition ${isExpanded ? 'bg-[#fafbfe]' : 'hover:bg-[#fafbfe]'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${colorFromName(student.name)} flex items-center justify-center font-bold text-[13px]`}>
                              {initialFromName(student.name)}
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-[#111827]">{student.name}</p>
                              <p className="text-[12px] text-[#7b8191]">NIM: {student.nim ?? '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[16px] font-black text-[#111827]">{finalScore}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {status === 'Selesai' ? (
                            <span className="inline-flex items-center justify-center w-[120px] px-3 py-1.5 bg-[#e6f9f0] text-[#10b981] text-[10px] font-extrabold rounded uppercase tracking-wider">Selesai</span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-[120px] px-3 py-1.5 bg-[#f1f4f9] text-[#7b8191] text-[10px] font-extrabold rounded uppercase tracking-wider">Tidak Lengkap</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {isExpanded ? (
                            <div className="flex items-center justify-end gap-3">
                              {hasUnsavedChanges(student.id) && (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#f59e0b]">
                                  <AlertTriangle size={13} /> Belum Tersimpan
                                </span>
                              )}
                              <button 
                                onClick={() => handleSaveStudentGrades(student.id)}
                                disabled={savingId === student.id}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f5ce0] text-white text-[12px] font-bold rounded-lg hover:bg-[#0d4ebf] transition shadow-sm active:scale-95 disabled:opacity-60"
                              >
                                {savingId === student.id && <Loader2 size={13} className="animate-spin" />}
                                Simpan Perubahan
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setExpandedStudentId(student.id)}
                              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition"
                            >
                              Lihat Detail <ChevronDown size={16} strokeWidth={2.5} />
                            </button>
                          )}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-[#fafbfe]">
                          <td colSpan={4} className="px-6 py-6 border-b-2 border-[#e4e9f4]">
                            <div className="flex flex-col gap-4">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="text-[14px] font-bold text-[#111827]">Matrix Performa Individu</h3>
                                <button
                                  onClick={() => {
                                    if (hasUnsavedChanges(student.id) && !window.confirm('Perubahan nilai belum disimpan dan akan hilang. Tutup tanpa menyimpan?')) {
                                      return
                                    }
                                    setExpandedStudentId(null)
                                  }}
                                  className="text-[#7b8191] hover:text-[#111827] transition flex items-center gap-1 text-[12px] font-bold"
                                >
                                  Tutup Matrix <ChevronUp size={16} />
                                </button>
                              </div>

                              {hasUnsavedChanges(student.id) && (
                                <div className="flex items-center gap-2.5 bg-[#fffbeb] border border-[#fde68a] text-[#92400e] rounded-xl px-4 py-3 text-[12px] font-bold">
                                  <AlertTriangle size={16} className="text-[#f59e0b] shrink-0" />
                                  Ada perubahan nilai yang belum disimpan. Klik "Simpan Perubahan" sebelum meninggalkan halaman ini.
                                </div>
                              )}

                              <div className="flex flex-col gap-3">
                                {clos.map(clo => (
                                  <div key={clo.id} className="bg-white border border-[#e4e9f4] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm">
                                    <div className="flex-1">
                                      <h4 className="text-[13px] font-bold text-[#111827] mb-1">{clo.code}</h4>
                                      <p className="text-[12px] text-[#7b8191] leading-relaxed mb-3 pr-4 max-w-[800px]">{clo.description}</p>
                                      <span className="px-2 py-1 bg-[#eef4ff] text-[#0f5ce0] text-[10px] font-extrabold rounded uppercase tracking-wider">Bobot {clo.weight || 0}%</span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 bg-[#f8faff] px-4 py-3 rounded-lg border border-[#eef2ff]">
                                      <input 
                                        type="number"
                                        min="0" max="100"
                                        value={draftGrades[student.id]?.[clo.id] ?? ''}
                                        onChange={(e) => handleGradeChange(student.id, clo.id, e.target.value)}
                                        className="w-[60px] h-[36px] bg-white border border-[#e4e9f4] rounded-lg text-center text-[15px] font-black text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition hide-arrows"
                                        placeholder="0"
                                      />
                                      <span className="text-[14px] font-bold text-[#a0a6b5]">/ 100</span>
                                    </div>
                                  </div>
                                ))}
                                {clos.length === 0 && <p className="text-[13px] text-[#a0a6b5] italic text-center py-4">Belum ada CLO untuk dinilai.</p>}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-sm text-[#a0a6b5] font-medium">
                    {students.length === 0
                      ? 'Belum ada mahasiswa terdaftar di kampus ini.'
                      : 'Mahasiswa dengan kata kunci tersebut tidak ditemukan.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm rounded-b-[16px] gap-4">
            <div className="text-[13px] text-[#7b8191] font-medium text-center sm:text-left w-full sm:w-auto">
              Menampilkan <span className="text-[#111827] font-bold">{startIndex}-{endIndex}</span> dari <span className="text-[#111827] font-bold">{filteredStudents.length}</span> mahasiswa
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
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

      {isEditingBobot && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white rounded-[20px] p-6 w-full max-w-lg shadow-xl flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b border-[#e4e9f4] pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#111827]">Edit Distribusi Bobot CLO</h3>
                <p className="text-sm text-[#5b6170] mt-1">Total kumulatif bobot harus tepat mencapai 100%.</p>
              </div>
              <button onClick={() => setIsEditingBobot(false)} className="text-[#a0a6b5] hover:text-[#111827] transition p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2 max-h-[50vh] overflow-y-auto p-1">
              {clos.map(clo => (
                <div key={clo.id} className="bg-[#f8faff] border border-[#e4e9f4] rounded-xl px-4 py-3 flex flex-col shadow-sm focus-within:border-[#0f5ce0] transition">
                  <p className="text-[13px] font-bold text-[#111827] mb-2.5">{clo.code}</p>
                  <div className="flex items-center gap-1 bg-white rounded-lg border border-[#e4e9f4] px-3 py-1.5 focus-within:bg-white focus-within:border-[#0f5ce0]">
                    <input 
                      type="number"
                      value={draftWeights[clo.id] ?? ''}
                      onChange={(e) => handleWeightChange(clo.id, e.target.value)}
                      className="w-full bg-transparent text-[18px] font-black text-[#0f5ce0] focus:outline-none text-center hide-arrows p-0"
                      placeholder="0"
                    />
                    <span className="text-[16px] font-black text-[#a0a6b5]">%</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-5 border-t border-[#f1f4f9] mt-2 gap-4">
              <div className="text-[13px] font-bold text-[#7b8191]">
                Total Bobot: {' '}
                <span className={`text-[16px] font-black ${totalDraftWeight === 100 ? 'text-[#10b981]' : 'text-red-500'}`}>
                  {totalDraftWeight}%
                </span>
                {totalDraftWeight < 100 && (
                  <span className="block sm:inline text-[11px] font-medium text-red-500 mt-1 sm:mt-0 sm:ml-2">
                    (Kurang {100 - totalDraftWeight}%)
                  </span>
                )}
                {totalDraftWeight > 100 && (
                  <span className="block sm:inline text-[11px] font-medium text-red-500 mt-1 sm:mt-0 sm:ml-2">
                    (Lebih {totalDraftWeight - 100}%)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditingBobot(false)} 
                  disabled={savingWeights}
                  className="px-5 py-2.5 text-[13px] font-bold text-[#5b6170] bg-white border border-[#e4e9f4] hover:bg-gray-50 rounded-xl transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveBobot}
                  disabled={totalDraftWeight !== 100 || savingWeights}
                  className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-[#0f5ce0] hover:bg-[#0d4ebf] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition shadow-sm"
                >
                  {savingWeights && <Loader2 size={14} className="animate-spin" />}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-arrows::-webkit-outer-spin-button,
        .hide-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-arrows {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  )
}

export default UniversityKelolaNilai