import type { Metadata } from 'next'
import '@/styles/system-layout.css'
import { Header, Footer } from '@components/index'
import { NextUIProvider } from '@nextui-org/system'

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
		/* Cada vez que quieran utilizar componentes de NextUI, 
		deben envolver su aplicación en el <NextUIProvider> </NextUIProvider> 
		con el contenido dentro de estos 
		¡¡¡Esto se importa de (((( import { NextUIProvider } from '@nextui-org/system' )))) !!!*/
		<NextUIProvider>
			<Header />
			<main>{children}</main>
			<Footer />
		</NextUIProvider>
	)
}
