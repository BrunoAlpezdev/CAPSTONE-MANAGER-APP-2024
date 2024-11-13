'use client'

import { Footer, FullLogo, ToggleMenu } from '@/components'
import { columns } from './columns'
import { DataTable } from '@/components/inventario-table'
import { useMenu } from '@/hooks'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { SystemHeader } from '@/components/systemHeader.component'
import { MenuIcon, Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Usuario } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { firestore } from '@/firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import useDatabaseStore from '@/store/dbStore'

export default function GestionDeUsuarios() {
	const [data, setData] = useState<Usuario[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const { isMenuOpen, toggleMenu } = useMenu()
	const { db } = useDatabaseStore.getState()

	const fetchUsuarios = async () => {
		if (db) {
			try {
				// Obtén los datos de los productos desde la base de datos local (RxDB)
				// TODO: filtrar solo los que tengan el id de negocio del usuario logueado -> useAuthStore -> USUARIO
				const usuariosData = await db.usuarios.find().exec()

				// Mapear los productos a un array de objetos
				const usuarios = usuariosData.map((usuario: any) => usuario.toJSON())

				// Actualizar el estado de productos con los datos completos
				setData(usuarios)
			} catch (error) {
				console.log('Error al obtener los usuarios:', '✖️')
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

	useEffect(() => {
		fetchUsuarios()
	}, [])

	/* Esta es la suscripción a los cambios en la colección de productos,
	se ejecuta cada vez que cambia la colección valga la redundancia,
	esto tiene que integrarse de esta misma manera en el resto de funciones de las paginas de tablas
	*/
	// Suscripción a los cambios en la colección de productos
	useEffect(() => {
		if (db?.usuarios) {
			const subscription = db.usuarios
				.find()
				.$ // el carácter '$' provee un observable se emite cada vez que el resultado de la query cambia
				.subscribe((usuariosData: any[]) => {
					const usuarios = usuariosData.map((usuario) => usuario.toJSON())
					setData(usuarios)
				})

			// Clean up the subscription on component unmount
			return () => subscription.unsubscribe()
		}
	}, [db])

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

			<main className='tables-fondo m-3 flex h-[calc(100dvh-108px)] w-[calc(100dvw-40px)]'>
				<ScrollArea className='scrollbar-modifier flex h-full w-full rounded-md border border-primary/60 bg-white/5 p-2 text-foreground backdrop-blur-sm'>
					<h1 className='text-center text-3xl font-bold'>
						Gestión De Usuarios
					</h1>
					<DataTable columns={columns} data={data} />
				</ScrollArea>
			</main>

			<Footer />
		</div>
	)
}
