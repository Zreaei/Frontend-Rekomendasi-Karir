import { CheckCircle2, AlertTriangle, X } from 'lucide-react'

export interface ToastData {
  message: string
  type: 'success' | 'warning'
}

interface ToastProps {
  notification: ToastData | null
  onClose: () => void
}

const Toast = ({ notification, onClose }: ToastProps) => {
  if (!notification) return null

  const isSuccess = notification.type === 'success'

  return (
    <div
      className={`fixed top-8 right-8 z-[9999] flex items-start gap-4 p-4 bg-white border rounded-xl w-full max-w-[420px] transform transition-all animate-in slide-in-from-top-10 fade-in duration-500 ease-out overflow-hidden shadow-2xl ${
        isSuccess ? 'border-[#10b981]/40 border-l-4 border-l-[#10b981]' : 'border-[#f59e0b]/40 border-l-4 border-l-[#f59e0b]'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSuccess ? 'bg-[#e6f9f0]' : 'bg-[#fffbeb]'}`}>
        {isSuccess ? <CheckCircle2 size={22} className="text-[#10b981]" /> : <AlertTriangle size={22} className="text-[#f59e0b]" />}
      </div>
      <div className="flex-1 pt-0.5">
        <h3 className="text-[14px] font-bold text-[#111827]">{isSuccess ? 'Berhasil!' : 'Perhatian'}</h3>
        <p className="text-[13px] text-[#5b6170] mt-1 leading-relaxed">{notification.message}</p>
      </div>
      <button onClick={onClose} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1 shrink-0">
        <X size={18} />
      </button>
    </div>
  )
}

export default Toast