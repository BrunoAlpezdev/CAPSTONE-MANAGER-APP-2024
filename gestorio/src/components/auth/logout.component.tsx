'use server '
import { useAuthStore } from '@/store/authStore'
import { LogOut } from 'lucide-react'

export default async function LogoutComponent() {
	return (
		<form onSubmit={async () => {}}>
			<button
				className='flex cursor-pointer select-none flex-row items-center gap-2'
				type='submit'>
				<LogOut />
				<p>Cerrar Session</p>
			</button>
		</form>
	)
}
