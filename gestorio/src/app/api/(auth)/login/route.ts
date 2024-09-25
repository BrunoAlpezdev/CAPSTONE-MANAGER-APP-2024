import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/firebase/auth'
import { User } from 'firebase/auth'

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

		// Llamar a la función de autenticación
		const { user, error }: { user?: User; error?: string } = await login(
			email,
			password
		)

		// Verificar si hubo un error
		if (error) {
			return NextResponse.json({ message: error }, { status: 401 })
		}

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
