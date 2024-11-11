import useDatabaseStore from '@/store/dbStore'
import { Producto } from '@/types'
import { useState } from 'react'

export const useLocalDb = () => {
	const { db } = useDatabaseStore()
	//Leer
	const LeerProductos = async () => {
		try {
			const productos = db?.productos
			if (productos) {
				const productosData = await productos.find().exec()
				return productosData
			}
		} catch (error) {
			console.error('Error al leer los productos:', error)
		}
	}
	const LeerVentas = async () => {
		try {
			const ventas = db?.ventas
			if (ventas) {
				const ventasData = await ventas.find().exec()
				return ventasData
			}
		} catch (error) {
			console.error('Error al leer las ventas:', error)
		}
	}
	// Modificar
	const ModificarProductos = async (id: string, producto: Producto) => {
		try {
			const productos = db?.productos
			if (productos) {
				await productos.upsert({
					_id: id,
					...producto
				})
			}
		} catch (error) {
			console.error('Error al modificar el producto:', error)
		}
	}
	// eliminar
	const EliminarProducto = async (id: string) => {
		try {
			const productos = db?.productos
			if (productos) {
				const producto = await productos.findOne(id)
				if (producto) {
					await producto.remove()
				}
			}
		} catch (error) {
			console.error('Error al eliminar el producto:', error)
		}
	}

	return { ModificarProductos, LeerProductos, LeerVentas, EliminarProducto }
}
