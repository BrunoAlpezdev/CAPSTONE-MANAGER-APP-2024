import useDatabaseStore from '@/store/dbStore'
import { useState, useEffect } from 'react'
import { Venta, DetalleVenta, VentasConDetalle } from '@/types'

export const useVentasConDetalles = () => {
	const [data, setData] = useState<VentasConDetalle[]>([]) // Estado para los datos combinados
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const db = useDatabaseStore((state) => state.db) // Aquí obtienes la base de datos local (RxDB)

	// Función para cargar las ventas y detalles
	const fetchData = async () => {
		try {
			if (db) {
				// Obtener las ventas
				const ventasData = await db.ventas.find().exec()
				const ventas = ventasData.map((venta: any) => venta.toJSON()) // Convertir a objetos JSON

				// Obtener los detalles de las ventas
				const detallesData = await db.detalles_ventas.find().exec()
				const detalles = detallesData.map((detalle: any) => detalle.toJSON())

				// Combinar las ventas con sus detalles
				const ventasConDetalles = ventas.map((venta: Venta) => {
					const detallesVenta = detalles.filter(
						(detalle: DetalleVenta) => detalle.venta_id === venta.id
					)

					return {
						...venta,
						detalles: detallesVenta,
						responsable: venta.id_responsable, // Usando el id_responsable de la venta
						totalVenta: venta.total, // Usando el total de la venta
						montoTotal: venta.total
					}
				})

				// Actualizar el estado con los datos combinados
				setData(ventasConDetalles)
			}
		} catch (error) {
			setError('Error al cargar los datos de ventas o detalles.')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [db])

	return {
		data,
		loading,
		error
	}
}
