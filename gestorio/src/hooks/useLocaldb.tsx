import useDatabaseStore from '@/store/dbStore'
import { Producto, Usuario } from '@/types'
import { useState } from 'react'
import { sortDocumentsByLastWriteTime } from 'rxdb'

export const useLocalDb = () => {
	const { db } = useDatabaseStore()
	//Leer
	const uuid = localStorage.getItem('uuid')
	const LeerProductos = async () => {
		try {
			const productos = db?.productos
			if (productos) {
				const productosData = await productos
					.find({ selector: { id_negocio: uuid } })
					.exec()
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

	const LeerUsuarios = async () => {
		try {
			const usuarios = db?.usuarios
			if (usuarios) {
				const usuariosData = await usuarios.find().exec()
				return usuariosData
			}
		} catch (error) {
			console.error('Error al leer los usuarios:', error)
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

	const ModificarUsuarios = async (id: string, usuario: Usuario) => {
		try {
			const usuarios = db?.usuarios
			if (usuarios) {
				await usuarios.upsert({
					_id: id,
					...usuario
				})
			}
		} catch (error) {
			console.error('Error al modificar el usuario:', error)
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
	const EliminarUsuario = async (id: string) => {
		try {
			const usuarios = db?.usuarios
			if (usuarios) {
				const usuario = await usuarios.findOne(id)
				if (usuario) {
					await usuario.remove()
				}
			}
		} catch (error) {
			console.error('Error al eliminar el usuario:', error)
		}
	}

	//agregar
	const AgregarProducto = async (producto: Producto) => {
		try {
			const productos = db?.productos
			if (productos) {
				await productos.insert(producto)
			}
		} catch (error) {
			console.error('Error al agregar el producto:', error)
		}
	}

	const AgregarUsuario = async (usuario: Usuario) => {
		try {
			const usuarios = db?.usuarios
			if (usuarios) {
				await usuarios.insert(usuario)
			}
		} catch (error) {
			console.error('Error al agregar el usuario:', error)
		}
	}

	const AgregarVenta = async (venta: any) => {
		try {
			const ventas = db?.ventas
			if (ventas) {
				await ventas.insert(venta)
			}
		} catch (error) {
			console.error('Error al agregar la venta:', error)
		}
	}

	const AgregarDetalleVenta = async (detalleVenta: any) => {
		try {
			const detalleVentas = db?.detalle_ventas
			if (detalleVentas) {
				await detalleVentas.insert(detalleVenta)
			}
		} catch (error) {
			console.error('Error al agregar el detalle de la venta:', error)
		}
	}

	return {
		// CRUD
		// Agregar / Create
		AgregarProducto,
		AgregarVenta,
		AgregarDetalleVenta,
		AgregarUsuario,
		// Leer / Read
		LeerUsuarios,
		LeerProductos,
		LeerVentas,
		// Modificar / Update
		ModificarProductos,
		ModificarUsuarios,
		// Eliminar / Delete
		EliminarProducto,
		EliminarUsuario
	}
}
