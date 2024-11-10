import { create } from 'zustand'

// Define el tipo para el estado
interface ImageStore {
	imageUrls: { [key: string]: string }
	setImageUrl: (key: string, url: string) => void
}

// Crea el store con el tipo explícito
const useImageStore = create<ImageStore>((set) => ({
	imageUrls: {},
	setImageUrl: (key, url) =>
		set((state) => ({
			imageUrls: { ...state.imageUrls, [key]: url }
		}))
}))

export default useImageStore
