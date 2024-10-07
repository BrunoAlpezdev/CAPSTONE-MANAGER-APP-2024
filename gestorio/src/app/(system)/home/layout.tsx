import type { Metadata } from 'next'
import '@/styles/system.css'
import '@/styles/system-layout.css'
import { Footer, Header } from '@/components'

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
		<>
			<Header />
			<main>{children}</main>
			<Footer />
		</>
	)
}
