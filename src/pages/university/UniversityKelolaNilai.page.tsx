import React, { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Users, Edit2, Download, Search, ChevronDown, ChevronUp, CheckCircle2, X, Code, Layers, GraduationCap, AlertTriangle } from 'lucide-react'
import { UniversityService, type Subject, type SubjectCLO, type Student, type NilaiMahasiswa } from './UniversityData'

const UniversityKelolaNilai = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const subjectData: Subject | undefined = location.state?.subjectData

  const [clos, setClos] = useState<SubjectCLO[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [searchStudentQuery, setSearchStudentQuery] = useState('')
  const [isEditingBobot, setIsEditingBobot] = useState(false)
  const [draftWeights, setDraftWeights] = useState<Record<string, string>>({})
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null)
  const [draftGrades, setDraftGrades] = useState<Record<string, Record<string, string>>>({})
  const [initialGrades, setInitialGrades] = useState<Record<string, Record<string, string>>>({})
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'warning'} | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    if (!subjectData) {
      navigate('/university/manajemen-nilai')
    } else {
      loadData()
    }
  }, [subjectData, navigate])

  const loadData = async () => {
    if (subjectData) {
      const cloData = await UniversityService.getCLOsBySubject(subjectData.id)
      const studentData = await UniversityService.getStudents()
      const gradeData = await UniversityService.getAllNilai()
      
      setClos(cloData)
      setStudents(studentData) 
      const initialDrafts: Record<string, Record<string, string>> = {}
      studentData.forEach(student => {
        initialDrafts[student.id] = {}
        cloData.forEach(clo => {
          const existingGrade = gradeData.find(g => g.course === subjectData.name && g.studentId === student.id && g.code === clo.code)
          initialDrafts[student.id][clo.code] = existingGrade && existingGrade.score > 0 ? existingGrade.score.toString() : ''
        })
      })
      setDraftGrades(initialDrafts)
      setInitialGrades(JSON.parse(JSON.stringify(initialDrafts)))
    }
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
    if (totalDraftWeight !== 100) return

    const updatedClos = clos.map(c => ({ ...c, weight: Number(draftWeights[c.id]) || 0 }))
    for (const clo of updatedClos) {
      await UniversityService.saveCLO(clo)
    }
    setClos(updatedClos)
    setIsEditingBobot(false)
    showNotification("Distribusi bobot CLO berhasil diperbarui.", 'success')
  }

  const calculateFinalScore = (studentId: string) => {
    if (clos.length === 0) return 0
    let totalScore = 0
    clos.forEach(clo => {
      const weight = clo.weight || 0
      const score = Number(draftGrades[studentId]?.[clo.code]) || 0
      totalScore += (score * weight) / 100
    })
    return totalScore.toFixed(1)
  }

  const checkStatus = (studentId: string) => {
    if (clos.length === 0) return 'Tidak Lengkap'
    const isComplete = clos.every(clo => (Number(draftGrades[studentId]?.[clo.code]) || 0) > 0)
    return isComplete ? 'Selesai' : 'Tidak Lengkap'
  }

  const gradedStudentsCount = useMemo(() => {
    return students.filter(s => checkStatus(s.id) === 'Selesai').length
  }, [students, clos, draftGrades])

  const handleSaveStudentGrades = async (studentId: string) => {
    const currentDraft = draftGrades[studentId]
    const original = initialGrades[studentId]
    
    let hasChanges = false
    for (const clo of clos) {
      if ((currentDraft[clo.code] || '') !== (original[clo.code] || '')) {
        hasChanges = true
        break
      }
    }

    if (!hasChanges) {
      showNotification("Tidak ada perubahan nilai yang dilakukan.", 'warning')
      return 
    }

    const studentGradesToSave: NilaiMahasiswa[] = clos.map(clo => ({
      id: `new_${Date.now()}_${clo.code}`,
      studentId: studentId,
      code: clo.code,
      course: subjectData!.name,
      description: clo.description,
      skills: clo.skills,
      score: Number(currentDraft[clo.code]) || 0
    }))

    await UniversityService.saveNilaiBatch(studentGradesToSave)
    
    setInitialGrades(prev => ({
      ...prev,
      [studentId]: { ...currentDraft }
    }))

    setExpandedStudentId(null)
    showNotification("Perubahan nilai berhasil disimpan.", 'success')
  }

  const handleExportExcel = () => {
    showNotification("Data nilai mahasiswa berhasil diekspor ke format Excel.", 'success')
  }

  const showNotification = (msg: string, type: 'success' | 'warning') => {
    setNotification({ message: msg, type })
    setTimeout(() => setNotification(null), 4000)
    if (type === 'success') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchStudentQuery.toLowerCase()) || 
      s.nim.toLowerCase().includes(searchStudentQuery.toLowerCase())
    )
  }, [students, searchStudentQuery])

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) || 1
  const startIndex = filteredStudents.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)
  
  const displayedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredStudents.slice(start, end)
  }, [filteredStudents, currentPage])

  const getPaginationGroup = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }

  const handleGradeChange = (studentId: string, cloCode: string, value: string) => {
    if (value === '') {
      setDraftGrades(prev => ({...prev, [studentId]: {...prev[studentId], [cloCode]: ''}}))
      return
    }

    const numVal = parseInt(value, 10)
    if (!isNaN(numVal) && numVal >= 0 && numVal <= 100) {
      setDraftGrades(prev => ({...prev, [studentId]: {...prev[studentId], [cloCode]: numVal.toString()}}))
    }
  }

  if (!subjectData) return null

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative max-w-[1200px] mx-auto">
      
      {/* Toast Notification dengan Glow & Border Sesuai Tipe (Success = Hijau, Warning = Kuning) */}
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

      {/* Header Info & Back */}
      <button onClick={() => navigate('/university/manajemen-nilai')} className="flex items-center gap-2 text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition w-fit mb-1">
        <ArrowLeft size={16} strokeWidth={2.5} /> Kembali ke Daftar Mata Kuliah
      </button>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Subject Info */}
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
                <span className="flex items-center gap-1.5 text-[#5b6170]">
                  <GraduationCap size={16} strokeWidth={2.5} className="text-[#f59e0b]" /> 
                  Semester {subjectData.semester}
                </span>
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

        {/* Card 2: Total Students */}
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

      {/* Distribusi Bobot CLO Section */}
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-bold text-[#111827]">Distribusi Bobot CLO</h2>
            <p className="text-[13px] text-[#7b8191] mt-0.5">Matriks evaluasi yang dihitung untuk hasil pembelajaran kursus.</p>
          </div>
          <button onClick={handleEditBobotClick} className="flex items-center gap-1.5 text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] transition">
            <Edit2 size={14} strokeWidth={2.5} /> Edit Bobot
          </button>
        </div>

        {/* List Tampilan Bobot CLO */}
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

      {/* Daftar Nilai Siswa Table Section */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-hidden mt-2">
        
        {/* Toolbar: Search & Export */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-[#e4e9f4]">
          <h2 className="text-[16px] font-bold text-[#111827] whitespace-nowrap">Daftar Nilai Siswa</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            
            {/* Search Bar Mahasiswa */}
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

            {/* Tombol Export */}
            <button 
              onClick={handleExportExcel}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0f5ce0] text-white text-[13px] font-bold rounded-lg hover:bg-[#0d4ebf] transition-all shadow-sm"
            >
              <Download size={14} strokeWidth={2.5} /> Export Excel
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] uppercase tracking-widest">
                <th className="px-6 py-4 whitespace-nowrap">Nama & NIM Siswa</th>
                <th className="px-6 py-4 whitespace-nowrap">Nilai Akhir</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
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
                      {/* Main Row */}
                      <tr className={`transition ${isExpanded ? 'bg-[#fafbfe]' : 'hover:bg-[#fafbfe]'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full ${student.bgColor} flex items-center justify-center font-bold text-[13px]`}>
                              {student.initial}
                            </div>
                            <div>
                              <p className="text-[14px] font-bold text-[#111827]">{student.name}</p>
                              <p className="text-[12px] text-[#7b8191]">NIM: {student.nim}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-[16px] font-black text-[#111827]">{finalScore}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {status === 'Selesai' ? (
                            <span className="px-3 py-1.5 bg-[#e6f9f0] text-[#10b981] text-[10px] font-extrabold rounded uppercase tracking-wider">Selesai</span>
                          ) : (
                            <span className="px-3 py-1.5 bg-[#f1f4f9] text-[#7b8191] text-[10px] font-extrabold rounded uppercase tracking-wider">Tidak Lengkap</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {isExpanded ? (
                            <button 
                              onClick={() => handleSaveStudentGrades(student.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f5ce0] text-white text-[12px] font-bold rounded-lg hover:bg-[#0d4ebf] transition shadow-sm active:scale-95"
                            >
                              Simpan Perubahan
                            </button>
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

                      {/* Accordion Content (Matrix) */}
                      {isExpanded && (
                        <tr className="bg-[#fafbfe]">
                          <td colSpan={4} className="px-6 py-6 border-b-2 border-[#e4e9f4]">
                            <div className="flex flex-col gap-4">
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="text-[14px] font-bold text-[#111827]">Matrix Performa Individu</h3>
                                <button onClick={() => setExpandedStudentId(null)} className="text-[#7b8191] hover:text-[#111827] transition flex items-center gap-1 text-[12px] font-bold">
                                  Tutup Matrix <ChevronUp size={16} />
                                </button>
                              </div>

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
                                        value={draftGrades[student.id]?.[clo.code] !== undefined ? draftGrades[student.id]?.[clo.code] : ''}
                                        onChange={(e) => handleGradeChange(student.id, clo.code, e.target.value)}
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
                    Mahasiswa dengan kata kunci tersebut tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginasi Tersinkron - Teks di KIRI, Tombol di KANAN */}
        {filteredStudents.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm rounded-b-[16px] gap-4">
            
            {/* BAGIAN KIRI: Teks Informasi */}
            <div className="text-[13px] text-[#7b8191] font-medium text-center sm:text-left w-full sm:w-auto">
              Menampilkan <span className="text-[#111827] font-bold">{startIndex}-{endIndex}</span> dari <span className="text-[#111827] font-bold">{filteredStudents.length}</span> mahasiswa
            </div>

            {/* BAGIAN KANAN: Tombol Paginasi */}
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

      {/* --- MODAL POP-UP EDIT BOBOT DENGAN BACKDROP BLUR --- */}
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
                      value={draftWeights[clo.id] !== undefined ? draftWeights[clo.id] : ''}
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
                  className="px-5 py-2.5 text-[13px] font-bold text-[#5b6170] bg-white border border-[#e4e9f4] hover:bg-gray-50 rounded-xl transition"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveBobot}
                  disabled={totalDraftWeight !== 100}
                  className="px-5 py-2.5 text-[13px] font-bold text-white bg-[#0f5ce0] hover:bg-[#0d4ebf] disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CSS untuk menyembunyikan panah input number */}
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