import type { LucideIcon } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  icon: LucideIcon
  title: string
  message: React.ReactNode
  confirmLabel: string
  cancelLabel?: string
  tone?: 'danger' | 'primary' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

const toneStyles = {
  danger: {
    iconWrap: 'bg-[#fef2f2] border-[#fecaca]',
    icon: 'text-[#ef4444]',
    confirmButton: 'bg-[#ef4444] hover:bg-[#dc2626] text-white',
  },
  primary: {
    iconWrap: 'bg-[#eef4ff] border-[#d0e0ff]',
    icon: 'text-[#0f5ce0]',
    confirmButton: 'bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white',
  },
  warning: {
    iconWrap: 'bg-[#fffbeb] border-[#fde68a]',
    icon: 'text-[#f59e0b]',
    confirmButton: 'bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white',
  },
}

const ConfirmModal = ({ isOpen, icon: Icon, title, message, confirmLabel, cancelLabel = 'Batal', tone = 'danger', onConfirm, onCancel }: ConfirmModalProps) => {
  if (!isOpen) return null

  const style = toneStyles[tone]

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] w-full max-w-[450px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-center pb-8 border border-[#e4e9f4]">
        <div className="pt-8 pb-5 flex justify-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center border-[6px] ${style.iconWrap}`}>
            <Icon size={36} className={style.icon} strokeWidth={2.5} />
          </div>
        </div>
        <div className="px-8 space-y-3">
          <h2 className="text-[20px] font-bold text-[#111827]">{title}</h2>
          <p className="text-[14px] text-[#5b6170] leading-relaxed">{message}</p>
        </div>
        <div className="px-8 mt-8 flex items-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-[14px] font-bold text-[#5b6170] hover:bg-[#f1f4f9] rounded-xl transition-colors border border-[#e4e9f4]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-[14px] font-bold rounded-xl transition-colors shadow-sm ${style.confirmButton}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
