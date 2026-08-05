import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center bg-white px-6 shadow-sm border-b border-gray-200">
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
    </header>
  )
}

export default Header