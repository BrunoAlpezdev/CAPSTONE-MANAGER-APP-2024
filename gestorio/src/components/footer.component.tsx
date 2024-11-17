import { Copyright } from 'lucide-react'

export function FooterComponent() {
	return (
		<footer className='flex flex-row items-center justify-center bg-primary/80 text-center text-sm font-light text-Blanco backdrop-blur-lg'>
			<Copyright className='mr-1' size={15} />
			Gestorio CL
		</footer>
	)
}
