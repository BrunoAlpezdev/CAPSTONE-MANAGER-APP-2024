/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { type User } from '@supabase/supabase-js'
import { createClient } from '@/app/supabase/client'

const supabase = createClient()

interface State {
	user: User | null
	login: (email: string, password: string) => Promise<any>
	setUser: (user: User) => void
	logout: () => Promise<void>
}

/**
 * Zustand store for authentication management.
 *
 * Esta tienda maneja el estado de autenticación del usuario, incluyendo inicio de sesión, cierre de sesión y configuración del usuario.
 *
 * @constant
 * @type {State}
 *
 * @property {User | null} user - El usuario autenticado actual, o null si no está autenticado.
 * @property {(email: string, password: string) => Promise<any>} login - Función para iniciar sesión de un usuario con correo electrónico y contraseña.
 * @property {(user: User) => void} setUser - Función para establecer el usuario actual.
 * @property {() => Promise<void>} logout - Función para cerrar sesión del usuario actual.
 *
 */
export const useAuthStore = create<State>((set, get) => {
	return {
		user: null,
		login: async (email: string, password: string) => {
			const formData = {
				email: email,
				password: password
			}

			const { data, error } = await supabase.auth.signInWithPassword(formData)

			if (error) {
				return { error }
			}

			if (data) {
				set({ user: data.user })
				return data
			}
		},
		setUser: async (user: User) => set({ user }),
		logout: async () => {
			const { error } = await supabase.auth.signOut()

			if (error) {
				console.error(error)
				return
			}
			set({ user: null })
		}
	}
})
