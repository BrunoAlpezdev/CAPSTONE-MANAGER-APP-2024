import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase.config'

export const login = async (email: string, password: string) => {
	try {
		const user = await signInWithEmailAndPassword(auth, email, password)
		return user.user.getIdToken()
	} catch (error) {
		return error
	}
}
