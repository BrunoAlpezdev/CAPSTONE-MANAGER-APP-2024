'use client'

import { ReactNode } from 'react'
import { useUser } from '@/firebase/auth'
/* import AuthGuard from '@/components/auth/authGuard.component' */
import { BeatLoader } from 'react-spinners'
import '@/styles/authGuard.css'
import { redirect } from 'next/navigation'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components'
import AuthGuard from '@/components/auth/authGuard.component'

export default function Layout({ children }: { children: ReactNode }) {
	const user = useUser()

	if (user === false)
		return (
			<ThemeProvider>
				<div className='authValidation'>
					<BeatLoader color='#008cff' loading margin={18} size={45} />
				</div>
			</ThemeProvider>
		)
	if (!user) return <AuthGuard></AuthGuard>
	return children
}
