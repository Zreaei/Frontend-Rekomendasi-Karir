import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatusPill from '../../components/common/StatusPill'
import { Link } from 'react-router-dom'
import { BadgeCheck, Clock3, Upload, XCircle } from 'lucide-react'

const certifications = [
	{
		id: 'advanced-machine-learning',
		name: 'Advanced Machine Learning',
		issuer: 'Stanford Online',
		date: 'June 2023',
		status: 'Terverifikasi',
		tone: 'success' as const,
		accent: 'bg-[#ecfff8] text-[#0f766e]',
		actionLabel: 'Lihat Dokumen',
		actionTo: '/student/certification/advanced-machine-learning',
		thumbnail: 'border-[#d8e5f7] bg-[linear-gradient(180deg,#fbfbfb_0%,#fff7ea_100%)]',
	},
	{
		id: 'data-visualization-specialist',
		name: 'Data Visualization Specialist',
		issuer: 'IBM Professional Data',
		date: 'Sept 2023',
		status: 'Diproses',
		tone: 'warning' as const,
		accent: 'bg-[#fff4e8] text-[#b45a00]',
		actionLabel: 'Lihat Dokumen',
		actionTo: '/student/certification/data-visualization-specialist',
		thumbnail: 'border-[#d8e5f7] bg-[linear-gradient(180deg,#e4f4ff_0%,#1167a8_100%)]',
	},
	{
		id: 'cloud-architecture-foundations',
		name: 'Cloud Architecture Foundations',
		issuer: 'AWS Certification',
		date: 'Oct 2023',
		status: 'Ditolak',
		tone: 'danger' as const,
		accent: 'bg-[#fff0f0] text-[#d92d20]',
		actionLabel: 'Lihat Alasan',
		actionTo: '/student/certification/cloud-architecture-foundations/denied',
		thumbnail: 'border-[#d8e5f7] bg-[linear-gradient(180deg,#4d4d4d_0%,#1b1b1b_100%)]',
	},
	{
		id: 'advanced-machine-learning-copy',
		name: 'Advanced Machine Learning',
		issuer: 'Stanford Online',
		date: 'June 2023',
		status: 'Terverifikasi',
		tone: 'success' as const,
		accent: 'bg-[#ecfff8] text-[#0f766e]',
		actionLabel: 'Lihat Dokumen',
		actionTo: '/student/certification/advanced-machine-learning',
		thumbnail: 'border-[#d8e5f7] bg-[linear-gradient(180deg,#fbfbfb_0%,#fff7ea_100%)]',
	},
	{
		id: 'data-visualization-specialist-copy',
		name: 'Data Visualization Specialist',
		issuer: 'IBM Professional Data',
		date: 'Sept 2023',
		status: 'Diproses',
		tone: 'warning' as const,
		accent: 'bg-[#fff4e8] text-[#b45a00]',
		actionLabel: 'Lihat Dokumen',
		actionTo: '/student/certification/data-visualization-specialist',
		thumbnail: 'border-[#d8e5f7] bg-[linear-gradient(180deg,#e4f4ff_0%,#1167a8_100%)]',
	},
	{
		id: 'cloud-architecture-foundations-copy',
		name: 'Cloud Architecture Foundations',
		issuer: 'AWS Certification',
		date: 'Oct 2023',
		status: 'Ditolak',
		tone: 'danger' as const,
		accent: 'bg-[#fff0f0] text-[#d92d20]',
		actionLabel: 'Lihat Alasan',
		actionTo: '/student/certification/cloud-architecture-foundations/denied',
		thumbnail: 'border-[#d8e5f7] bg-[linear-gradient(180deg,#4d4d4d_0%,#1b1b1b_100%)]',
	},
]

const StudentCertification = () => {
	const stats = [
		{ title: 'Terverifikasi', value: '12', icon: <BadgeCheck size={18} strokeWidth={2} />, tone: 'success' as const },
		{ title: 'Diproses', value: '3', icon: <Clock3 size={18} strokeWidth={2} />, tone: 'warning' as const },
		{ title: 'Ditolak', value: '1', icon: <XCircle size={18} strokeWidth={2} />, tone: 'danger' as const },
	]

	return (
		<StudentLayout>
			<SectionHeader
				title="Sertifikasi Akademik"
				description="Kelola sertifikat yang Anda unggah dan pantau status verifikasinya."
				action={
					<Link to="/student/certification/upload" className="inline-flex">
						<Button className="inline-flex items-center gap-2 text-sm" type="button">
						<Upload size={16} strokeWidth={2} aria-hidden="true" />
						Unggah Sertifikat Baru
						</Button>
					</Link>
				}
			/>

			<div className="grid gap-5 md:grid-cols-3">
				{stats.map((stat) => (
					<Card key={stat.title} className="flex items-center gap-4 p-4 shadow-sm">
						<div className={`grid h-11 w-11 place-items-center rounded-lg ${stat.tone === 'success' ? 'bg-[#ecfff8] text-[#0f766e]' : stat.tone === 'warning' ? 'bg-[#fff4e8] text-[#b45a00]' : 'bg-[#fff0f0] text-[#d92d20]'}`} aria-hidden="true">
							{stat.icon}
						</div>
						<div>
							<p className="text-[13px] uppercase tracking-wide text-[#5c6577]">{stat.title}</p>
							<p className="mt-1 text-[24px] font-bold leading-none text-[#050505]">{stat.value}</p>
						</div>
					</Card>
				))}
			</div>

			<Card className="p-0 shadow-sm">
				<div className="flex items-center justify-between gap-4 border-b border-[#d9dce2] px-6 py-4">
					<h2 className="text-[18px] font-bold text-[#1f2a44]">Daftar Sertifikat</h2>
					<div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#4f5a6d]">
						<span className="rounded-full bg-[#eef5ff] px-3 py-1 text-[#0d6efd]">All</span>
						<span>Terverifikasi</span>
						<span>Diproses</span>
						<span>Ditolak</span>
					</div>
				</div>

				<div className="grid gap-5 p-5 xl:grid-cols-3">
					{certifications.map((item) => (
						<Card key={item.id} className="overflow-hidden border border-[#d9dce2] shadow-none">
							<div className={`relative h-36 border-b border-[#d9dce2] ${item.thumbnail}`}>
								<div className={`absolute right-3 top-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.accent}`}>
									{item.status.toUpperCase()}
								</div>
								<div className="absolute inset-0 grid place-items-center">
									<div className="h-16 w-28 rounded-md border border-white/40 bg-white/40 backdrop-blur-[1px]" />
								</div>
							</div>
							<div className="p-4">
								<p className="text-[14px] font-semibold text-[#050505]">{item.name}</p>
								<p className="mt-1 text-[12px] text-[#4f5a6d]">{item.issuer} • {item.date}</p>
								<div className="mt-4 flex items-center justify-between gap-3">
									<Link to={item.actionTo} className="p-2 rounded text-[13px] font-semibold bg-[#0d6efd]">
										<span className="text-white">{item.actionLabel}</span>
									</Link>
									{item.status === 'Ditolak' ? (
										<Link to={item.actionTo}>
											<Button variant="ghost" type="button" className="text-xs">Unggah Ulang</Button>
										</Link>
									) : null}
								</div>
							</div>
						</Card>
					))}
				</div>
			</Card>
		</StudentLayout>
	)
}

export default StudentCertification
