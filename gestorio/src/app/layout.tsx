import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Gestorio CL - Gestión Integral para tu Negocio',
	description:
		'Sistema de gestión integral que incluye POS, reportes, gestión de usuarios e inventarios.'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='es' suppressHydrationWarning>
			<head>
				<link
					rel='icon'
					type='image/png'
					href='/favicon/favicon-48x48.png'
					sizes='48x48'
				/>
				<link rel='icon' type='image/svg+xml' href='/favicon/favicon.svg' />
				<link rel='shortcut icon' href='/favicon/favicon.ico' />
				<link
					rel='apple-touch-icon'
					sizes='180x180'
					href='/favicon/apple-touch-icon.png'
				/>
				<meta name='apple-mobile-web-app-title' content='Gestorio CL' />
				<link rel='manifest' href='/favicon/site.webmanifest' />
			</head>
			<body className={inter.className}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
