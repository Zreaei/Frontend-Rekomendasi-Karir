import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
}

const Input = ({ label, id, ...props }: InputProps) => {
	return (
		<label className="grid gap-1.5 text-sm text-[#6d6f78]" htmlFor={id}>
			{label ? <span>{label}</span> : null}
			<input className="rounded-[10px] border border-[#d9dce2] bg-white px-3 py-2.5" id={id} {...props} />
		</label>
	)
}

export default Input
