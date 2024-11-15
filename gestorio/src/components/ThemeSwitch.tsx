'use client'
import { Moon, Sun } from 'lucide-react'
import { Switch } from './ui/switch'
import { useEffect, useState } from 'react'

export const ThemeSwitch = () => {
	// Estado para el modo oscuro
	const [isDarkMode, setIsDarkMode] = useState(() => {
		return (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		)
	})

	// Efecto para aplicar el modo oscuro
	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleChange = (e: MediaQueryListEvent) => {
			setIsDarkMode(e.matches)
		}

		// Escucha los cambios en el modo oscuro del sistema
		mediaQuery.addEventListener('change', handleChange)

		// Limpia el listener al desmontar el componente
		return () => {
			mediaQuery.removeEventListener('change', handleChange)
		}
	}, [])

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [isDarkMode])
	return (
		<div className='flex items-center space-x-2'>
			<Sun className='h-4 w-4 text-foreground' />
			<Switch
				checked={isDarkMode}
				onCheckedChange={setIsDarkMode}
				aria-label='Cambiar modo oscuro'
			/>
			<Moon className='h-4 w-4 text-foreground' />
		</div>
	)
}
