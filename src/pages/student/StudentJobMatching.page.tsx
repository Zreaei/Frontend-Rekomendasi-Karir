import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import SearchBar from '../../components/common/SearchBar'
import FilterPill from '../../components/common/FilterPill'
import JobCard from '../../components/common/JobCard'
import { Code2, Monitor, Smartphone } from 'lucide-react'

const StudentJobMatching = () => {
  const filters = ['Jenis', 'Bidang', 'Lokasi']

  const jobs = [
    {
      title: 'Android Developer',
      category: 'Android',
      icon: <Smartphone size={20} strokeWidth={2} />,
      tags: ['Dart', 'Widgets', 'Android Studio'],
      location: 'Bandung',
      type: 'Part-Time',
      salary: 'Rp 3-4 jt',
      posted: '3 hari lalu',
    },
    {
      title: 'Fullstack Developer',
      category: 'Website',
      icon: <Monitor size={20} strokeWidth={2} />,
      tags: ['React', 'CSS', 'Typescript', 'PostgreSQL'],
      location: 'Jakarta',
      type: 'Full-Time',
      salary: 'Rp 7-10 jt',
      posted: '5 hari lalu',
    },
    {
      title: 'DevOps Engineer',
      category: 'Automation, Monitoring',
      icon: <Code2 size={20} strokeWidth={2} />,
      tags: ['Docker', 'Github', 'Jenkins'],
      location: 'Surabaya',
      type: 'Full-Time',
      salary: 'Rp 4-5 jt',
      posted: '7 hari lalu',
    },
  ]

  return (
    <StudentLayout>
      <SectionHeader
        title="Job Matching"
        description="Rekomendasi lowongan pekerjaan berdasarkan kompetensi Anda"
      />

      <div className="grid gap-4">
        <SearchBar placeholder="Search" />
        <div className="flex flex-wrap gap-2.5">
          {filters.map((filter) => (
            <FilterPill key={filter} label={filter} caret />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10 max-[960px]:grid-cols-1">
        {jobs.map((job) => (
          <JobCard key={job.title} {...job} />
        ))}
      </div>
    </StudentLayout>
  )
}

export default StudentJobMatching
