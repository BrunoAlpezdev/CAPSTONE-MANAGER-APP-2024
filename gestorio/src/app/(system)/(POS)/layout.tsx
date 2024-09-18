import type { Metadata } from 'next'
import '@/styles/system.css'

export const metadata: Metadata = {
	title: 'Sistema de Ventas',
	description: 'Panel de control para la gestión de ventas'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return <>{children}</>
}
