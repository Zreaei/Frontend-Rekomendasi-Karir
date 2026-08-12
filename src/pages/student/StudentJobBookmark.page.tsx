import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Link } from 'react-router-dom'
import {
	Bookmark,
	Code2,
	Database,
	Layers3,
	PenTool,
	Search,
	ShieldCheck,
} from 'lucide-react'

const savedJobs = [
	{
		id: 'senior-product-designer',
		title: 'Senior Product Designer',
		company: 'Nexus Tech',
		location: 'Jakarta (Remote)',
		match: '98%',
		tags: ['Figma', 'Prototyping', 'B2B SaaS'],
		icon: <PenTool size={16} strokeWidth={2} />,
		iconTone: 'bg-[#eef0f4] text-[#4d596b]',
	},
	{
		id: 'backend-developer-intern-1',
		title: 'Backend Developer (Intern)',
		company: 'FinGo Finance',
		location: 'Tangerang Selatan',
		match: '92%',
		tags: ['Go', 'PostgreSQL', 'Docker'],
		icon: <Code2 size={16} strokeWidth={2} />,
		iconTone: 'bg-[#eef0f4] text-[#4d596b]',
	},
	{
		id: 'backend-developer-intern-2',
		title: 'Backend Developer (Intern)',
		company: 'FinGo Finance',
		location: 'Tangerang Selatan',
		match: '92%',
		tags: ['Go', 'PostgreSQL', 'Docker'],
		icon: <Code2 size={16} strokeWidth={2} />,
		iconTone: 'bg-[#eef0f4] text-[#4d596b]',
	},
	{
		id: 'devops-engineer',
		title: 'DevOps Engineer',
		company: 'CloudScale',
		location: 'Singapore (Remote)',
		match: '85%',
		tags: ['AWS', 'Terraform', 'Kubernetes'],
		icon: <Layers3 size={16} strokeWidth={2} />,
		iconTone: 'bg-[#eef0f4] text-[#4d596b]',
	},
	{
		id: 'ml-engineer-1',
		title: 'ML Engineer',
		company: 'Lumina AI',
		location: 'Bandung',
		match: '90%',
		tags: ['PyTorch', 'NLP', 'Scikit-Learn'],
		icon: <ShieldCheck size={16} strokeWidth={2} />,
		iconTone: 'bg-[#eef0f4] text-[#4d596b]',
	},
	{
		id: 'ml-engineer-2',
		title: 'ML Engineer',
		company: 'Lumina AI',
		location: 'Bandung',
		match: '90%',
		tags: ['PyTorch', 'NLP', 'Scikit-Learn'],
		icon: <ShieldCheck size={16} strokeWidth={2} />,
		iconTone: 'bg-[#eef0f4] text-[#4d596b]',
	},
	{
		id: 'data-analyst-1',
		title: 'Data Analyst',
		company: 'GreenWave Energy',
		location: 'Jakarta',
		match: '78%',
		tags: ['Python', 'Tableau', 'SQL'],
		icon: <Database size={16} strokeWidth={2} />,
		iconTone: 'bg-[#eef0f4] text-[#4d596b]',
	},
	{
		id: 'data-analyst-2',
		title: 'Data Analyst',
		company: 'GreenWave Energy',
		location: 'Jakarta',
		match: '78%',
		tags: ['Python', 'Tableau', 'SQL'],
		icon: <Database size={16} strokeWidth={2} />,
		iconTone: 'bg-[#eef0f4] text-[#4d596b]',
	},
]

const savedJobsCount = savedJobs.length

const StudentJobBookmark = () => {
	return (
		<StudentLayout>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold leading-tight">Pekerjaan Tersimpan</h1>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed ">
            Daftar pekerjaan yang telah Anda simpan untuk referensi dan pertimbangan di masa depan.
          </p>
        </div>
      </div>

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
				{savedJobs.map((job) => (
					<Card key={job.id} className="overflow-hidden shadow-sm">
						<div className="p-4 pb-3">
							<div className="flex items-start justify-between gap-3">
								<div className="flex min-w-0 items-start gap-3">
									<div className={`grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-[#d8dde8] ${job.iconTone}`} aria-hidden="true">
										{job.icon}
									</div>

									<div className="min-w-0">
										<h3 className="truncate text-[14px] font-semibold leading-tight text-[#2a2f39]">
											{job.title}
										</h3>
										<p className="mt-0.5 truncate text-[11px] text-[#6b7280]">
											{job.company} • {job.location}
										</p>
									</div>
								</div>

								<button
									className="rounded-sm p-0.5 text-[#0d5bd7] transition-colors hover:bg-[#edf4ff]"
									type="button"
									aria-label={`Simpan ${job.title}`}
								>
									<Bookmark size={15} fill="currentColor" strokeWidth={2} aria-hidden="true" />
								</button>
							</div>

							<div className="mt-3 flex flex-wrap gap-1.5">
								{job.tags.map((tag) => (
									<span key={tag} className="inline-flex items-center rounded-full bg-[#eef0f4] px-2 py-0.5 text-[10px] text-[#697180]">
										{tag}
									</span>
								))}
							</div>
						</div>

						<div className="border-t border-[#eceff4] px-4 py-3">
							<div className="flex items-center justify-between gap-3">
								<span className="text-[12px] font-semibold text-[#0f7b5f]">{job.match} Match</span>

								<div className="flex items-center gap-3">
									<Link className="text-[12px] font-medium border p-2 rounded-md text-[#0d5bd7]! hover:text-[#0d5bd7]" to={`/student/job-matching/${job.id}`}>
										Lihat Detail
									</Link>

									<Button className="rounded-md text-[12px] font-semibold shadow-none" type="button">
										Lamar Sekarang
									</Button>
								</div>
							</div>
						</div>
					</Card>
				))}

				<Card className="flex min-h-44.75 items-center justify-center border-dashed border-[#d6d9e1] bg-[#fafbfe] shadow-none">
					<div className="flex max-w-55 flex-col items-center text-center">
						<div className="grid h-10 w-10 place-items-center rounded-full bg-[#f0f3f7] text-[#aab2bf]">
							<Search size={26} strokeWidth={1.8} aria-hidden="true" />
						</div>

						<h3 className="text-[15px] font-semibold text-[#6a7280]">Cari Lowongan Lainnya</h3>
						<p className="mt-1 text-[12px] leading-snug text-[#9298a4]">
							Temukan lebih banyak peluang karir yang sesuai dengan profil Anda.
						</p>

						<Button variant="ghost" className="mt-4 rounded-md px-4 text-[12px] font-semibold text-[#0d5bd7]" type="button">
							Jelajahi Karir
						</Button>
					</div>
				</Card>
			</div>

			<div className="sr-only">Total saved jobs: {savedJobsCount}</div>
		</StudentLayout>
	)
}

export default StudentJobBookmark
