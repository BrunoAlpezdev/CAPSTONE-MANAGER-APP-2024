import PouchDB from 'pouchdb'

// Instancia local de PouchDB
const localDB = new PouchDB('local-database')

// Sincronizar Firestore con PouchDB
localDB
	.sync('https://<firebase-firestore-endpoint>', {
		live: true, // Repite la sincronización en tiempo real
		retry: true // Reintenta si hay fallos en la conexión
	})
	.on('change', function (info) {
		// Maneja cualquier cambio
		console.log('Cambio detectado: ', info)
	})
	.on('error', function (err) {
		console.error('Error en la sincronización: ', err)
	})
