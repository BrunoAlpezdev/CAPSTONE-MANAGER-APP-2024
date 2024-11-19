'use client'

import useDatabaseStore from '@/store/dbStore'
import { useState, useEffect } from 'react'
import {
	Venta,
	Producto,
	DetalleVenta,
	VentasMensualesData,
	TransaccionesMensualesData,
	TopProductosData
} from '@/types'

interface VentasData {
	ventasMensuales: VentasMensualesData[]
	transaccionesMensuales: TransaccionesMensualesData[]
	promedioVentasDiarias: number
	topProductos: TopProductosData[]
}

export const useDataVentas = (): VentasData => {
	const { db } = useDatabaseStore() // Asegúrate de que el hook devuelva correctamente el objeto db
	const [ventasData, setVentasData] = useState<VentasData>({
		ventasMensuales: [],
		transaccionesMensuales: [],
		promedioVentasDiarias: 0,
		topProductos: []
	})

	useEffect(() => {
		if (!db || !db.ventas) {
			console.error(
				'La base de datos o la colección "ventas" no están disponibles.'
			)
			return
		}

		const subscription = db.ventas
			.find()
			.$.subscribe(async (ventas: Venta[]) => {
				if (ventas) {
					try {
						const ventasMensuales = calcularVentasMensuales(ventas)
						const transaccionesMensuales =
							calcularTransaccionesMensuales(ventas)
						const promedioVentasDiarias = calcularPromedioVentasDiarias(ventas)
						const topProductos = await calcularTopProductos(db)

						setVentasData({
							ventasMensuales,
							transaccionesMensuales,
							promedioVentasDiarias,
							topProductos
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
const calcularVentasMensuales = (ventas: Venta[]): VentasMensualesData[] => {
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

const calcularTopProductos = async (db: any): Promise<TopProductosData[]> => {
	if (!db.detalleVentas || !db.productos) {
		console.error(
			'Las colecciones "detalleVentas" o "productos" no están disponibles.'
		)
		return []
	}

	try {
		const detalles = (await db.detalleVentas.find().exec()) as DetalleVenta[]
		const productoCounts: Record<string, number> = {}

		detalles.forEach((detalle) => {
			productoCounts[detalle.producto_id] =
				(productoCounts[detalle.producto_id] || 0) + detalle.cantidad
		})

		const productos = (await db.productos.find().exec()) as Producto[]
		return productos
			.map((prod) => ({
				nombre: prod.nombre,
				cantidad: productoCounts[prod.id] || 0
			}))
			.sort((a, b) => b.cantidad - a.cantidad)
			.slice(0, 5) // Top 5 productos
	} catch (error) {
		console.error('Error al obtener detalles de ventas o productos:', error)
		return []
	}
}
