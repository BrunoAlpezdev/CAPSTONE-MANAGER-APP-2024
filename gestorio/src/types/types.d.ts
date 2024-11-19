/* https://firebase.google.com/docs/reference/js/firestore_.timestamp */
/* fromDate(date)	static	Creates a new timestamp from the given date. */
import { Timestamp } from 'firebase/firestore'
import { DetalleVenta } from '@/types'

interface Tienda {
	id: number
	nombre: string
	direccion: string
	telefono?: string // Opcional si puede ser nulo
}

interface Negocio {
	id: number
	nombre: string
	ownerID: string
	telefono?: string // Opcional si puede ser nulo
	authToken: string
	correo: string
	plan: string
}

// Definición de tipos para los productos, items del carrito y tickets
interface Producto {
	id: string
	barcode: string
	nombre: string
	variante?: string // Opcional si puede ser nulo
	marca: string
	id_negocio: String
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
	id_negocio: string
	passwordHash: string
}

interface Historial {
	id: string
	id_usuario: string
	responsable: string
	totalVenta: number
	pago: string
	fecha: Timestamp // Timestamp
}

interface Cliente {
	id: number
	nombre: string
	email?: string // Opcional si puede ser nulo
	telefono?: string // Opcional si puede ser nulo
}

interface Venta {
	id: string
	fecha: string
	total: number
	id_negocio: string
	id_responsable: string
	cliente_id: string
	boleta?: boolean
	factura?: boolean
	nombre_razon_social?: string
	nombre_contacto?: string
	contacto?: string
	direccion_empresa?: string
	giro?: string
	metodoPago: 'efectivo' | 'tarjeta'
	montoPagado?: number
	vuelto?: number
	comprobante?: string
}

interface DetalleVenta {
	id: string
	venta_id: string
	producto_id: string
	cantidad: number
	precio: number
}

interface Pedido {
	id: number
	fecha: Timestamp
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

interface Notificacion {
	id: string
	mensaje: string
}
export interface VentasMensualesData {
	mes: string
	ventas: number
}

export interface TransaccionesMensualesData {
	mes: string
	transacciones: number
}

export interface TopProductosData {
	nombre: string
	cantidad: number
}
interface VentasConDetalle {
	id: string
	responsable: string
	totalVenta: number
	montoTotal: number
	metodoDePago: string
	detalles: DetalleVentaProducto[]
}

interface DetalleVentaProducto extends DetalleVenta {
	nombre: string
	variante: string
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
	DetallePedido,
	Notificacion,
	Historial,
	VentasMensualesData,
	TransaccionesMensualesData,
	TopProductosData,
	VentasConDetalle,
	DetalleVentaProducto
}
