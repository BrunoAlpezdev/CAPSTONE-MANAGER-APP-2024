'use client'

import useDatabaseStore from '@/store/dbStore'
import { useState, useEffect } from 'react'
import {
	Venta,
	Producto,
	DetalleVenta,
	IngresosMensualesData,
	TransaccionesMensualesData,
	TopProductosData,
	TopResponsablesData,
	Usuario
} from '@/types'

interface VentasData {
	ingresosMensuales: IngresosMensualesData[]
	transaccionesMensuales: TransaccionesMensualesData[]
	promedioVentasDiarias: number
	topProductos: TopProductosData[]
	mejoresResponsables: TopResponsablesData[]
}

export const useDataVentas = (): VentasData => {
	const { db } = useDatabaseStore() // Asegúrate de que el hook devuelva correctamente el objeto db
	const [ventasData, setVentasData] = useState<VentasData>({
		ingresosMensuales: [],
		transaccionesMensuales: [],
		promedioVentasDiarias: 0,
		topProductos: [],
		mejoresResponsables: []
	})

	useEffect(() => {
		if (!db || !db.ventas || !db.detalle_ventas || !db.productos) {
			console.error(
				'La base de datos o las colecciones necesarias ("ventas", "detalle_ventas" o "productos") no están disponibles.'
			)
			return
		}

		const subscription = db.ventas
			.find()
			.$.subscribe(async (ventas: Venta[]) => {
				if (ventas) {
					try {
						const ingresosMensuales = calcularIngresosMensuales(ventas)
						const transaccionesMensuales =
							calcularTransaccionesMensuales(ventas)
						const promedioVentasDiarias = calcularPromedioVentasDiarias(ventas)

						// Validar la existencia de colecciones necesarias antes de calcular los top productos
						const topProductos = await calcularTopProductos(db)

						const mejoresResponsables = await calcularMejoresResponsables(db)

						setVentasData({
							ingresosMensuales,
							transaccionesMensuales,
							promedioVentasDiarias,
							topProductos,
							mejoresResponsables
						})
					} catch (error) {
						console.error('Error al calcular los datos de ventas:', error)
					}
				}
			})

		return () => subscription.unsubscribe()
	}, [db])

	return ventasData
}

// Funciones de cálculo
const calcularIngresosMensuales = (
	ventas: Venta[]
): IngresosMensualesData[] => {
	const grouped = ventas.reduce<Record<string, number>>((acc, venta) => {
		const mes = new Date(venta.fecha).toLocaleString('default', {
			month: 'long',
			year: 'numeric'
		})
		acc[mes] = (acc[mes] || 0) + venta.total
		return acc
	}, {})

	return Object.entries(grouped).map(([mes, ventas]) => ({ mes, ventas }))
}

const calcularTransaccionesMensuales = (
	ventas: Venta[]
): TransaccionesMensualesData[] => {
	const grouped = ventas.reduce<Record<string, number>>((acc, venta) => {
		const month = new Date(venta.fecha).toLocaleString('default', {
			month: 'long',
			year: 'numeric'
		})
		acc[month] = (acc[month] || 0) + 1
		return acc
	}, {})

	return Object.entries(grouped).map(([mes, transacciones]) => ({
		mes,
		transacciones
	}))
}

const calcularPromedioVentasDiarias = (ventas: Venta[]): number => {
	const uniqueDates = new Set(
		ventas.map((venta) => new Date(venta.fecha).toDateString())
	)
	const ventasTotales = ventas.reduce((acc, venta) => acc + venta.total, 0)
	return uniqueDates.size > 0 ? ventasTotales / uniqueDates.size : 0
}

const uuid = localStorage.getItem('uuid')

const calcularTopProductos = async (db: any): Promise<TopProductosData[]> => {
	try {
		// Obtener detalles de ventas y productos
		const detallesData = await db.detalle_ventas
			.find({ id_negocio: uuid })
			.exec()
		const productosData = await db.productos.find().exec()

		const detalles: DetalleVenta[] = detallesData.map((detalle: any) =>
			detalle.toJSON()
		)
		const productos: Producto[] = productosData.map((producto: any) =>
			producto.toJSON()
		)

		// Calcular las ventas por producto
		const ventasPorProducto = detalles.reduce<
			Record<string, { cantidad: number; producto_id: string }>
		>((acumulador, detalle) => {
			if (!acumulador[detalle.producto_id]) {
				acumulador[detalle.producto_id] = {
					cantidad: 0,
					producto_id: detalle.producto_id
				}
			}
			acumulador[detalle.producto_id].cantidad += detalle.cantidad
			return acumulador
		}, {})

		if (ventasPorProducto) {
			// Convertir a array y ordenar por cantidad
			const productosOrdenados = Object.values(ventasPorProducto).sort(
				(a, b) => b.cantidad - a.cantidad
			)
			// Tomar los 5 primeros y mapear con información de productos
			const topProductosConInfo = productosOrdenados
				.slice(0, 5)
				.map((venta) => {
					const producto = productos.find(
						(prod) => prod.id === venta.producto_id
					)
					return {
						id: venta.producto_id,
						label: producto?.nombre || 'Desconocido',
						value: venta.cantidad,
						color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
					}
				})
			return topProductosConInfo
		}

		return []
	} catch (error) {
		console.error('Error al obtener detalles de ventas o productos:', error)
		return []
	}
}
const calcularMejoresResponsables = async (
	db: any
): Promise<TopResponsablesData[]> => {
	try {
		// Obtener detalles de ventas y productos
		const ventasData = await db.ventas.find({ id_negocio: uuid }).exec()
		const responsablesData = await db.usuarios.find({ id_negocio: uuid }).exec()

		const ventas: Venta[] = ventasData.map((venta: any) => venta.toJSON())

		// Calcular las ventas por Responsable
		const ventasPorResponsable = ventas.reduce<
			Record<string, { total: number; id_responsable: string }>
		>((acumulador, venta) => {
			if (!acumulador[venta.id_responsable]) {
				acumulador[venta.id_responsable] = {
					total: 0,
					id_responsable: venta.id_responsable
				}
			}
			acumulador[venta.id_responsable].total += venta.total
			return acumulador
		}, {})

		// Convertir a array y ordenar por total
		const responsablesOrdenados = Object.values(ventasPorResponsable).sort(
			(a, b) => b.total - a.total
		)

		// Tomar los 5 primeros y mapear con información de productos
		const topResponsablesConInfo = responsablesOrdenados
			.slice(0, 5)
			.map((venta) => {
				const responsable: Usuario = responsablesData.find(
					(resp: Usuario) => resp.id === venta.id_responsable
				)
				return {
					id: venta.id_responsable,
					label: responsable?.nombre || 'Desconocido',
					value: venta.total,
					color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
				}
			})
		return topResponsablesConInfo
	} catch (error) {
		console.error('Error al obtener detalles de responsables:', error)
		return []
	}
}
