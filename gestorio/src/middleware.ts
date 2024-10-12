import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { useAuthStore } from './store/authStore'

export function middleware(request: NextRequest) {
	const { user } = useAuthStore.getState()

	if (user !== null || user !== undefined) {
		return NextResponse.next()
	}

	return NextResponse.redirect(new URL('/auth', request.url))
}

export const config = {
	matcher: [
		'/api/:path*',
		'/home',
		'/profile',
		'/settings',
		'/dashboard',
		'/admin',
		'/SistemaDeVentas',
		'/GestionDeUsuarios'
	]
}
