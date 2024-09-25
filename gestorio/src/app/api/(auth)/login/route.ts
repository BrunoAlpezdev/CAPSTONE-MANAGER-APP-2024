import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/firebase/auth'

export async function POST(request: NextRequest) {
	try {
		// Obtener el cuerpo de la solicitud
		const { email, password } = await request.json()

		// Verificación de campos
		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Faltan campos', status: 400 },
				{ status: 400 }
			)
		}

		// Llamar la función de autenticación
		const user = await login(email, password)

		// Responder con éxito
		return NextResponse.json({ user }, { status: 200 })
	} catch (error: any) {
		// Manejar errores
		return NextResponse.json(
			{
				message: 'Credenciales inválidas',
				error: error.message,
				status: 401
			},
			{ status: 401 }
		)
	}
}
