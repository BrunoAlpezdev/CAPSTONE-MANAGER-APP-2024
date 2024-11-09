'use client'

import { Footer, FullLogo, ToggleMenu } from '@/components'
import { columns } from './columns'
import { DataTable } from '@/components/inventario-table'
import { useMenu } from '@/hooks'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { SystemHeader } from '@/components/systemHeader.component'
import { MenuIcon, Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Producto } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'

async function getProducts(): Promise<Producto[]> {
	const res = await fetch(
		'https://6725676cc39fedae05b4ac87.mockapi.io/api/Productos'
	)
	const data = await res.json()

	// Validación de datos
	if (!Array.isArray(data)) {
		throw new Error('Los datos no son un array')
	}

	return data
}

export default function GestionDeUsuarios() {
	const [data, setData] = useState<Producto[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const { isMenuOpen, toggleMenu } = useMenu()

	useEffect(() => {
		const loadProductos = async () => {
			try {
				const productos = await getProducts()
				setData(productos)
			} catch (error: any) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		loadProductos()
	}, [])
	const [isDarkMode, setIsDarkMode] = useState(() => {
		return (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		)
	})
	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [isDarkMode])

	if (loading) return <p className='text-foreground'>Cargando usuarios...</p>
	if (error) return <p className='text-red-500'>Error: {error}</p>

	return (
		<div className='relative overflow-hidden transition-all'>
			<Toaster />
			{/* Overlay translucido (transparencia oscura del menú) */}
			{isMenuOpen && (
				<div
					className='fixed inset-0 z-40 bg-black bg-opacity-50'
					onClick={toggleMenu}
					aria-hidden='true'
				/>
			)}

			<ToggleMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

			<SystemHeader toggleMenu={toggleMenu} />

			{/* Main POS */}

			<main className='tables-fondo m-3 flex h-[calc(100dvh-109px)] w-[calc(100dvw-40px)]'>
				<ScrollArea className='scrollbar-modifier flex h-full w-full rounded-md border border-primary/60 bg-white/5 p-2 text-foreground backdrop-blur-sm'>
					<h1 className='text-center text-3xl font-bold'>
						Gestión De Proveedores
					</h1>
					<DataTable columns={columns} data={data} />
				</ScrollArea>
			</main>

			<Footer />
		</div>
	)
}
