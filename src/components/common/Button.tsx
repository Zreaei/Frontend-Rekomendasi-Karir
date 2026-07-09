import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'ghost'
}

const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
	const variantClass =
		variant === 'ghost'
			? 'border border-[#d9dce2] bg-white text-[#050505]'
			: 'bg-[#0d6efd] text-white'

	return (
		<button
			{...props}
			className={`rounded-[5px] px-[18px] py-2.5 font-semibold transition-transform hover:-translate-y-px ${variantClass} ${className}`.trim()}
		/>
	)
}

export default Button
