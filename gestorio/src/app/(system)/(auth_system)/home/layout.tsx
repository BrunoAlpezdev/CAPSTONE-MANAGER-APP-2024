import type { Metadata } from 'next'
import '@/styles/globals.css'
import '@/styles/system.css'
import '@/styles/system-layout.css'
import { Footer, Header, ThemeProvider } from '@/components/index'

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
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange>
				<Header />
				<main>{children}</main>
				<Footer />
			</ThemeProvider>
		</>
	)
}
