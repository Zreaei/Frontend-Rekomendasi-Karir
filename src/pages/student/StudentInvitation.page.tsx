import StudentLayout from '../../layouts/StudentLayout'
import SectionHeader from '../../components/common/SectionHeader'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import {
	Building2,
	CheckCircle2,
	ClipboardList,
	Filter,
	Search,
	Star,
} from 'lucide-react'

const invitations = [
	{
		company: 'Nexus Digital',
		role: 'Senior Product Designer',
		received: 'Diterima 2 jam yang lalu',
		match: '96%',
		quote:
			'Kami melihat portfolio Anda dan sangat terkesan dengan keahlian UI/UX Anda, terutama pada studi kasus FinTrack App. Kami yakin pengalaman Anda sangat relevan dengan visi tim desain kami.',
		author: 'Sarah Wijaya, Talent Acquisition',
		accent: 'bg-[#ecfff8] text-[#0f766e]',
	},
	{
		company: 'Artha Bank',
		role: 'Full Stack Developer',
		received: 'Diterima 1 hari yang lalu',
		match: '92%',
		quote:
			'Kami sedang mencari talenta muda berbakat yang memiliki dasar kuat di React dan Node.js. Profil akademis dan proyek terbuka Anda menarik perhatian tim engineering kami.',
		author: 'Budi Santoso, Engineering Manager',
		accent: 'bg-[#ecfff8] text-[#0f766e]',
	},
	{
		company: 'Skyrocket Solutions',
		role: 'Junior Data Analyst',
		received: 'Diterima 3 hari yang lalu',
		match: '89%',
		quote:
			'Kemampuan Anda dalam pengolahan data Python dan visualisasi menggunakan Tableau sangat impresif. Kami mengundang Anda untuk bergabung dalam program pengembangan karir kami.',
		author: 'Jessica Lee, Head of HR',
		accent: 'bg-[#ecfff8] text-[#0f766e]',
	},
	{
		company: 'Skyrocket Solutions',
		role: 'Junior Data Analyst',
		received: 'Diterima 3 hari yang lalu',
		match: '89%',
		quote:
			'Kemampuan Anda dalam pengolahan data Python dan visualisasi menggunakan Tableau sangat impresif. Kami mengundang Anda untuk bergabung dalam program pengembangan karir kami.',
		author: 'Jessica Lee, Head of HR',
		accent: 'bg-[#ecfff8] text-[#0f766e]',
	},
	{
		company: 'Nexus Digital',
		role: 'Senior Product Designer',
		received: 'Diterima 2 jam yang lalu',
		match: '96%',
		quote:
			'Kami melihat portfolio Anda dan sangat terkesan dengan keahlian UI/UX Anda, terutama pada studi kasus FinTrack App. Kami yakin pengalaman Anda sangat relevan dengan visi tim desain kami.',
		author: 'Sarah Wijaya, Talent Acquisition',
		accent: 'bg-[#ecfff8] text-[#0f766e]',
	},
]

const StudentInvitation = () => {
	return (
		<StudentLayout>
			<SectionHeader
				title="Undangan Rekrutmen"
				description="Daftar undangan eksklusif dari HR perusahaan yang tertarik dengan profil Anda. Peluang karir ini dikurasi berdasarkan kecocokan skill dan preferensi Anda."
			/>

			<div className="grid gap-5 xl:grid-cols-3">
				{invitations.map((invitation, index) => (
					<Card key={`${invitation.company}-${invitation.role}-${index}`} className="p-5 shadow-sm">
						<div className="flex items-start justify-between gap-4">
							<div className="flex items-start gap-3">
								<div className="grid h-10 w-10 place-items-center rounded-md bg-[#eef5ff] text-[#0d6efd]" aria-hidden="true">
									<Building2 size={18} strokeWidth={2} />
								</div>
								<div>
									<h3 className="text-[16px] font-bold text-[#050505]">{invitation.company}</h3>
									<p className="mt-1 text-[13px] font-semibold text-[#0d6efd]">{invitation.role}</p>
								</div>
							</div>
							<span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${invitation.accent}`}>
								<Star size={12} fill="currentColor" strokeWidth={2} aria-hidden="true" />
								{invitation.match} Match
							</span>
						</div>

						<div className="mt-4 flex items-center justify-between gap-3 text-[12px] text-[#4f5a6d]">
							<span className="inline-flex items-center gap-1.5">
								<ClipboardList size={14} strokeWidth={2} aria-hidden="true" />
								{invitation.role}
							</span>
							<span>{invitation.received}</span>
						</div>

						<div className="mt-4 rounded-lg border-l-4 border-[#0d6efd] bg-[#eef5ff] px-4 py-4 text-[13px] leading-relaxed text-[#2b3343]">
							<p className="italic">"{invitation.quote}"</p>
							<p className="mt-3 text-[12px] font-medium text-[#4f5a6d]">- {invitation.author}</p>
						</div>

						<div className="mt-4 flex items-center gap-3">
							<Button className="flex-1 inline-flex items-center justify-center gap-2 text-sm" type="button">
								<CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
								Terima Undangan
							</Button>
							<Button className="text-sm" variant="ghost" type="button">
								Tolak
							</Button>
						</div>
					</Card>
				))}

				<Card className="grid place-items-center border-dashed border-[#c9d2e4] bg-[#f6f8ff] p-6 text-center shadow-sm xl:col-span-1">
					<div>
						<div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[#0d6efd] shadow-sm" aria-hidden="true">
							<Search size={28} strokeWidth={2} />
						</div>
						<h3 className="mt-5 text-[18px] font-bold text-[#050505]">Ingin lebih banyak undangan?</h3>
						<p className="mt-3 text-[13px] leading-relaxed text-[#5c6577]">
							Lengkapi sertifikasi dan portfolio Anda untuk menarik perhatian lebih banyak HR perusahaan terkemuka.
						</p>
						<Button variant="ghost" className="mt-5 text-[#0d6efd] text-sm" type="button">
							Perbarui Profil Sekarang
						</Button>
					</div>
				</Card>
			</div>
		</StudentLayout>
	)
}

export default StudentInvitation
