'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FullLogo } from '@/components'
import { signIn } from '@/firebase/auth'
import { useAuthStore } from '@/store/authStore'
import AuthRedirect from '@/components/auth/authRedirect.component'

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
				localStorage.setItem('userUuid', JSON.stringify(data.user.uid))

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

	const [user, setUser] = useState(null)

	useEffect(() => {
		// Solo se ejecuta en el cliente
		const localUser = localStorage.getItem('userUuid')
		setUser(localUser ? JSON.parse(localUser) : null)
	}, [])

	if (user) return <AuthRedirect></AuthRedirect>

	return (
		<main className='fondo relative flex h-[100dvh] w-[100dvw] items-center justify-center bg-background p-24'>
			{/* Fondo con spinner de loading en absolute */}
			{loading && (
				<div className='absolute z-10 flex h-[100dvh] w-[100dvw] items-center justify-center bg-background/80 backdrop-blur-md'>
					<div className='h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-Blanco'></div>
				</div>
			)}
			<section className='flex flex-col gap-3'>
				<section className='relative flex flex-col rounded-lg border-2 border-primary/60 bg-background px-12 py-10 shadow-lg'>
					<FullLogo size='huge' editClass='mb-8 gap-6' />
					<form
						onSubmit={handleLogin}
						className='flex flex-col gap-4 bg-background'>
						<label className='bg-background text-xl'>Usuario</label>
						<input
							id='emailField'
							className='h-9 rounded-md bg-secondary px-2 text-secondary-foreground'
							type='email'
							onChange={(e) => setEmail(e.target.value)}
						/>

						<label className='bg-background text-xl'>Contraseña</label>
						<input
							id='passwordField'
							className='h-9 rounded-md bg-secondary px-2 text-secondary-foreground'
							type='password'
							onChange={(e) => setPassword(e.target.value)}
						/>

						<button className='mt-6 w-fit self-center rounded-lg bg-primary px-12 py-2 text-2xl transition hover:scale-105 hover:bg-primary/90'>
							Iniciar Sesión
						</button>
					</form>

					{error && (
						<p className='mt-4 w-fit self-center text-center text-Naranjo'>
							{error}
						</p>
					)}
				</section>

				{process.env.NODE_ENV === 'development' && (
					<section className='relative flex flex-col rounded-lg border-2 border-primary/60 bg-background p-2 shadow-lg'>
						<button
							className='text-md w-fit self-center text-pretty rounded-lg bg-primary p-2 transition hover:scale-105 hover:bg-primary/90'
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
