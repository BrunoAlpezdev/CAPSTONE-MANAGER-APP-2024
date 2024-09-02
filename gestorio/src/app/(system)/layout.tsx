import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './system.css'
import FooterComponent from '../components/FooterComponent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Gestorio',
	description: ''
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='es'>
			<body className={inter.className}>
				<header className='bg-Gris text-Blanco'>header</header>
				<main>{children}</main>
				<FooterComponent />
			</body>
		</html>
	)
}
