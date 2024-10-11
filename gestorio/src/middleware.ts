import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	const user = {
		isLogged: true,
		role: 'user'
	}

	if (!user.isLogged && !request.nextUrl.pathname.startsWith('/api')) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
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
