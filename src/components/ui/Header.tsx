import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center bg-white px-6 py-4 shadow-sm border-b border-[#e4e9f4]">
      <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
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