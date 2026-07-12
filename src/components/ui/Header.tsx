import { NavLink } from 'react-router-dom'
import { Bell, CircleQuestionMark } from 'lucide-react'

const Header = () => {
	const actionClass =
		'grid h-9 w-9 place-items-center rounded-full border border-[#d9dce2] bg-white text-[#232342] transition-colors hover:bg-[#f4f6fb]'

	return (
		<header className="sticky top-0 z-20 flex items-center justify-end gap-2 border-b border-[#d9dce2] bg-[#f7f8fc] px-4 py-2.5">
			<NavLink className={actionClass} to="/student/notification" aria-label="Notifications">
				<Bell size={18} strokeWidth={2} aria-hidden="true" />
			</NavLink>
			<NavLink className={actionClass} to="/student/help" aria-label="Help">
				<CircleQuestionMark size={18} strokeWidth={2} aria-hidden="true" />
			</NavLink>
		</header>
	)
}

export default Header