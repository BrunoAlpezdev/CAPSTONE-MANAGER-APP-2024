import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from './firebase.config'

const auth = getAuth(app)

export const login = async (email: string, password: string) => {
	try {
		const user = await signInWithEmailAndPassword(auth, email, password)
		return user
	} catch (error) {
		return error
	}
}
