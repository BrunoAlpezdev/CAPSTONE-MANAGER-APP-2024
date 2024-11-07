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
				<div className='absolute z-10 flex h-[100dvh] w-[100dvw] items-center justify-center bg-background/80 backdrop-blur-md'>
					<div className='h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-Blanco'></div>
				</div>
			</ThemeProvider>
		)
	if (!user) return <AuthGuard></AuthGuard>
	return children
}
