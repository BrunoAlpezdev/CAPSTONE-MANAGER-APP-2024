import { getAuth, signInWithEmailAndPassword, User } from 'firebase/auth'
import { app } from './firebase.config'

const auth = getAuth(app)

export const login = async (
	email: string,
	password: string
): Promise<{ user?: User; error?: string }> => {
	try {
		const user = await signInWithEmailAndPassword(auth, email, password)

		if (user.operationType === null || user.operationType === undefined) {
			return { error: 'Error al iniciar sesión' }
		}

		return { user: user.user }
	} catch (error: any) {
		return { error: '' + error }
	}
}
