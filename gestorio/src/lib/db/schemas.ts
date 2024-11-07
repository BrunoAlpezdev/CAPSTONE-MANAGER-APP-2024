export const negocioSchema = {
	title: 'negocios schema',
	description: 'describes a negocio',
	version: 0,
	primaryKey: 'id', // Asegúrate que este campo está bien definido y corresponde al Firestore
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 22 },
		usuario_id: { type: 'string' },
		_deleted: { type: 'boolean', default: false },
		authToken: { type: 'string' },
		correo: { type: 'string' },
		nombreNegocio: { type: 'string' },
		plan: { type: 'string' },
		telefono: { type: 'number' }
	}
}
