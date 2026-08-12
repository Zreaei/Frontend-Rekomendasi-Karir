import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { BadgeCheck, Clock3, Upload, XCircle } from 'lucide-react'
import { studentCertificateApi, type MyCertificate } from '../../services/student.service'

type FilterKey = 'all' | 'approved' | 'pending' | 'rejected'

const STATUS_VIEW: Record<string, { label: string; accent: string }> = {
	approved: { label: 'Terverifikasi', accent: 'bg-[#ecfff8] text-[#0f766e]' },
	pending: { label: 'Diproses', accent: 'bg-[#fff4e8] text-[#b45a00]' },
	rejected: { label: 'Ditolak', accent: 'bg-[#fff0f0] text-[#d92d20]' },
}

const THUMBNAILS = [
	'border-[#d8e5f7] bg-[linear-gradient(180deg,#fbfbfb_0%,#fff7ea_100%)]',
	'border-[#d8e5f7] bg-[linear-gradient(180deg,#e4f4ff_0%,#1167a8_100%)]',
	'border-[#d8e5f7] bg-[linear-gradient(180deg,#4d4d4d_0%,#1b1b1b_100%)]',
]

const formatDate = (value?: string | null) => {
	if (!value) return '-'
	return new Date(value).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}

const StudentCertification = () => {
	const [certificates, setCertificates] = useState<MyCertificate[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [filter, setFilter] = useState<FilterKey>('all')

	useEffect(() => {
		let aktif = true
		studentCertificateApi
			.listMine()
			.then((data) => { if (aktif) setCertificates(data) })
			.catch(() => { if (aktif) setError('Gagal memuat daftar sertifikat.') })
			.finally(() => { if (aktif) setLoading(false) })
		return () => { aktif = false }
	}, [])

	const approved = certificates.filter((c) => c.status === 'approved').length
	const pending = certificates.filter((c) => c.status === 'pending').length
	const rejected = certificates.filter((c) => c.status === 'rejected').length

	const stats = [
		{ title: 'Terverifikasi', value: String(approved), icon: <BadgeCheck size={18} strokeWidth={2} />, tone: 'success' as const },
		{ title: 'Diproses', value: String(pending), icon: <Clock3 size={18} strokeWidth={2} />, tone: 'warning' as const },
		{ title: 'Ditolak', value: String(rejected), icon: <XCircle size={18} strokeWidth={2} />, tone: 'danger' as const },
	]

	const filters: { key: FilterKey; label: string }[] = [
		{ key: 'all', label: 'All' },
		{ key: 'approved', label: 'Terverifikasi' },
		{ key: 'pending', label: 'Diproses' },
		{ key: 'rejected', label: 'Ditolak' },
	]

	const visible = filter === 'all' ? certificates : certificates.filter((c) => c.status === filter)

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
							<p className="mt-1 text-[24px] font-bold leading-none text-[#050505]">{loading ? '...' : stat.value}</p>
						</div>
					</Card>
				))}
			</div>

			<Card className="p-0 shadow-sm">
				<div className="flex items-center justify-between gap-4 border-b border-[#d9dce2] px-6 py-4">
					<h2 className="text-[18px] font-bold text-[#1f2a44]">Daftar Sertifikat</h2>
					<div className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[#4f5a6d]">
						{filters.map((f) => (
							<button
								key={f.key}
								type="button"
								className={`rounded-full px-3 py-1 transition-colors ${filter === f.key ? 'bg-[#eef5ff] text-[#0d6efd]' : 'hover:text-[#0d6efd]'}`}
								onClick={() => setFilter(f.key)}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>

				{loading ? (
					<div className="p-6 text-[14px] text-[#5c6577]">Memuat sertifikat...</div>
				) : error ? (
					<div className="p-6 text-[14px] text-[#d92d20]">{error}</div>
				) : visible.length === 0 ? (
					<div className="p-6 text-[14px] text-[#5c6577]">
						{certificates.length === 0
							? 'Belum ada sertifikat. Unggah sertifikat pertama Anda untuk memperkuat profil kompetensi.'
							: 'Tidak ada sertifikat dengan status ini.'}
					</div>
				) : (
					<div className="grid gap-5 p-5 xl:grid-cols-3">
						{visible.map((item, index) => {
							const view = STATUS_VIEW[item.status] ?? { label: item.status, accent: 'bg-[#eef1f6] text-[#4f5a6d]' }
							const isRejected = item.status === 'rejected'
							return (
								<Card key={item.id} className="overflow-hidden border border-[#d9dce2] shadow-none">
									<div className={`relative h-36 border-b border-[#d9dce2] ${THUMBNAILS[index % THUMBNAILS.length]}`}>
										<div className={`absolute right-3 top-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${view.accent}`}>
											{view.label.toUpperCase()}
										</div>
										<div className="absolute inset-0 grid place-items-center">
											<div className="h-16 w-28 rounded-md border border-white/40 bg-white/40 backdrop-blur-[1px]" />
										</div>
									</div>
									<div className="p-4">
										<p className="text-[14px] font-semibold text-[#050505]">{item.title}</p>
										<p className="mt-1 text-[12px] text-[#4f5a6d]">{item.issuer ?? '-'} • {formatDate(item.issuedAt ?? item.created_at)}</p>
										<div className="mt-4 flex items-center justify-between gap-3">
											<Link
												to={isRejected ? `/student/certification/${item.id}/denied` : `/student/certification/${item.id}`}
												className="p-2 rounded text-[13px] font-semibold bg-[#0d6efd]"
											>
												<span className="text-white">{isRejected ? 'Lihat Alasan' : 'Lihat Dokumen'}</span>
											</Link>
											{isRejected ? (
												<Link to="/student/certification/upload">
													<Button variant="ghost" type="button" className="text-xs">Unggah Ulang</Button>
												</Link>
											) : null}
										</div>
									</div>
								</Card>
							)
						})}
					</div>
				)}
			</Card>
		</StudentLayout>
	)
}

export default StudentCertification
