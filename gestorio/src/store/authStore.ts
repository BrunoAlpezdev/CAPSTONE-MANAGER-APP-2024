/* eslint-disable no-unused-vars */
import { create } from 'zustand'

interface AuthState {
	userUuid: string | null
	setUserUuid: (user: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
	userUuid: null,
	setUserUuid: (userUuid) => set({ userUuid })
}))
