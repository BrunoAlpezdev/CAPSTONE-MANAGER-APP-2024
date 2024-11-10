import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Gestorio CL - Gestión Integral para tu Negocio',
	description:
		'Sistema de gestión integral que incluye POS, reportes, gestión de usuarios e inventarios.',
	manifest: '/manifest.json'
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

				<meta name='apple-mobile-web-app-status-bar-style' content='default' />
				<meta name='description' content='Best PWA App in the world' />
				<meta name='format-detection' content='telephone=no' />
				<meta name='mobile-web-app-capable' content='no' />

				<link
					rel='icon'
					type='image/png'
					sizes='72x72'
					href='/images/icon-72x72.png'
				/>
				<link
					rel='icon'
					type='image/png'
					sizes='16x16'
					href='/images/icon-96x96.png'
				/>
				<link rel='manifest' href='/manifest.json' />

				<link rel='shortcut icon' href='/favicon/favicon.ico' />
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css?family=Roboto:300,400,500'
				/>
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
