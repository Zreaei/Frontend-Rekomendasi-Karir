import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface HeaderProps {
  /** Tombol aksi di sisi kanan header, mis. notifikasi dan bantuan. */
  actions?: ReactNode
}

const Header = ({ actions }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between bg-white px-6 border-b border-[#d7dbe3]">
      <Link
        to="/"
        className="flex items-center transition-all duration-200 hover:opacity-80 active:scale-[0.98]"
      >
        <img
          src="/src/assets/header.png"
          alt="Talentry Logo"
          className="h-10 w-auto object-contain"
        />
      </Link>

      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  )
}

export default Header
