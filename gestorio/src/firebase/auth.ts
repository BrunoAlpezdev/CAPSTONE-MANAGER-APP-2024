import { auth } from './firebaseConfig'
import {
	signInWithEmailAndPassword,
	signOut,
	User,
	setPersistence,
	browserSessionPersistence
} from 'firebase/auth'
import { useAuthStore } from '@/store/authStore'

export async function firebase_signIn(
	email: string,
	password: string
): Promise<User | null> {
	const { setUser } = useAuthStore.getState()
	try {
		await setPersistence(auth, browserSessionPersistence)
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		)
		setUser(userCredential.user)
		return userCredential.user
	} catch (error) {
		setUser(null)
		return null
	}
}

export async function firebase_signOut(): Promise<boolean> {
	const { setUser } = useAuthStore.getState()
	try {
		await signOut(auth)
		console.log('Sign-out successful.')
		setUser(null)
		return true
	} catch (error) {
		console.log('An error happened: ' + error)
		return false
	}
}
