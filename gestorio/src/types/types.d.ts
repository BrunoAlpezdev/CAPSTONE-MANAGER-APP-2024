import { AuthError, Session, User, WeakPassword } from '@supabase/supabase-js'

export interface gestorioUser {
	data: {
		user: User
		session: Session
		weakPassword?: WeakPassword // Opcional
	}
	error: AuthError | null
}
