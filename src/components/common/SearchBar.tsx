import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
}

const SearchBar = ({ placeholder = 'Search roles, skills, or companies' }: SearchBarProps) => {
  return (
    <div className="flex h-10 items-center gap-2.5 rounded-lg border border-[#aeb4bf] bg-white px-4 py-2">
      <Search className="h-[15px] w-[15px] text-[#6d6f78]" aria-hidden="true" strokeWidth={2} />
      <input className="w-full border-none bg-transparent text-[13px] outline-none" type="text" placeholder={placeholder} />
    </div>
  )
}

export default SearchBar
