import { MenuIcon, Moon, Sun } from 'lucide-react'
import { FullLogo } from './FullLogo.component'
import { useEffect, useState } from 'react'
import { Switch } from './ui/switch'

type ToggleMenuProps = {
	toggleMenu: () => void
}

export const SystemHeader = ({ toggleMenu }: ToggleMenuProps) => {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		return (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		)
	})

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [isDarkMode])

	return (
		<header className='flex h-16 items-center justify-between px-3'>
			<button onClick={toggleMenu}>
				<MenuIcon className='fill-foreground' />
			</button>
			<div className='flex items-center space-x-4'>
				<div className='flex items-center space-x-2'>
					<Sun className='h-4 w-4' />
					<Switch
						checked={isDarkMode}
						onCheckedChange={setIsDarkMode}
						aria-label='Cambiar modo oscuro'
					/>
					<Moon className='h-4 w-4' />
				</div>
				<FullLogo size='large' />
			</div>
		</header>
	)
}
