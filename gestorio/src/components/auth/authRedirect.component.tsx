import { HOME_ROUTE } from '@/lib/routes'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import '@/styles/authGuard.css'
import { useEffect } from 'react'
import { ThemeProvider } from '../ThemeProvider'

export default function AuthRedirect() {
	const pathname = usePathname()

	useEffect(() => {
		redirect(HOME_ROUTE)
	}, [])

	return (
		<>
			<ThemeProvider>
				<div className='absolute z-10 flex h-[100dvh] w-[100dvw] items-center justify-center bg-background/80 backdrop-blur-md'>
					<div className='h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-Blanco'></div>
				</div>
			</ThemeProvider>
		</>
	)
}
