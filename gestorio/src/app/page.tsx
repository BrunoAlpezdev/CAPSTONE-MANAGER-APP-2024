'use client'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { BarChart3, Users, Package, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { LandingCard } from '@/components/Landing/landing-card'

const features = [
	{
		icon: <BarChart3 className='mb-2 h-12 w-12 text-primary' />,
		title: 'POS Avanzado',
		description:
			'Sistema de punto de venta intuitivo y rápido para agilizar tus transacciones.',
		image:
			'https://d13kjxnqnhcmn2.cloudfront.net/AcuCustom/Sitename/DAM/056/Bespoke_reports_-_Main.png'
	},
	{
		icon: <BarChart3 className='mb-4 h-12 w-12 text-primary' />,
		title: 'Reportes Detallados',
		description:
			'Obtén insights valiosos con nuestros informes personalizables y en tiempo real.',
		image:
			'https://d13kjxnqnhcmn2.cloudfront.net/AcuCustom/Sitename/DAM/056/Bespoke_reports_-_Main.png'
	},
	{
		icon: <Users className='mb-4 h-12 w-12 text-primary' />,
		title: 'Gestión de Usuarios',
		description: 'Administra fácilmente los roles y permisos de tu equipo.',
		image:
			'https://d13kjxnqnhcmn2.cloudfront.net/AcuCustom/Sitename/DAM/056/Bespoke_reports_-_Main.png'
	},
	{
		icon: <Package className='mb-4 h-12 w-12 text-primary' />,
		title: 'Control de Inventario',
		description:
			'Mantén un seguimiento preciso de tu stock y optimiza tus pedidos.',
		image:
			'https://d13kjxnqnhcmn2.cloudfront.net/AcuCustom/Sitename/DAM/056/Bespoke_reports_-_Main.png'
	}
]

import { ThemeProvider } from '@/components'
import AuthRedirect from '@/components/auth/authRedirect.component'
import { useEffect, useState } from 'react'

export default function Home() {
	const router = useRouter()

	const [user, setUser] = useState(null)
	useEffect(() => {
		const localUser = localStorage.getItem('userUuid')
		const user = localUser ? JSON.parse(localUser) : null
		setUser(user)
	}, [])

	if (user) return <AuthRedirect></AuthRedirect>

	return (
		<ThemeProvider>
			<div className='min-h-screen bg-gradient-to-b from-background to-secondary'>
				<header className='container mx-auto py-8'>
					<nav className='flex items-center justify-between'>
						<h1 className='text-3xl font-bold text-primary'>Gestorio CL</h1>
						<div className='space-x-4'>
							<Button variant='ghost'>Características</Button>
							<Button variant='ghost'>Precios</Button>
							<Button variant='ghost'>Contacto</Button>
							<Button onClick={() => router.push('/auth')}>
								Iniciar Sesión
							</Button>
						</div>
					</nav>
				</header>

				<main className='container mx-auto py-16 text-center'>
					<h2 className='mb-6 text-5xl font-extrabold text-foreground'>
						Gestión Integral para tu Negocio
					</h2>
					<p className='mx-auto mb-12 max-w-2xl text-xl text-muted-foreground'>
						Gestorio CL es la solución completa que combina POS, reportes,
						gestión de usuarios e inventarios en una sola plataforma potente y
						fácil de usar.
					</p>
					<Button
						size='lg'
						className='mr-4 bg-accent text-accent-foreground hover:bg-accent/90'>
						Prueba Gratuita
					</Button>
					<Button
						size='lg'
						variant='outline'
						className='border-primary text-primary hover:bg-primary/10'>
						Ver Demo
					</Button>

					<div className='mt-24 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
						{features.map((feature, index) => (
							<LandingCard
								key={index}
								icon={feature.icon}
								image={feature.image}
								title={feature.title}
								description={feature.description}
							/>
						))}
					</div>
				</main>

				<footer className='mt-24 bg-secondary py-8'>
					<div className='container mx-auto text-center text-muted-foreground'>
						<p>&copy; 2024 Gestorio CL. Todos los derechos reservados.</p>
					</div>
				</footer>
			</div>
		</ThemeProvider>
	)
}

interface FeatureCardProps {
	icon: React.ReactNode
	title: string
	description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<Card className='border-primary/10 transition-colors hover:border-primary/30'>
			<CardHeader>
				<CardTitle className='flex flex-col items-center text-primary'>
					{icon}
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription className='text-muted-foreground'>
					{description}
				</CardDescription>
			</CardContent>
		</Card>
	)
}
