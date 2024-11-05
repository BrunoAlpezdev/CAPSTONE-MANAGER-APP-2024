import { AUTH_ROUTE } from '@/lib/routes'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import '@/styles/authGuard.css'
import { useEffect } from 'react'

export default function AuthGuard() {
	const pathname = usePathname()

	useEffect(() => {
		redirect(AUTH_ROUTE)
	}, [])

	return (
		<>
			<h1>alo</h1>
		</>
	)
}
