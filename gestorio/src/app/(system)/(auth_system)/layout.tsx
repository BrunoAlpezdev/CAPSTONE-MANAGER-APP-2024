'use client'

import { ReactNode, useState } from 'react'
import { useUser } from '@/firebase/auth'
/* import AuthGuard from '@/components/auth/authGuard.component' */
/* import { BeatLoader } from 'react-spinners' */
import '@/styles/authGuard.css'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components'
import AuthGuard from '@/components/auth/authGuard.component'
import useDatabaseStore from '@/store/dbStore'
import { useEffect } from 'react'
import { Notificacion, Producto } from '@/types'
import setupDatabase from '@/lib/db/RxDB'

export default function Layout({ children }: { children: ReactNode }) {
	const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
	// Este useEffect recorrerá todos los productos y generará notificaciones para aquellos con bajo stock
	const setDb = useDatabaseStore((state) => state.setDb)

	const fetchNotificacionesDeProductos = async (db: any) => {
		const localId = localStorage.getItem('userUuid')
		const Id_negocio = localId?.replaceAll('"', '')
		if (db && Id_negocio) {
			try {
				const productosData = await db.productos
					.find({
						selector: { id_negocio: Id_negocio }
					})
					.exec()

				const productos: Producto[] = productosData.map((producto: any) =>
					producto.toJSON()
				)

				const productosConBajoStock = productos.filter(
					(product) => product.stock < 10
				)

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
			} catch (error) {
				console.log('Error al obtener los productos:', error)
			}
		}
	}

	useEffect(() => {
		setupDatabase().then((db) => {
			// fetchear las notis y setear el store con el db
			fetchNotificacionesDeProductos(db)
			setDb(db)
		})
	}, [setDb])

	const user = useUser()

	if (user === false)
		return (
			<ThemeProvider>
				<div className='absolute z-10 flex h-[100dvh] w-[100dvw] items-center justify-center bg-background/80 backdrop-blur-md'>
					<div className='h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-Blanco'></div>
				</div>
			</ThemeProvider>
		)
	if (!user) return <AuthGuard></AuthGuard>
	return children
}
