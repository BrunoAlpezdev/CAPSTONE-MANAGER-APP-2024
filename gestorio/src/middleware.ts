import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API_KEY = String(process.env.BACKEND_API_KEY)

export function middleware(request: NextRequest) {
	if (
		request.nextUrl.pathname.startsWith('/api') &&
		!request.nextUrl.pathname.includes('login')
	) {
		const apiKey = request.headers.get('API_KEY')

		if (!apiKey || apiKey !== API_KEY) {
			return NextResponse.json({ message: 'Invalid API key' }, { status: 403 })
		}
	}

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
