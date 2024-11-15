// store/databaseStore.ts
import { create } from 'zustand'
import setupDatabase from '@/lib/db/RxDB' // Ajusta la ruta según tu estructura

interface DatabaseState {
	db: any | null
	initializeDatabase: () => Promise<void>
	setDb: (newDb: any) => void
}

const useDatabaseStore = create<DatabaseState>((set) => ({
	db: null,
	initializeDatabase: async () => {
		try {
			const database = await setupDatabase()
			set({ db: database })
		} catch (error) {
			console.error('Error al inicializar la base de datos:', error)
		}
	},
	setDb: (newDb) => set({ db: newDb })
}))

export default useDatabaseStore
