import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	const user = {
		isLogged: true,
		role: 'user'
	}

	if (!user.isLogged) {
		return NextResponse.redirect(new URL('/', request.url))
	}
}

export const config = {
	matcher: [
		'/home',
		'/profile',
		'/settings',
		'/dashboard',
		'/admin',
		'/SistemaDeVentas'
	]
}
