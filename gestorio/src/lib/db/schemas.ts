const negocioSchema = {
	title: 'negocios schema',
	description: 'describes a negocio',
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 40 },
		usuario_id: { type: 'string' },
		_deleted: { type: 'boolean', default: false },
		authToken: { type: 'string' },
		correo: { type: 'string' },
		nombreNegocio: { type: 'string' },
		plan: { type: 'string' },
		telefono: { type: 'number' }
	}
}

const productoSchema = {
	title: 'productos schema',
	description: 'describes a producto',
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 40 },
		barcode: { type: 'string' },
		id_negocio: { type: 'string' },
		_deleted: { type: 'boolean', default: false },
		imagen: { type: 'string' },
		nombre: { type: 'string' },
		precio: { type: 'number' },
		stock: { type: 'number' },
		variante: { type: 'string' }
	}
}

const usuarioSchema = {
	title: 'usuarios schema',
	description: 'describes a usuario',
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 40 },
		id_negocio: { type: 'string' },
		_deleted: { type: 'boolean', default: false },
		correo: { type: 'string' },
		passwordHash: { type: 'string' },
		nombre: { type: 'string' },
		rol: { type: 'string' }
	}
}

const ventaSchema = {
	title: 'ventas schema',
	description: 'describes a venta',
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 40 },
		fecha: { type: 'string', format: 'date-time' },
		total: { type: 'number' },
		monto_pagado: { type: 'number' },
		vuelto: { type: 'number' },
		comprobante: { type: 'string' },
		id_negocio: { type: 'string' },
		id_responsable: { type: 'string' },
		cliente_id: { type: 'string' },
		boleta: { type: 'boolean', default: false },
		factura: { type: 'boolean', default: false },
		nombre_razon_social: { type: 'string' },
		nombre_contacto: { type: 'string' },
		contacto: { type: 'string' },
		direccion_empresa: { type: 'string' },
		giro: { type: 'string' },
		metodoPago: { type: 'string', enum: ['efectivo', 'tarjeta'] }
	}
}

const detalleVentaSchema = {
	title: 'detalle venta schema',
	description: 'describes a detalleVenta',
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 40 },
		id_venta: { type: 'string' },
		_deleted: { type: 'boolean', default: false },
		cantidad: { type: 'number' },
		id_producto: { type: 'string' },
		precio: { type: 'number' }
	}
}

export const schemas = {
	negocios: negocioSchema,
	productos: productoSchema,
	usuarios: usuarioSchema,
	ventas: ventaSchema,
	detalle_ventas: detalleVentaSchema
}
