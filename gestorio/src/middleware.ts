import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
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
