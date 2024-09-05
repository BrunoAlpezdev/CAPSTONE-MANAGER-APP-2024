import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../../styles/system.css'

const inter = Inter({ subsets: ['latin'] })

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
		<html lang='es'>
			<body className={inter.className}>{children}</body>
		</html>
	)
}
