import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

export { app, firestore, storage, auth }
