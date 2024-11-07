import { addRxPlugin, createRxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { replicateFirestore } from 'rxdb/plugins/replication-firestore'
import { disableWarnings, RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { firestore } from '@/firebase' // archivo de configuración de Firebase
import {
	collection,
	getDocs,
	query,
	serverTimestamp,
	updateDoc
} from 'firebase/firestore'
import { negocioSchema } from './schemas'

disableWarnings()

// Inicializa RxDB
async function setupDatabase() {
	if (process.env.NODE_ENV === 'development') {
		await import('rxdb/plugins/dev-mode').then((module) =>
			addRxPlugin(module.RxDBDevModePlugin)
		)
	}

	/* // Realizar el setup de la base de datos solo si es un rango horario especifico
	const date = new Date()
	const hour = date.getHours()
	if (hour < 10 || hour > 12) {
		console.log('No se puede replicar la base de datos en este horario')
		return
	} else if (hour < 18 || hour > 22) {
		console.log('No se puede replicar la base de datos en este horario')
		return
	} */

	// Crea una nueva base de datos con el nombre 'replicateddb'
	const db = await createRxDatabase({
		name: 'replicateddb',
		storage: getRxStorageDexie(),
		ignoreDuplicate: true
	})

	await db.addCollections({
		negocios: {
			schema: negocioSchema
		}
	})
	const envProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

	if (!envProjectId) {
		throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set')
	}
	// Configuración de replicación con Firestore
	/* const replicationState =  */
	replicateFirestore({
		collection: db.negocios,
		firestore: {
			projectId: envProjectId,
			collection: collection(firestore, 'negocios'), // Utiliza la referencia directa de Firestore
			database: firestore
		},
		replicationIdentifier: 'negocios-replication', // Identificador de la replicación
		deletedField: '_deleted', // Campo para marcar elementos como eliminados
		pull: {
			batchSize: 1 // Número de documentos a obtener por lote desde Firestore
		},
		push: {
			batchSize: 1 // Número de documentos a enviar por lote hacia Firestore
		},
		serverTimestampField: 'serverTimestamp'
	})

	// Función para obtener los documentos de la colección 'negocios'
	setTimeout(async () => {
		try {
			const negocios = await db.negocios.find().exec()
			console.log(
				'Datos almacenados en RxDB:',
				negocios.map((n) => n.toJSON())
			)
		} catch (error) {
			console.error('Error al consultar RxDB:', error)
		}
	}, 1000) // Ajusta el tiempo si es necesario

	const verificarDatosEnFirestore = async () => {
		const querySnapshot = await getDocs(collection(firestore, 'negocios'))
		querySnapshot.forEach((doc) => {
			console.log(doc.id, ' => ', doc.data())
		})
	}

	verificarDatosEnFirestore()

	/* 	const allDocsResult = await getDocs(query(collection(firestore, 'negocios')))
	allDocsResult.forEach((doc) => {
		updateDoc(doc.ref, {
			_deleted: false,
			serverTimestamp: serverTimestamp()
		})
	}) */

	return db
}

export default setupDatabase

/*
https://rxdb.info/replication-firestore.html

¡¡HAY QUE UTILIZAR SOFT DELETE PARA MARCAR LOS ELEMENTOS COMO ELIMINADOS EN FIRESTORE!!!!

En caso de requerir un filtrado de datos, se puede utilizar
pull: {
            filter: [
                where('ownerId', '==', userId)
            ]
        },
        push: {
            filter: (item) => item.syncEnabled === true
        }
los filtros de datos se pueden realizar con la función where de RxDB
para sincronizar solo los datos de ciertos negocios

Keep in mind that you can not use inequality operators (<, <=, !=, not-in, >, or >=) in pull.filter since that would cause a conflict with ordering by serverTimestamp.

*/
