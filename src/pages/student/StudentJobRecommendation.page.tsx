import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Tag from '../../components/common/Tag'
import { Link } from 'react-router-dom'
import {
  Filter,
  Monitor,
  Smartphone,
  Shield,
} from 'lucide-react'

const StudentJobMatching = () => {
  const featuredJob = {
    id: 'junior-full-stack-engineer',
    match: '98%',
    title: 'Junior Full-Stack Engineer',
    company: 'NovaStream Tech',
    location: 'Jakarta, Indonesia (Remote)',
    type: 'Full-time',
    tags: ['React', 'Node.js', 'AWS', '+2 keahlian lainnya'],
    description:
      'Bergabunglah dengan tim teknik kami yang berkembang pesat untuk membangun masa depan data streaming. Anda akan berkolaborasi dengan pengembang senior untuk meluncurkan fitur-fitur berkualitas tinggi yang digunakan oleh jutaan orang.',
    icon: <Shield size={20} strokeWidth={2} />,
  }

  const jobs = [
    {
      id: 'junior-frontend-engineer',
      title: 'Frontend Developer',
      company: 'TechStream Systems',
      location: 'New York (Remote)',
      type: 'Full-time',
      match: '98%',
      icon: <Smartphone size={18} strokeWidth={2} />,
      tags: ['React', 'Tailwind', 'TypeScript'],
    },
    {
      id: 'ux-research-intern',
      title: 'UX Research Intern',
      company: 'FinGlobal Solutions',
      location: 'San Francisco',
      type: 'Part-time',
      match: '94%',
      icon: <Monitor size={18} strokeWidth={2} />,
      tags: ['User Interviews', 'Figma', 'Testing'],
    },
    {
      id: 'python-developer',
      title: 'Python Developer',
      company: 'EcoScale AI Studio',
      location: 'Austin, Texas',
      type: 'Full-time',
      match: '91%',
      icon: <Monitor size={18} strokeWidth={2} />,
      tags: ['Python', 'Django', 'PostgreSQL'],
    },
  ]

  return (
    <StudentLayout>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <SectionHeader
            title="Rekomendasi Pekerjaan Terbaik untuk Anda"
            description="Lowongan dipilih berdasarkan profil, riwayat akademik, dan kecocokan skill."
          />
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_auto]">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#eef5ff] text-[#0d6efd]" aria-hidden="true">
                {featuredJob.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-[#e7f7f4] px-3 py-1 text-[12px] font-semibold text-[#0f766e]">
                      {featuredJob.match} Match
                    </span>
                    <h2 className="mt-3 text-[26px] font-bold leading-tight text-[#050505]">{featuredJob.title}</h2>
                    <button className="mt-1 text-left text-[14px] font-semibold text-[#0d6efd] hover:underline" type="button">
                      {featuredJob.company}
                    </button>
                    <p className="mt-1 text-[14px] text-[#4f5a6d]">{featuredJob.location}</p>
                  </div>

                  <Button className="whitespace-nowrap" type="button">
                    Lamar Sekarang
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  {featuredJob.tags.map((tag) => (
                    <span key={tag} className="bg-[#63a2ff] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-4 max-w-4xl text-[14px] leading-relaxed text-[#4f5a6d]">{featuredJob.description}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <SectionHeader title="Rekomendasi Lainnya" />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {jobs.concat(jobs).map((job, index) => (
          <Card key={`${job.id}-${index}`} className="p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-[5px] bg-[#0d6efd] text-white" aria-hidden="true">
                  {job.icon}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#050505]">{job.title}</h3>
                  <p className="mt-1 text-[13px] text-[#4f5a6d]">
                    {job.company} • {job.location}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-[#e7f7f4] px-2.5 py-1 text-[11px] font-semibold text-[#0f766e]">
                {job.match} Match
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {job.tags.map((tag) => (
                <span key={tag} className="bg-[#63a2ff] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <Link
              className="mt-6 flex h-10 w-full items-center justify-center rounded-[5px] bg-[#0d6efd] px-4.5 py-2.5 text-[14px] font-semibold text-white transition-transform hover:-translate-y-px"
              to={`/student/job-matching/${job.id}`}
            >
              <span className="text-white">Lihat Detail</span>
            </Link>
          </Card>
        ))}
      </div>
    </StudentLayout>
  )
}

export default StudentJobMatching
