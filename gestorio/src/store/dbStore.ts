import { RxDatabase } from 'rxdb'
import { create } from 'zustand'

interface DbState {
	db: RxDatabase | null
}

interface SetDb {
	(db: RxDatabase): void
}

interface DbStore extends DbState {
	setDb: SetDb
}

export const useDbStore = create<DbStore>((set) => ({
	db: null,
	setDb: (db: RxDatabase) => set({ db })
}))
