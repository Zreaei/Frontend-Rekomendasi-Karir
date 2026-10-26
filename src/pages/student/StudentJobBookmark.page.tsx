import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Bookmark, Building2, Search } from 'lucide-react'
import {
	studentFavoriteApi,
	studentApplicationApi,
	type FavoriteJob,
} from '../../services/student.service'

const StudentJobBookmark = () => {
	const navigate = useNavigate()
	const [favorites, setFavorites] = useState<FavoriteJob[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [applyingId, setApplyingId] = useState<string | null>(null)

	useEffect(() => {
		let aktif = true
		studentFavoriteApi
			.list()
			.then((data) => { if (aktif) setFavorites(data) })
			.catch(() => { if (aktif) setError('Gagal memuat pekerjaan tersimpan.') })
			.finally(() => { if (aktif) setLoading(false) })
		return () => { aktif = false }
	}, [])

	const removeFavorite = async (jobId: string) => {
		const prev = favorites
		setFavorites((f) => f.filter((item) => item.job.id !== jobId))
		try {
			await studentFavoriteApi.remove(jobId)
		} catch {
			setFavorites(prev)
		}
	}

	const applyToJob = async (jobId: string) => {
		setApplyingId(jobId)
		try {
			await studentApplicationApi.apply(jobId)
			navigate('/student/job-apply')
		} catch (err: any) {
			alert(err?.response?.data?.message ?? 'Gagal mengirim lamaran.')
		} finally {
			setApplyingId(null)
		}
	}

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

			{loading ? (
				<Card className="p-6 text-[14px] text-[#5c6577] shadow-sm">Memuat pekerjaan tersimpan...</Card>
			) : error ? (
				<Card className="p-6 text-[14px] text-[#d92d20] shadow-sm">{error}</Card>
			) : (
				<div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
					{favorites.map((fav) => (
						<Card key={fav.job.id} className="overflow-hidden shadow-sm">
							<div className="p-4 pb-3">
								<div className="flex items-start justify-between gap-3">
									<div className="flex min-w-0 items-start gap-3">
										<div className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-[#d8dde8] bg-[#eef0f4] text-[#4d596b]" aria-hidden="true">
											<Building2 size={16} strokeWidth={2} />
										</div>

										<div className="min-w-0">
											<h3 className="truncate text-[14px] font-semibold leading-tight text-[#2a2f39]">
												{fav.job.title}
											</h3>
											<p className="mt-0.5 truncate text-[11px] text-[#6b7280]">
												{fav.job.company?.name ?? '-'} • {fav.job.location ?? '-'}
											</p>
										</div>
									</div>

									<button
										className="rounded-sm p-0.5 text-[#0d5bd7] transition-colors hover:bg-[#edf4ff]"
										type="button"
										aria-label={`Hapus ${fav.job.title} dari tersimpan`}
										onClick={() => removeFavorite(fav.job.id)}
									>
										<Bookmark size={15} fill="currentColor" strokeWidth={2} aria-hidden="true" />
									</button>
								</div>

								<div className="mt-3 flex flex-wrap gap-1.5">
									{fav.job.department ? (
										<span className="inline-flex items-center rounded-full bg-[#eef0f4] px-2 py-0.5 text-[10px] text-[#697180]">
											{fav.job.department}
										</span>
									) : null}
									{fav.job.type ? (
										<span className="inline-flex items-center rounded-full bg-[#eef0f4] px-2 py-0.5 text-[10px] text-[#697180]">
											{fav.job.type}
										</span>
									) : null}
									{fav.job.status && fav.job.status !== 'active' ? (
										<span className="inline-flex items-center rounded-full bg-[#fff0f0] px-2 py-0.5 text-[10px] text-[#d92d20]">
											Lowongan ditutup
										</span>
									) : null}
								</div>
							</div>

							<div className="border-t border-[#eceff4] px-4 py-3">
								<div className="flex items-center justify-end gap-3">
									<Link className="text-[12px] font-medium border p-2 rounded-md text-[#0d5bd7]! hover:text-[#0d5bd7]" to={`/student/job-matching/${fav.job.id}`}>
										Lihat Detail
									</Link>

									<Button
										className="rounded-md text-[12px] font-semibold shadow-none"
										type="button"
										disabled={applyingId === fav.job.id || fav.job.status !== 'active'}
										onClick={() => applyToJob(fav.job.id)}
									>
										{applyingId === fav.job.id ? 'Mengirim...' : 'Lamar Sekarang'}
									</Button>
								</div>
							</div>
						</Card>
					))}

					<Card className="flex min-h-44.75 items-center justify-center border-dashed border-[#d6d9e1] bg-[#fafbfe] shadow-none">
						<div className="flex max-w-55 flex-col items-center text-center">
							<div className="grid h-10 w-10 place-items-center rounded-full bg-[#f0f3f7] text-[#aab2bf]">
								<Search size={26} strokeWidth={1.8} aria-hidden="true" />
							</div>

							<h3 className="text-[15px] font-semibold text-[#6a7280]">
								{favorites.length === 0 ? 'Belum ada pekerjaan tersimpan' : 'Cari Lowongan Lainnya'}
							</h3>
							<p className="mt-1 text-[12px] leading-snug text-[#9298a4]">
								Temukan lebih banyak peluang karir yang sesuai dengan profil Anda.
							</p>

							<Link to="/student/job-matching">
								<Button variant="ghost" className="mt-4 rounded-md px-4 text-[12px] font-semibold text-[#0d5bd7]" type="button">
									Jelajahi Karir
								</Button>
							</Link>
						</div>
					</Card>
				</div>
			)}
		</StudentLayout>
	)
}

export default StudentJobBookmark
