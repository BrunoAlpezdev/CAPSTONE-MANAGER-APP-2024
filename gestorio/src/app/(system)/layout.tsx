import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './system.css'
import Footer from '@/app/components/footer.component'
import Header from '@components/header.component'

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
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	)
}
