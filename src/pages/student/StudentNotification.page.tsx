import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell } from 'lucide-react'

const StudentNotification = () => {
  const navigate = useNavigate()
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/student')
  }

  return (
    <main className="min-h-screen bg-[#fbfbfc] px-6 py-8">
      <button
        className="flex fixed top-8 left-8 py-2 items-center gap-2 rounded-md border border-[#d9dce5] bg-white px-3 text-[14px] font-semibold text-[#232342] shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition-colors hover:bg-[#f4f6fb]"
        type="button"
        onClick={handleBack}
      >
        <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
      </button>

      <section className="mx-auto w-full max-w-[530px]">
        <div className="mb-9">
          <h1 className="text-[30px] font-bold leading-tight text-[#050505]">Notifikasi</h1>
          <p className="mt-2 text-[16px] leading-relaxed text-[#232342]">
            Ikuti perkembangan lamaran, undangan, dan aktivitas akun Anda.
          </p>
        </div>

        <div className="rounded-2xl bg-white px-6 py-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="flex items-center justify-between gap-4 border-b border-[#dedede] pb-4">
            <div className="flex items-center gap-6 text-[14px] font-semibold text-[#232342]">
              <button
                className="border-none bg-transparent p-0 font-bold text-[#050505]"
                type="button"
              >
                Semua
              </button>
              <button
                className="border-none bg-transparent p-0 font-medium text-[#232342]"
                type="button"
              >
                Belum Dibaca (0)
              </button>
            </div>
            <button
              className="border-none bg-transparent p-0 text-[12px] font-medium text-[#5f5f73]"
              type="button"
            >
              Tandai semua dibaca
            </button>
          </div>

          <div className="grid min-h-[220px] place-items-center text-center">
            <div>
              <Bell
                className="mx-auto text-[#6f7787]"
                size={40}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <p className="mt-4 text-[16px] font-medium text-[#232342]">Belum ada notifikasi.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default StudentNotification
