import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { MailCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { authApi } from '../services/api.service'

const VerifyRecoveryEmailPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Tautan tidak valid. Kirim ulang verifikasi dari halaman pengaturan akun.')
      return
    }

    let aktif = true
    authApi
      .verifyRecoveryEmail(token)
      .then(() => {
        if (!aktif) return
        setStatus('success')
      })
      .catch((err: any) => {
        if (!aktif) return
        setStatus('error')
        setMessage(
          err?.response?.data?.message ??
            'Tautan tidak valid atau sudah kedaluwarsa. Kirim ulang dari halaman pengaturan akun.',
        )
      })

    return () => { aktif = false }
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8faff] px-4">
      <div className="w-full max-w-md bg-white rounded-[24px] border border-[#e4e9f4] shadow-sm p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center mx-auto mb-5">
              <Loader2 size={26} className="animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-[#111827]">Memverifikasi email pemulihan...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={26} />
            </div>
            <h1 className="text-xl font-bold text-[#111827]">Email Pemulihan Terverifikasi</h1>
            <p className="text-sm text-[#5b6170] mt-2">
              Mulai sekarang tautan pemulihan kata sandi juga dikirim ke alamat ini —
              berguna bila email utama Anda sudah tidak aktif.
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={26} />
            </div>
            <h1 className="text-xl font-bold text-[#111827]">Verifikasi Gagal</h1>
            <p className="text-sm text-[#5b6170] mt-2">{message}</p>
          </>
        )}

        {status !== 'loading' && (
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 mt-6 px-6 py-3 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-sm font-bold rounded-xl transition shadow-md active:scale-95"
          >
            <MailCheck size={16} />
            Ke Halaman Masuk
          </Link>
        )}
      </div>
    </div>
  )
}

export default VerifyRecoveryEmailPage