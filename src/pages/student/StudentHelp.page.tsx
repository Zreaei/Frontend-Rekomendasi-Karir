import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bot,
  Building2,
  LifeBuoy,
  Rocket,
  Search,
} from 'lucide-react'

const helpTopics = [
  {
    title: 'Tentang CareerSync',
    description: 'Pelajari profil, rekomendasi karir, privasi, dan keamanan akun Anda.',
    icon: Bot,
    bg: 'bg-[#f4efff]',
    color: 'text-[#363070]',
  },
  {
    title: 'Menggunakan CareerSync',
    description: 'Temukan cara memakai job matching, lamaran, dan profil kompetensi.',
    icon: Rocket,
    bg: 'bg-[#ffecef]',
    color: 'text-[#2b2332]',
  },
  {
    title: 'Administrasi Akun',
    description: 'Kelola data mahasiswa, dokumen, dan pengaturan akun pribadi.',
    icon: Building2,
    bg: 'bg-[#ecfff8]',
    color: 'text-[#1f524b]',
  },
  {
    title: 'Troubleshooting',
    description: 'Cari solusi untuk kendala login, unggah berkas, dan status lamaran.',
    icon: LifeBuoy,
    bg: 'bg-[#f6f4ec]',
    color: 'text-[#4b4532]',
  },
]

const StudentHelp = () => {
  const navigate = useNavigate()
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/student')
  }

  return (
    <main className="min-h-screen bg-white">
      <button
        className="flex fixed top-8 left-8 py-2 items-center gap-2 rounded-md border border-[#d9dce5] bg-white px-3 text-[14px] font-semibold text-[#232342] shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition-colors hover:bg-[#f4f6fb]"
        type="button"
        onClick={handleBack}
      >
        <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
      </button>

      <section className="bg-[#f0eefc] px-14 pb-16 pt-8">
        <div className="relative mx-auto text-center">
          <h1 className="mt-10 text-[30px] font-bold leading-tight text-[#050505]">
            Butuh bantuan?
          </h1>
          <div className="mx-auto mt-5 flex h-11 max-w-[435px] items-center gap-3 rounded-md bg-white px-4 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
            <Search className="text-[#9a9aaa]" size={18} strokeWidth={1.8} aria-hidden="true" />
            <input
              className="h-full min-w-0 flex-1 border-none bg-transparent text-[13px] text-[#232342] outline-none placeholder:text-[#9a9aaa]"
              placeholder="Search for help"
              type="search"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[760px] grid-cols-2 gap-x-10 gap-y-8 pt-2 max-[860px]:grid-cols-1">
        {helpTopics.map((topic) => {
          const Icon = topic.icon

          return (
            <article
              className="grid min-h-[145px] place-items-center border border-transparent bg-white px-8 py-8 text-center shadow-[0_14px_34px_rgba(15,23,42,0.05)]"
              key={topic.title}
            >
              <div className={`grid h-14 w-14 place-items-center rounded-full ${topic.bg}`}>
                <Icon className={topic.color} size={30} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <div className="mt-4">
                <h2 className="text-[13px] font-bold text-[#050505]">{topic.title}</h2>
                <p className="mt-2 text-[12px] leading-relaxed text-[#5f5f73]">{topic.description}</p>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}

export default StudentHelp
