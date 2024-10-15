import type { Metadata } from 'next'
import '@/styles/system-layout.css'
import { Footer } from '@/components'
import { ReportHeader } from '@/components/reportes/reportHeaderComponents'

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
			<ReportHeader />
			<main>{children}</main>
			<Footer />
		</>
	)
}
