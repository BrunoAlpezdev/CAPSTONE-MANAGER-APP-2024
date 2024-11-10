import useDatabaseStore from '@/store/dbStore'
import { Producto } from '@/types'
import { useState } from 'react'

export const useLocalDb = () => {
	const { db } = useDatabaseStore()

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

	return { ModificarProductos }
}
