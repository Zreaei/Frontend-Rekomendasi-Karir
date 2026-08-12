import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Link } from 'react-router-dom'
import {
  Bookmark,
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
      title: 'Junior Frontend Engineer',
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
      company: 'EcoScale AI',
      location: 'Austin, TX',
      type: 'Full-time',
      match: '91%',
      icon: <Monitor size={18} strokeWidth={2} />,
      tags: ['Python', 'Django', 'PostgreSQL'],
    },
    {
      id: 'python-developer-2',
      title: 'Python Developer',
      company: 'EcoScale AI',
      location: 'Austin, TX',
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
          <h1 className="text-[30px] font-bold leading-tight">Rekomendasi Pekerjaan</h1>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed ">
            Cari Rekomendasi pekerjaan yang sesuai dengan profil kompetensi dan minat Anda
          </p>
        </div>
      </div>

      <Card className="overflow-hidden shadow-sm">
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[10px] border border-[#d7dbe3] bg-[#f7f9fc] text-[#0d6efd] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]" aria-hidden="true">
                {featuredJob.icon}
              </div>

              <div className="min-w-0">
                <span className="inline-flex items-center rounded-full bg-[#8bf0c5] px-3 py-1 text-[12px] font-semibold text-[#0f766e]">
                  {featuredJob.match} Match
                </span>
                <h2 className="mt-3 text-[18px] font-semibold leading-tight text-[#111827] md:text-[20px]">
                  {featuredJob.title}
                </h2>
                <button className="mt-0.5 text-left text-[13px] font-medium text-[#4b5563] hover:text-[#0d6efd]" type="button">
                  {featuredJob.company} • {featuredJob.location}
                </button>

                <div className="mt-3 flex flex-wrap gap-2.5">
                  {featuredJob.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-[5px] bg-[#dbe4f0] px-2.5 py-1 text-[11px] font-medium text-[#586271]">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="mt-3 max-w-5xl text-[12px] leading-normal text-[#5f6675] md:text-[13px]">
                  {featuredJob.description}
                </p>
              </div>
            </div>

            <button className="rounded-md p-1.5 text-[#111827] transition-colors hover:bg-[#f3f4f6] hover:text-[#0d6efd]" type="button" aria-label="Simpan lowongan">
              <Bookmark size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-end rounded-b-lg border-t border-[#dbe2ee] bg-[#edf3ff] px-4 py-3 md:px-5">
            <Button className="h-9 min-w-29.5 rounded-md px-4 text-[13px] font-semibold shadow-none" type="button">
              Lamar Sekarang
            </Button>
          </div>
        </div>
      </Card>

      <SectionHeader title="Rekomendasi Lainnya" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.concat(jobs).map((job, index) => (
          <Card key={`${job.id}-${index}`} className="p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="p-2.5 border rounded-md">
                  {job.icon}
                </div>

                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold leading-tight text-[#111827]">{job.title}</h3>
                  <p className="mt-1 text-[12px] text-[#5b6472]">
                    {job.company} • {job.location}
                  </p>
                </div>
              </div>

              <span className="whitespace-nowrap text-[11px] font-medium text-[#24856c]">{job.match}% Match</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-sm bg-[#eef1f6] px-2.5 py-1 text-[11px] font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Link
                className="flex h-10 flex-1 items-center justify-center rounded-[5px] bg-[#0d5bd7] px-4 text-[13px] text-white! font-semibold transition-colors hover:bg-[#0b4fbf]"
                to={`/student/job-matching/${job.id}`}
              >
                Lihat Detail
              </Link>

              <button
                className="grid w-10 h-10 shrink-0 place-items-center rounded-[5px] border-2 border-[#0d5bd7] text-[#0d5bd7] transition-colors hover:bg-[#edf4ff]"
                type="button"
                aria-label={`Simpan ${job.title}`}
              >
                <Bookmark size={20} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </StudentLayout>
  )
}

export default StudentJobMatching
