'use server '
import { useAuthStore } from '@/store/authStore'
import { LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function LogoutComponent() {
	const { logout } = useAuthStore()

	return (
		<form
			onSubmit={async () => {
				await logout()
			}}>
			<button
				className='flex flex-row gap-2 items-center cursor-pointer select-none '
				type='submit'>
				<LogOut />
				<p>Cerrar Session</p>
			</button>
		</form>
	)
}
