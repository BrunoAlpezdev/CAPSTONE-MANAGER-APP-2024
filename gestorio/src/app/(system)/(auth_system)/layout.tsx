'use client'

import { ReactNode } from 'react'
import { useUser } from '@/firebase/auth'
import AuthGuard from '@/components/auth/authGuard.component'
import { BeatLoader } from 'react-spinners'
import '@/styles/authGuard.css'

export default function Layout({ children }: { children: ReactNode }) {
	const user = useUser()

	if (user === false)
		return (
			<div className='authValidation'>
				<BeatLoader color='#008cff' loading margin={18} size={45} />
			</div>
		)
	if (!user)
		return (
			<div className='authValidation'>
				<AuthGuard />
			</div>
		)
	return children
}
