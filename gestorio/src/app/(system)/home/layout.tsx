import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/system.css'
import '@/styles/system-layout.css'
import { Footer, Header } from '@components/index'

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
			<body className={inter.className + ' '}>
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	)
}
