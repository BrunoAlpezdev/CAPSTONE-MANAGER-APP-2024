'use client'

import { ReactNode } from 'react'
import { useUser } from '@/firebase/auth'
/* import AuthGuard from '@/components/auth/authGuard.component' */
/* import { BeatLoader } from 'react-spinners' */
import '@/styles/authGuard.css'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components'
import AuthGuard from '@/components/auth/authGuard.component'

export default function Layout({ children }: { children: ReactNode }) {
	const user = useUser()

	if (user === false)
		return (
			<ThemeProvider>
				<div className='absolute bg-background/80 backdrop-blur-md w-[100dvw] h-[100dvh] flex items-center justify-center z-10'>
					<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-Blanco'></div>
				</div>
			</ThemeProvider>
		)
	if (!user) return <AuthGuard></AuthGuard>
	return children
}
