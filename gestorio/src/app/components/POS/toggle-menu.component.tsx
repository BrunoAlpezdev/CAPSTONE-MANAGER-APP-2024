import { X, Home, Package, Truck, BarChart } from 'lucide-react'
import Link from 'next/link'

type ToggleMenuProps = {
	isMenuOpen: boolean
	toggleMenu: () => void
}

/* El div contenedor de este menú DEBE ser relativo */
export default function ToggleMenu({
	isMenuOpen,
	toggleMenu
}: ToggleMenuProps) {
	return (
		<div
			className={`fixed left-0 top-0 h-full w-64 bg-Gris/75 backdrop-blur-sm p-4 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
			{/* Menú Sidebar */}
			<button className='absolute top-4 right-4' onClick={toggleMenu}>
				<X className='h-6 w-6' />
				<span className='sr-only'>Close menu</span>
			</button>
			<nav className='flex flex-col gap-3 mt-16 transition-all'>
				<Link
					href='/home'
					className='w-full grid grid-cols-3 items-center gap-3 transition-all hover:bg-Blanco/20 p-2 rounded-lg'>
					<div className='place-self-center col-span-1'>
						<Home />
					</div>
					<span className='place-content-start col-span-2'>Dashboard</span>
				</Link>
				<Link
					href='/Inventario'
					className='w-full grid grid-cols-3 items-center gap-3 transition-all hover:bg-Blanco/20 p-2 rounded-lg'>
					<div className='place-self-center col-span-1'>
						<Package />
					</div>
					<span className='place-content-start col-span-2'>Inventario</span>
				</Link>
				<Link
					href='/Proveedores'
					className='w-full grid grid-cols-3 items-center gap-3 transition-all hover:bg-Blanco/20 p-2 rounded-lg'>
					<div className='place-self-center col-span-1'>
						<Truck />
					</div>
					<span className='place-content-start col-span-2'>Proveedores</span>
				</Link>
				<Link
					href='/Reportes'
					className='w-full grid grid-cols-3 items-center gap-3 transition-all hover:bg-Blanco/20 p-2 rounded-lg'>
					<div className='place-self-center col-span-1'>
						<BarChart />
					</div>
					<span className='place-content-start col-span-2'>Reportes</span>
				</Link>
			</nav>
		</div>
	)
}
