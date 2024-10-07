import { AuthError, Session, User, WeakPassword } from '@supabase/supabase-js'

interface gestorioUser {
	data: {
		user: User
		session: Session
		weakPassword?: WeakPassword // Opcional
	}
	error: AuthError | null
}

interface Tienda {
	id: number
	nombre: string
	direccion: string
	telefono?: string // Opcional si puede ser nulo
}

interface Producto {
	id: number
	nombre: string
	descripcion?: string // Opcional si puede ser nulo
	precio: number // Asumiendo que el precio es un número entero en CLP
	cantidad: number
	tienda_id: number
}

interface Proveedor {
	id: number
	nombre: string
	contacto?: string // Opcional si puede ser nulo
	telefono?: string // Opcional si puede ser nulo
	tienda_id: number
}

interface Usuario {
	id: number
	nombre: string
	email: string
	rol: string
	tienda_id: number
	auth_user_id?: string // UUID, opcional si puede ser nulo
}

interface Cliente {
	id: number
	nombre: string
	email?: string // Opcional si puede ser nulo
	telefono?: string // Opcional si puede ser nulo
}

interface Venta {
	id: number
	fecha: Date // Timestamp
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
	fecha: Date // Timestamp
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
	gestorioUser,
	Tienda,
	Producto,
	Proveedor,
	Usuario,
	Cliente,
	Venta,
	DetalleVenta,
	Pedido,
	DetallePedido
}
