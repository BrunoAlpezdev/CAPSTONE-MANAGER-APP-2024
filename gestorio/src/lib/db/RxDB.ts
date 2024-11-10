import { addRxPlugin, createRxDatabase } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { replicateFirestore } from 'rxdb/plugins/replication-firestore'
import { disableWarnings, RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { firestore } from '@/firebase' // archivo de configuración de Firebase
import {
	collection,
	deleteField,
	getDocs,
	query,
	serverTimestamp,
	updateDoc
} from 'firebase/firestore'
import { schemas } from './schemas'

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

	/* const allDocsResult = await getDocs(collection(firestore, 'productos'))
	allDocsResult.forEach((doc) => {
		updateDoc(doc.ref, {
			_deleted: false,
			serverTimestamp: serverTimestamp(),
			correo: doc.data().email,
			email: deleteField(),
			id_negocio: 'qlIc5gWngrVdqbN49Y439IFc8g02'
		})
	}) */

	await db.addCollections(
		Object.fromEntries(
			Object.entries(schemas).map(([name, schema]) => [name, { schema }])
		)
	)
	const envProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
	if (!envProjectId) {
		throw new Error('FIREBASE_PROJECT_ID is not set')
	}

	// Helper function to replicate each collection
	const setupReplication = (collectionName: string) => {
		replicateFirestore({
			collection: db[collectionName],
			firestore: {
				projectId: envProjectId,
				collection: collection(firestore, collectionName),
				database: firestore
			},
			replicationIdentifier: `${collectionName}-replication`,
			deletedField: '_deleted',
			pull: { batchSize: 10 },
			push: { batchSize: 10 },
			serverTimestampField: 'serverTimestamp'
		})
	}
	// Setup replication for each collection
	Object.keys(schemas).forEach(setupReplication)

	console.log('Base de datos inicializada')

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

/*
	https://rxdb.info/migration-schema.html
	Upon creation of a collection, you have to provide migrationStrategies
	when your schema's version-number is greater than 0. To do this,
	you have to add an object to the migrationStrategies property
	where a function for every schema-version is assigned.
	A migrationStrategy is a function which gets the old document-data as a parameter and returns the new,
	transformed document-data. If the strategy returns null, the document will be removed instead of migrated.

	myDatabase.addCollections({
		messages: {
			schema: messageSchemaV1,
			migrationStrategies: {
				// 1 means, this transforms data from version 0 to version 1
				1: function (oldDoc) {
					oldDoc.time = new Date(oldDoc.time).getTime() // string to unix
					return oldDoc
				}
			}
		}
	}) */
