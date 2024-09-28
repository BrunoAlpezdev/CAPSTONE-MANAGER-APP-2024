import type { Metadata } from 'next'
import '@/styles/system-layout.css'
import { STHeader, Footer } from '@components/index'

//import { Bug, UserRound, LogOut } from 'lucide-react' // Iconos de lucide-react

export const metadata: Metadata = {
	title: 'Sistema de Ventas',
	description: 'Panel de control para la gestión de ventas'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<main>{children}</main>
			<Footer />
		</>
	)
}
