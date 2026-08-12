interface TagProps {
  label: string
}

const Tag = ({ label }: TagProps) => {
  return (
    <span className="inline-flex h-6 min-w-[58px] items-center justify-center rounded-full bg-[#b9d9ff] px-2.5 text-xs font-bold text-[#0d5bd7]">
      {label}
    </span>
  )
}

export default Tag
