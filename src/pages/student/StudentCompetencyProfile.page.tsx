import StudentLayout from '../../layouts/StudentLayout'
import StatCard from '../../components/common/StatCard'
import { FileText, GraduationCap, Star, User } from 'lucide-react'
import SectionHeader from '../../components/common/SectionHeader'

const StudentCompetencyProfile = () => {
  const profileFields = [
    { label: 'NAMA LENGKAP', value: 'Gregorius Christian Sunaryo' },
    { label: 'NIM', value: '2301122' },
    { label: 'IPK', value: '3.99' },
    { label: 'FAKULTAS', value: 'UPI Cibiru' },
    { label: 'EMAIL', value: 'gchristian10@gmail.com' },
    { label: 'STATUS', value: 'Aktif' },
    { label: 'PROGRAM STUDI', value: 'Rekayasa Perangkat Lunak' },
    { label: 'ANGKATAN', value: '2023' },
  ]

  const stats = [
    { title: 'Mata Kuliah', value: '5', icon: <Star size={18} strokeWidth={2} /> },
    { title: 'Total CLO', value: '13', icon: <GraduationCap size={18} strokeWidth={2} /> },
    { title: 'Rata-rata Nilai', value: '87', icon: <FileText size={18} strokeWidth={2} /> },
    { title: 'Total SKS', value: '53', icon: <FileText size={18} strokeWidth={2} /> },
  ]

  const semesters = ['Semua', 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5']

  const courses = [
    { code: 'PBO', name: 'Pemrograman Berorientasi Objek', semester: '3', sks: '3', clo: '2/3', value: 'Dalam Review' },
    { code: 'BD', name: 'Basis Data', semester: '4', sks: '3', clo: '1/3', value: 'Ditolak' },
    { code: 'JK', name: 'Jaringan Komputer', semester: '5', sks: '2', clo: '2/4', value: 'Diterima' },
  ]

  return (
    <StudentLayout>
      <SectionHeader
        title="Profil Kompetensi Pengguna"
        description="Informasi pengguna, data akademik, dan capaian pembelajaran mata kuliah"
      />
      <div className="space-y-10">
        <section className="grid bg-white p-6 rounded-xl shadow-sm grid-cols-[170px_minmax(0,1fr)] items-start gap-8 max-[960px]:grid-cols-1">
          <div className="flex h-42.5 w-42.5 items-center justify-center rounded-sm bg-[#0d6efd] text-white">
            <User size={50} strokeWidth={2} />
          </div>

          <div className="grid grid-cols-3 gap-x-10 gap-y-8 max-[960px]:grid-cols-2 max-sm:grid-cols-1">
            {profileFields.map((field) => (
              <div key={field.label} className="space-y-1.5">
                <p className="text-[13px] font-medium uppercase text-[#1f1f1f]">{field.label}</p>
                <p className="text-[16px] font-semibold leading-tight text-[#050505]">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-4 gap-4 max-[960px]:grid-cols-2">
          {stats.map((stat) => (
            <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
          ))}
        </div>

        <section className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-18 overflow-x-auto border-b border-[#0d6efd] pb-4 text-[15px] text-[#050505]">
            {semesters.map((semester, index) => (
              <button
                key={semester}
                className={`whitespace-nowrap border-none bg-transparent px-0 py-0 ${
                  index === 0 ? 'font-semibold' : 'font-normal'
                }`}
                type="button"
              >
                {semester}
              </button>
            ))}
            <span className="text-xl leading-none text-[#5c5c5c]">...</span>
            <span className="text-xl leading-none text-[#5c5c5c]">&raquo;</span>
          </div>

          <div className="grid gap-5">
            <div className="grid grid-cols-[100px_minmax(0,1.8fr)_0.8fr_0.55fr_0.6fr_1fr] gap-6 text-[14px] font-bold uppercase text-[#050505] max-lg:grid-cols-2 max-sm:grid-cols-1">
              <span>Kode</span>
              <span>Mata Kuliah</span>
              <span>Semester</span>
              <span>SKS</span>
              <span>CLO</span>
              <span>Nilai</span>
            </div>

            {courses.map((course) => (
              <div
                key={course.code}
                className="grid grid-cols-[100px_minmax(0,1.8fr)_0.8fr_0.55fr_0.6fr_1fr] items-start gap-6 text-[13px] text-[#050505] max-lg:grid-cols-2 max-sm:grid-cols-1"
              >
                <span className="font-semibold">{course.code}</span>
                <span>{course.name}</span>
                <span>{course.semester}</span>
                <span>{course.sks}</span>
                <span className="font-semibold">{course.clo}</span>
                <span>{course.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </StudentLayout>
  )
}

export default StudentCompetencyProfile
