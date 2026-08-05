import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, BookOpen, CheckCircle2, ClipboardList, RotateCcw } from 'lucide-react'
import { UniversityService, type Subject, type NilaiMahasiswa, type Student, type SubjectCLO } from './UniversityData'

const UniversityManajemenNilai = () => {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [allGrades, setAllGrades] = useState<NilaiMahasiswa[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [allClos, setAllClos] = useState<SubjectCLO[]>([])

  const loadData = async () => {
    const subData = await UniversityService.getSubjects()
    const gradeData = await UniversityService.getAllNilai()
    const studData = await UniversityService.getStudents()
    
    let cloData: SubjectCLO[] = []
    for (const sub of subData) {
      const clos = await UniversityService.getCLOsBySubject(sub.id)
      cloData = [...cloData, ...clos]
    }

    setSubjects(subData)
    setAllGrades(gradeData)
    setStudents(studData)
    setAllClos(cloData)
  }

  useEffect(() => {
    loadData()
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('Semua Semester')
  const [statusFilter, setStatusFilter] = useState('Semua Status')
  
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const availableSemesters = useMemo(() => Array.from(new Set(subjects.map(s => s.semester))).sort(), [subjects])
  
  const getDynamicStatus = (subjectName: string, subjectId: string) => {
    const courseClos = allClos.filter(c => c.subjectId === subjectId)
    if (courseClos.length === 0 || students.length === 0) return 'WAITING REVIEW'

    const courseGrades = allGrades.filter(g => g.course === subjectName)
    if (courseGrades.length === 0) return 'WAITING REVIEW'

    let isAllComplete = true
    let hasAnyGrade = false

    students.forEach(student => {
      courseClos.forEach(clo => {
        const found = courseGrades.find(g => g.studentId === student.id && g.code === clo.code && g.score > 0)
        if (found) {
          hasAnyGrade = true
        } else {
          isAllComplete = false
        }
      })
    })

    if (isAllComplete) return 'COMPLETED'
    if (hasAnyGrade) return 'IN PROGRESS'
    return 'WAITING REVIEW'
  }

  const subjectsWithStatus = useMemo(() => {
    return subjects.map(s => ({ 
      ...s, 
      gradingStatus: getDynamicStatus(s.name, s.id) 
    }))
  }, [subjects, allGrades, students, allClos])

  const availableStatuses = useMemo(() => Array.from(new Set(subjectsWithStatus.map(s => s.gradingStatus))).sort(), [subjectsWithStatus])

  const dynamicStats = useMemo(() => {
    const total = subjectsWithStatus.length;
    if (total === 0) return { activeCourses: 0, completionRate: '0%', needsVerification: 0 };

    const completedCount = subjectsWithStatus.filter(s => s.gradingStatus === 'COMPLETED').length;
    const reviewCount = subjectsWithStatus.filter(s => s.gradingStatus === 'WAITING REVIEW').length;
    const percentage = Math.round((completedCount / total) * 100);

    return {
      activeCourses: total,
      completionRate: `${percentage}%`,
      needsVerification: reviewCount
    };
  }, [subjectsWithStatus]);

  const filteredSubjects = useMemo(() => {
    return subjectsWithStatus.filter((subject) => {
      const matchSemester = semesterFilter === 'Semua Semester' || subject.semester.toString() === semesterFilter
      const matchStatus = statusFilter === 'Semua Status' || subject.gradingStatus === statusFilter
      
      const searchLower = searchQuery.toLowerCase()
      const matchSearch = subject.name.toLowerCase().includes(searchLower) || subject.code.toLowerCase().includes(searchLower)
      
      return matchSemester && matchStatus && matchSearch
    })
  }, [subjectsWithStatus, semesterFilter, statusFilter, searchQuery])

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

  const resetFilters = () => {
    setSearchQuery('')
    setSemesterFilter('Semua Semester')
    setStatusFilter('Semua Status')
    setCurrentPage(1)
  }

  const isFilterActive = searchQuery !== '' || semesterFilter !== 'Semua Semester' || statusFilter !== 'Semua Status'

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'IN PROGRESS':
        return 'text-[#0f5ce0] bg-[#eef4ff]'
      case 'COMPLETED':
        return 'text-[#10b981] bg-[#e6f9f0]'
      case 'WAITING REVIEW':
        return 'text-[#f59e0b] bg-[#fffbeb]'
      default:
        return 'text-[#7b8191] bg-[#f8faff]'
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">Manajemen Nilai</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#f4f7ff] text-[#0f5ce0] flex items-center justify-center border border-[#eef2ff]">
            <BookOpen size={16} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#a0a6b5] uppercase tracking-widest">Mata Kuliah Aktif</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1">{dynamicStats.activeCourses}</p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] text-[#10b981] flex items-center justify-center border border-[#e6f9f0]">
            <CheckCircle2 size={16} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#a0a6b5] uppercase tracking-widest">Penilaian Selesai</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1">{dynamicStats.completionRate}</p>
          </div>
        </div>

        <div className="bg-white rounded-[16px] border border-[#e4e9f4] p-6 shadow-sm flex flex-col gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#fef2f2] text-red-500 flex items-center justify-center border border-[#fee2e2]">
            <ClipboardList size={16} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#a0a6b5] uppercase tracking-widest">Perlu Verifikasi</p>
            <p className="text-[32px] font-black text-[#111827] leading-none mt-1">{dynamicStats.needsVerification}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 border-b border-[#e4e9f4]">
          <h2 className="text-[16px] font-bold text-[#111827] whitespace-nowrap">Daftar Mata Kuliah</h2>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-[220px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" size={14} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari Mata Kuliah"
                className="w-full pl-9 pr-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm"
              />
            </div>

            <div className="relative">
              <select 
                value={semesterFilter}
                onChange={(e) => { setSemesterFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 pr-9 border border-[#e4e9f4] rounded-lg text-[13px] text-[#5b6170] font-semibold bg-white hover:bg-gray-50 focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer shadow-sm min-w-[140px]"
              >
                <option value="Semua Semester">Semua Semester</option>
                {availableSemesters.map(s => <option key={s} value={s.toString()}>Semester {s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2.5 pr-9 border border-[#e4e9f4] rounded-lg text-[13px] text-[#5b6170] font-semibold bg-white hover:bg-gray-50 focus:outline-none focus:border-[#0f5ce0] transition appearance-none cursor-pointer shadow-sm min-w-[140px]"
              >
                <option value="Semua Status">Semua Status</option>
                {availableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7b8191] pointer-events-none" />
            </div>

            {isFilterActive && (
              <button 
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-bold text-[#111827] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw size={14} strokeWidth={2.5} /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] uppercase tracking-widest">
                <th className="px-6 py-5 whitespace-nowrap">Kode</th>
                <th className="px-6 py-5 whitespace-nowrap">Nama Mata Kuliah</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">SKS</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Jumlah CLO</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Semester</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Status</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e9f4]">
              {displayedSubjects.length > 0 ? (
                displayedSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-[#fafbfe] transition group">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-[13px] font-black text-[#0f5ce0] tracking-wide">{subject.code}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-[13px] font-bold text-[#111827]">{subject.name}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className="text-[13px] font-bold text-[#5b6170]">{subject.sks}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className="text-[13px] font-bold text-[#5b6170]">{subject.cloCount}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className="text-[13px] font-bold text-[#5b6170]">{subject.semester}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center justify-center w-[130px] px-2.5 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-wider ${getStatusStyle(subject.gradingStatus)}`}>
                        {subject.gradingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <button 
                        onClick={() => navigate(`/university/kelola-nilai/${subject.id}`, { state: { subjectData: subject } })}
                        className="px-5 py-2 bg-[#0f5ce0] text-white text-[12px] font-bold rounded-lg hover:bg-[#0d4ebf] transition-all shadow-sm active:scale-95"
                      >
                        Kelola Nilai
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-[#a0a6b5] font-medium">
                    Tidak ada mata kuliah yang sesuai dengan filter atau pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredSubjects.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm rounded-b-[16px] gap-4">
            
            {/* BAGIAN KIRI: Teks Informasi */}
            <div className="text-[13px] text-[#7b8191] font-medium text-center sm:text-left w-full sm:w-auto">
              Menampilkan <span className="text-[#111827] font-bold">{startIndex}-{endIndex}</span> dari <span className="text-[#111827] font-bold">{filteredSubjects.length}</span> matakuliah
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
    </div>
  )
}

export default UniversityManajemenNilai