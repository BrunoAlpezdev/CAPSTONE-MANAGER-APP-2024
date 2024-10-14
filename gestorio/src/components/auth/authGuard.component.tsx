import { AUTH_ROUTE } from '@/lib/routes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '@/styles/authGuard.css'

export default function AuthGuard() {
	const pathname = usePathname()

	return (
		<div className='authValidation'>
			<pre>Estás intentando acceder a: {pathname}</pre>
			<Link href={`${AUTH_ROUTE}`}>Inicia sesión</Link> para continuar.
		</div>
	)
}
