import { X } from 'lucide-react'
import { MENUPAGES } from '@/data/consts'
import Link from 'next/link'
import { createElement } from 'react'

type ToggleMenuProps = {
	isMenuOpen: boolean
	toggleMenu: () => void
}

/* El div contenedor de este menú DEBE ser relativo */
export function ToggleMenu({ isMenuOpen, toggleMenu }: ToggleMenuProps) {
	return (
		<div
			className={`fixed left-0 top-0 h-full w-64 bg-background/75 backdrop-blur-sm p-4 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
			{/* Menú Sidebar */}
			<button className='absolute top-4 right-4' onClick={toggleMenu}>
				<X className='h-6 w-6' />
				<span className='sr-only'>Close menu</span>
			</button>
			<nav className='flex flex-col gap-3 mt-16 transition-all'>
				{MENUPAGES.map(({ title, icon, href }) => (
					<Link
						key={title}
						href={href}
						className='w-full grid grid-cols-3 items-center gap-3 transition-all hover:bg-foreground/20 p-2 rounded-lg'>
						<div className='place-self-center col-span-1'>
							{createElement(icon)}
						</div>
						<span className='place-content-start col-span-2'>{title}</span>
					</Link>
				))}
			</nav>
		</div>
	)
}
