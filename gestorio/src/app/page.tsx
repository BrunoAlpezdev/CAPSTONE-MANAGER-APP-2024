'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError('')

		// Validar campos
		if (!email || !password) {
			setError('Faltan campos')
			return
		}

		try {
			setLoading(true)
			// Hacer la petición POST a la API de login
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email: email, password: password })
			})

			// Verificar si la respuesta fue exitosa
			if (!response.ok) {
				const errorData = await response.json()
				throw new Error(errorData.message || 'Error al iniciar sesión')
			}

			const data = await response.json()
			console.log('Login exitoso:', data) // Aquí podrías redirigir al usuario o guardar el token

			// Si el login es exitoso, puedes redirigir o manejar el estado de sesión
			router.push('/home')
		} catch (error: any) {
			// Manejo de errores
			if (error.message.includes('(auth/invalid-credential)')) {
				setError('Correo o contraseña incorrecto')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className='relative fondo flex bg-Gris w-[100dvw] h-[100dvh] items-center justify-center p-24'>
			{/* Fondo con spinner de loading en absolute */}
			{loading && (
				<div className='absolute bg-Gris/80 backdrop-blur-md w-[100dvw] h-[100dvh] flex items-center justify-center z-10'>
					<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-Blanco'></div>
				</div>
			)}
			<section className='relative flex flex-col border-2 bg-Gris border-Amarillo/60 shadow-lg px-12 py-16 rounded-lg'>
				<div className='flex justify-center items-center mb-8'>
					<Image
						priority
						src='/SAVANNALOGOpng.png'
						alt='Vercel Logo'
						width={500}
						height={100}
						className='bg-Gris'
					/>
				</div>

				<form onSubmit={handleLogin} className='bg-Gris flex flex-col gap-4'>
					<label className='bg-Gris text-Blanco text-xl'>Usuario</label>
					<input
						className='bg-Verde text-Blanco h-9 px-2 rounded-md'
						type='email'
						onChange={(e) => setEmail(e.target.value)}
					/>

					<label className='bg-Gris text-Blanco text-xl'>Contraseña</label>
					<input
						className='bg-Verde text-Blanco h-9 px-2 rounded-md'
						type='password'
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button className='self-center text-2xl text-Blanco bg-Naranjo rounded-lg w-fit px-12 py-2 mt-8 transition hover:scale-105 hover:bg-Naranjo/90'>
						Iniciar Sesión
					</button>
				</form>
				{error && (
					<p className='text-Naranjo text-center w-fit self-center mt-4'>
						{error}
					</p>
				)}
			</section>
		</main>
	)
}
