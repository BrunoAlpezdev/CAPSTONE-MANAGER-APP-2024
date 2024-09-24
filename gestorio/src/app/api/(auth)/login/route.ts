import { NextApiResponse } from 'next'
import { login } from '@/lib/firebase/auth'
import { NextResponse } from 'next/server'

export async function POST(response: NextApiResponse) {
	const { email, password } = response.body

	if (!email || !password) {
		return NextResponse.json({ message: 'Faltan campos' }, { status: 400 })
	}

	try {
		const token = await login(email, password)
		return NextResponse.json({ token }, { status: 200 })
	} catch (error) {
		return response
			.status(401)
			.json({ message: 'Credenciales inválidas', error: error })
	}
}
