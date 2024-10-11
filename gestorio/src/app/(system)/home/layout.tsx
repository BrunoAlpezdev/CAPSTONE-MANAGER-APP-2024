import type { Metadata } from 'next'
import '@/styles/system.css'
import '@/styles/system-layout.css'
import { Footer, Header } from '@/components/index'

export const metadata: Metadata = {
	title: 'Gestorio',
	description: 'a'
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
