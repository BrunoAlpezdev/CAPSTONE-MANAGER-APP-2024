import { addRxPlugin, createRxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { replicateFirestore } from 'rxdb/plugins/replication-firestore'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { firestore } from '@/firebase' // archivo de configuración de Firebase
import {
	collection,
	getDocs,
	query,
	serverTimestamp,
	updateDoc
} from 'firebase/firestore'

if (process.env.NODE_ENV === 'development') {
	addRxPlugin(RxDBDevModePlugin)
}
// Inicializa RxDB
async function setupDatabase() {
	const db = await createRxDatabase({
		name: 'replicateddb',
		storage: getRxStorageDexie(),
		ignoreDuplicate: true
	})

	await db.addCollections({
		negocios: {
			schema: {
				title: 'negocios schema',
				description: 'describes a negocio',
				version: 0,
				primaryKey: 'id', // Asegúrate que este campo está bien definido y corresponde al Firestore
				type: 'object',
				properties: {
					id: { type: 'string', maxLength: 22 }, // Debe estar presente y no ser falsy
					nombreNegocio: { type: 'string' },
					correo: { type: 'string' },
					authToken: { type: 'string' },
					plan: { type: 'string' },
					telefono: { type: 'string' },
					_deleted: { type: 'boolean' }
				}
			}
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
			batchSize: 10 // Número de documentos a obtener por lote desde Firestore
		},
		push: {
			batchSize: 10 // Número de documentos a enviar por lote hacia Firestore
		}
	})

	const allDocs = await getDocs(query(collection(firestore, 'negocios')))
	allDocs.forEach((doc) => {
		updateDoc(doc.ref, {
			_deleted: false,
			serverTimestamp: serverTimestamp()
		})
	})

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
