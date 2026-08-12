import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import {
	Building2,
	CheckCircle2,
	ClipboardList,
	Search,
	Star,
} from 'lucide-react'
import { studentInvitationApi, type MyInvitation } from '../../services/student.service'

const formatRelative = (value?: string | null) => {
	if (!value) return '-'
	const diffMs = Date.now() - new Date(value).getTime()
	const hours = Math.floor(diffMs / (1000 * 60 * 60))
	if (hours < 1) return 'Diterima baru saja'
	if (hours < 24) return `Diterima ${hours} jam yang lalu`
	const days = Math.floor(hours / 24)
	return `Diterima ${days} hari yang lalu`
}

const STATUS_LABEL: Record<string, string> = {
	accepted: 'Undangan diterima',
	declined: 'Undangan ditolak',
	cancelled: 'Dibatalkan perusahaan',
}

const StudentInvitation = () => {
	const [invitations, setInvitations] = useState<MyInvitation[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [respondingId, setRespondingId] = useState<string | null>(null)

	useEffect(() => {
		let aktif = true
		studentInvitationApi
			.listMine()
			.then((data) => { if (aktif) setInvitations(data) })
			.catch(() => { if (aktif) setError('Gagal memuat undangan.') })
			.finally(() => { if (aktif) setLoading(false) })
		return () => { aktif = false }
	}, [])

	const respond = async (invitation: MyInvitation, action: 'accept' | 'decline') => {
		setRespondingId(invitation.id)
		try {
			await studentInvitationApi.respond(invitation.id, action)
			setInvitations((prev) =>
				prev.map((inv) =>
					inv.id === invitation.id ? { ...inv, status: action === 'accept' ? 'accepted' : 'declined' } : inv,
				),
			)
		} catch (err: any) {
			alert(err?.response?.data?.message ?? 'Gagal merespons undangan.')
		} finally {
			setRespondingId(null)
		}
	}

	return (
		<StudentLayout>
			<div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-bold leading-tight">Undangan Rekrutmen</h1>
          <p className="mt-2 max-w-2xl text-[16px] leading-relaxed ">
            Daftar undangan eksklusif dari HR perusahaan yang tertarik dengan profil Anda.
          </p>
        </div>
      </div>

			{loading ? (
				<Card className="p-6 text-[14px] text-[#5c6577] shadow-sm">Memuat undangan...</Card>
			) : error ? (
				<Card className="p-6 text-[14px] text-[#d92d20] shadow-sm">{error}</Card>
			) : (
				<div className="grid gap-5 xl:grid-cols-3">
					{invitations.map((invitation) => (
						<Card key={invitation.id} className="p-5 shadow-sm">
							<div className="flex items-start justify-between gap-4">
								<div className="flex items-start gap-3">
									<div className="grid h-10 w-10 place-items-center rounded-md bg-[#eef5ff] text-[#0d6efd]" aria-hidden="true">
										<Building2 size={18} strokeWidth={2} />
									</div>
									<div>
										<h3 className="text-[16px] font-bold text-[#050505]">{invitation.company?.name ?? 'Perusahaan'}</h3>
										<p className="mt-1 text-[13px] font-semibold text-[#0d6efd]">{invitation.job?.title ?? '-'}</p>
									</div>
								</div>
								{invitation.matchScore != null ? (
									<span className="inline-flex items-center gap-1 rounded-full bg-[#ecfff8] px-2.5 py-1 text-[11px] font-semibold text-[#0f766e]">
										<Star size={12} fill="currentColor" strokeWidth={2} aria-hidden="true" />
										{Math.round(invitation.matchScore)}% Match
									</span>
								) : null}
							</div>

							<div className="mt-4 flex items-center justify-between gap-3 text-[12px] text-[#4f5a6d]">
								<span className="inline-flex items-center gap-1.5">
									<ClipboardList size={14} strokeWidth={2} aria-hidden="true" />
									{invitation.job?.department ?? invitation.job?.type ?? '-'}
								</span>
								<span>{formatRelative(invitation.created_at)}</span>
							</div>

							{invitation.message ? (
								<div className="mt-4 rounded-lg border-l-4 border-[#0d6efd] bg-[#eef5ff] px-4 py-4 text-[13px] leading-relaxed text-[#2b3343]">
									<p className="italic">"{invitation.message}"</p>
								</div>
							) : null}

							{invitation.status === 'pending' ? (
								<div className="mt-4 flex items-center gap-3">
									<Button
										className="flex-1 inline-flex items-center justify-center gap-2 text-sm"
										type="button"
										disabled={respondingId === invitation.id}
										onClick={() => respond(invitation, 'accept')}
									>
										<CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
										{respondingId === invitation.id ? 'Memproses...' : 'Terima Undangan'}
									</Button>
									<Button
										className="text-sm"
										variant="ghost"
										type="button"
										disabled={respondingId === invitation.id}
										onClick={() => respond(invitation, 'decline')}
									>
										Tolak
									</Button>
								</div>
							) : (
								<p className={`mt-4 text-[13px] font-semibold ${invitation.status === 'accepted' ? 'text-[#0f766e]' : 'text-[#5c6577]'}`}>
									{STATUS_LABEL[invitation.status] ?? invitation.status}
								</p>
							)}
						</Card>
					))}

					<Card className="grid place-items-center border-dashed border-[#c9d2e4] bg-[#f6f8ff] p-6 text-center shadow-sm xl:col-span-1">
						<div>
							<div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#0d6efd] shadow-sm" aria-hidden="true">
								<Search size={28} strokeWidth={2} />
							</div>
							<h3 className="mt-5 text-[18px] font-bold text-[#050505]">
								{invitations.length === 0 ? 'Belum ada undangan' : 'Ingin lebih banyak undangan?'}
							</h3>
							<p className="mt-3 text-[13px] leading-relaxed text-[#5c6577]">
								Lengkapi sertifikasi dan portfolio Anda untuk menarik perhatian lebih banyak HR perusahaan terkemuka.
							</p>
							<Link to="/student/competency-profile">
								<Button variant="ghost" className="mt-5 text-[#0d6efd] text-sm" type="button">
									Perbarui Profil Sekarang
								</Button>
							</Link>
						</div>
					</Card>
				</div>
			)}
		</StudentLayout>
	)
}

export default StudentInvitation
