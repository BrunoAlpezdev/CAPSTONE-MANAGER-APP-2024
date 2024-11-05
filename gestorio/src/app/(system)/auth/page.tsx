'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FullLogo } from '@/components'
import { signIn } from '@/firebase/auth'
import { useAuthStore } from '@/store/authStore'

export default function Home() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError('')

		try {
			// Validar campos
			if (!email || !password) {
				setError('Faltan campos')
				return
			}

			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
			if (!emailRegex.test(email)) {
				setError('Formato de correo no válido')
				return
			}

			if (password.length < 6) {
				setError('La contraseña debe tener al menos 6 caracteres')
				return
			}

			setLoading(true)

			signIn(email, password).then((data) => {
				if (!data) {
					setError('Correo o contraseña incorrecto')
					setLoading(false)
					return
				}
				const { user } = useAuthStore.getState()
				console.log(user)

				// Si el login es exitoso, puedes redirigir o manejar el estado de sesión
				router.push('/home')
				router.refresh()
			})
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
		<main className='relative fondo flex bg-background w-[100dvw] h-[100dvh] items-center justify-center p-24'>
			{/* Fondo con spinner de loading en absolute */}
			{loading && (
				<div className='absolute bg-background/80 backdrop-blur-md w-[100dvw] h-[100dvh] flex items-center justify-center z-10'>
					<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-Blanco'></div>
				</div>
			)}
			<section className='flex flex-col gap-3'>
				<section className='relative flex flex-col border-2 bg-background border-primary/60 shadow-lg px-12 py-10 rounded-lg'>
					<FullLogo size='huge' editClass='mb-8 gap-6' />
					<form
						onSubmit={handleLogin}
						className='bg-background flex flex-col gap-4'>
						<label className='bg-background text-xl'>Usuario</label>
						<input
							id='emailField'
							className='bg-secondary text-secondary-foreground h-9 px-2 rounded-md'
							type='email'
							onChange={(e) => setEmail(e.target.value)}
						/>

						<label className='bg-background text-xl'>Contraseña</label>
						<input
							id='passwordField'
							className='bg-secondary text-secondary-foreground h-9 px-2 rounded-md'
							type='password'
							onChange={(e) => setPassword(e.target.value)}
						/>

						<button className='self-center text-2xl bg-primary rounded-lg w-fit px-12 py-2 mt-6 transition hover:scale-105 hover:bg-primary/90'>
							Iniciar Sesión
						</button>
					</form>

					{error && (
						<p className='text-Naranjo text-center w-fit self-center mt-4'>
							{error}
						</p>
					)}
				</section>

				{process.env.NODE_ENV === 'development' && (
					<section className='relative flex flex-col border-2 bg-background border-primary/60 shadow-lg p-2 rounded-lg'>
						<button
							className='self-center text-md text-pretty bg-primary rounded-lg w-fit p-2 transition hover:scale-105 hover:bg-primary/90'
							onClick={async () => {
								setLoading(true)
								await signIn('alo@alo.com', '123123')
								setLoading(false)
								router.push('/home')
							}}>
							Bypass
						</button>
					</section>
				)}
			</section>
		</main>
	)
}
