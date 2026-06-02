import type { ReactNode } from 'react'

interface CardProps {
	children: ReactNode
	className?: string
}

const Card = ({ children, className = '' }: CardProps) => {
	return <div className={`rounded-md border border-[#d9dce2] bg-white ${className}`.trim()}>{children}</div>
}

export default Card
