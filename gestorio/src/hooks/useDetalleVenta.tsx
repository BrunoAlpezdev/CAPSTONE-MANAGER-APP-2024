import useDatabaseStore from '@/store/dbStore'
import { useState, useEffect } from 'react'
import {
	Venta,
	DetalleVenta,
	VentasConDetalle,
	DetalleVentaProducto,
	Producto,
	Usuario
} from '@/types'
import { format } from 'date-fns'

export const useVentasConDetalles = () => {
	const [detalledata, setData] = useState<VentasConDetalle[]>([]) // Estado para los datos combinados
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const localId = localStorage.getItem('userUuid')
	const Id_negocio = localId?.replaceAll('"', '')
	const fecha = new Date()
	const fechaString = fecha.toISOString().slice(0, 19).replace('T', ' ')

	const db = useDatabaseStore((state) => state.db) // Aquí obtienes la base de datos local (RxDB)

	// Función para cargar las ventas y detalles
	const fetchData = async () => {
		try {
			if (db && Id_negocio) {
				// Obtener las ventas
				const ventasData = await db.ventas
					.find({
						selector: { id_negocio: Id_negocio }
					})
					.exec()
				const ventas = ventasData.map((venta: any) => venta.toJSON())

				// Obtener los detalles de las ventas
				const detallesData = await db.detalle_ventas.find().exec()
				const detalles = detallesData.map((detalle: any) => detalle.toJSON())

				const productosData = await db.productos.find().exec()
				const productos = productosData.map((producto: any) =>
					producto.toJSON()
				)
				const usuariodata = await db.usuarios.find().exec()
				const usuarios = usuariodata.map((usuario: any) => usuario.toJSON())

				// Combinar las ventas con sus detalles
				const ventasConDetalles = ventas.map((venta: Venta) => {
					const detallesVenta = detalles.filter(
						(detalle: DetalleVenta) => detalle.venta_id === venta.id
					)

					// Obtener el nombre del responsable de la venta
					const responsable = usuarios.find(
						(usuario: Usuario) => usuario.id === venta.id_responsable
					)

					const DetalleVentaProducto = detallesVenta.map(
						(detalle: DetalleVentaProducto) => {
							const producto = productos.find(
								(producto: Producto) => producto.id === detalle.producto_id
							)
							return {
								...detalle,
								nombre: producto?.nombre,
								variante: producto?.variante
							}
						}
					)
					return {
						...venta,
						detalles: DetalleVentaProducto,
						responsable: responsable?.nombre,
						fecha: venta.fecha,
						totalVenta: venta.total,
						montoTotal: venta.total,
						metodoDePago: venta.metodoPago
					}
				})
				setData(ventasConDetalles)
			}
		} catch (error) {
			setError('Error al cargar los datos de ventas o detalles.')
		} finally {
			setLoading(false)
		}
	}

	return {
		detalledata,
		loading,
		error,
		fetchData
	}
}
