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
import { firestore } from '@/firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import useDatabaseStore from '@/store/dbStore'

export default function GestionDeProductos() {
	const [data, setData] = useState<Producto[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const { isMenuOpen, toggleMenu } = useMenu()
	const db = useDatabaseStore((state) => state.db)

	const fetchProductos = async () => {
		if (db) {
			try {
				// Obtén los datos de los productos desde la base de datos local (RxDB)
				// TODO: filtrar solo los que tengan el id de negocio del usuario logueado -> useAuthStore -> USUARIO
				const productosData = await db.productos.find().exec()

				// Mapear los productos a un array de objetos
				const productos = productosData.map((producto: any) =>
					producto.toJSON()
				)

				// Actualizar el estado de productos con los datos completos
				setData(productos)
			} catch (error) {
				console.log('Error al obtener los productos:', '✖️')
			} finally {
				setLoading(false)
			}
		}
	}

	// Notificaciones
	type Notificacion = {
		id: string
		mensaje: string
	}
	const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
	// Este useEffect recorrerá todos los productos y generará notificaciones para aquellos con bajo stock
	useEffect(() => {
		const productos = data
		const productosConBajoStock = productos.filter(
			(product) => product.stock < 10
		)
		console.log('Productos con bajo stock:', productosConBajoStock)

		setNotificaciones((prev) => {
			const nuevasNotificaciones = productosConBajoStock
				.filter(
					(product) =>
						!prev.some((notificacion) => notificacion.id === product.id)
				)
				.map((product) => ({
					id: product.id,
					mensaje: `El producto ${product.nombre} tiene un stock menor a 10 unidades.`
				}))

			// Agrega las nuevas notificaciones que faltan, evitando duplicados
			if (nuevasNotificaciones.length > 0) {
				const actualizadas = [...prev, ...nuevasNotificaciones]
				// Opcional: actualiza el localStorage si es necesario
				localStorage.setItem('notificaciones', JSON.stringify(actualizadas))
				return actualizadas
			}

			return prev
		})
	}, [data])

	useEffect(() => {
		fetchProductos()
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

	if (loading) return <p className='text-foreground'>Cargando productos...</p>
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
						Gestión De inventario
					</h1>
					<DataTable columns={columns} data={data} />
				</ScrollArea>
			</main>

			<Footer />
		</div>
	)
}
