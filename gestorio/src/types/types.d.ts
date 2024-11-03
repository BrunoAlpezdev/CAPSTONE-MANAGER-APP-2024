/* https://firebase.google.com/docs/reference/js/firestore_.timestamp */
/* fromDate(date)	static	Creates a new timestamp from the given date. */
import { Timestamp } from 'firebase/firestore'

interface Tienda {
	id: number
	nombre: string
	direccion: string
	telefono?: string // Opcional si puede ser nulo
}

// Definición de tipos para los productos, items del carrito y tickets
interface Producto {
	id: string
	nombre: string
	imagen?: string
	variante?: string // Opcional si puede ser nulo
	precio: number // Asumiendo que el precio es un número entero en CLP
	stock: number
}

interface CartItem extends Producto {
	cantidad: number
}

interface Ticket {
	id: number
	name: string
	items: CartItem[]
}

interface Proveedor {
	id: number
	nombre: string
	contacto?: string // Opcional si puede ser nulo
	telefono?: string // Opcional si puede ser nulo
	tienda_id: number
}

interface Usuario {
	id: string
	nombre: string
	email: string
	rol: string
	negocio_id: number
}

interface Cliente {
	id: number
	nombre: string
	email?: string // Opcional si puede ser nulo
	telefono?: string // Opcional si puede ser nulo
}

interface Venta {
	id: number
	fecha: Timestamp // Timestamp
	total: number // Asumiendo que el total es un número entero en CLP
	tienda_id: number
	cliente_id: number
}

interface DetalleVenta {
	id: number
	venta_id: number
	producto_id: number
	cantidad: number
	precio: number // Asumiendo que el precio es un número entero en CLP
}

interface Pedido {
	id: number
	fecha: Timestamp // Timestamp
	proveedor_id: number
	tienda_id: number
	estado: string
}

interface DetallePedido {
	id: number
	pedido_id: number
	producto_id: number
	cantidad: number
	precio: number // Asumiendo que el precio es un número entero en CLP
}

export {
	Tienda,
	Producto,
	CartItem,
	Ticket,
	Proveedor,
	Usuario,
	Cliente,
	Venta,
	DetalleVenta,
	Pedido,
	DetallePedido
}
