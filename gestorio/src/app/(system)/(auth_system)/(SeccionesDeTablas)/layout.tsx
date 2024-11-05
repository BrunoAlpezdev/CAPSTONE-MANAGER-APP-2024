import type { Metadata } from 'next'

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
			<div className='h-full w-full'>{children}</div>
		</>
	)
}
