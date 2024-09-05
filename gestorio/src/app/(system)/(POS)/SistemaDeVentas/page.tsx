'use client'

import Footer from '@components/footer.component'
import Image from 'next/image'
import Product from '@components/product.component'
import { RecentProduct } from '@/app/components/recent-product.component'
import { useState } from 'react'
import { X, Home, Package, Truck, BarChart } from 'lucide-react'
import Link from 'next/link'

export default function POS() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}
	return (
		<div className='relative'>
			{/* Overlay translucido (transparencia oscura del menú) */}
			{isMenuOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40'
					onClick={toggleMenu}
					aria-hidden='true'
				/>
			)}

			{/* Menú Sidebar */}
			<div
				className={`fixed left-0 top-0 h-full w-64 bg-Gris/75 backdrop-blur-sm p-4 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
			{/* Main POS */}
			<div className='flex flex-col h-screen text-white'>
				<header className='flex justify-between items-center h-16 px-3'>
					<button onClick={toggleMenu}>
						<Image src='menu.svg' alt='alt' width={30} height={30} />
					</button>
					<Image
						width={200}
						height={40}
						src='/SAVANNALOGOpng.png'
						alt='logo de negocio'
					/>
				</header>
				<main className='flex-1 flex overflow-hidden'>
					{/* TODO: Hacer funcional los productos con los mocks */}
					{/* Lista de Productos */}
					<div className='flex-1 flex flex-col gap-2 p-4 overflow-y-auto'>
						<Product />
						<Product />
						<Product />
					</div>
					{/* Sidebar */}
					<div className='flex flex-col gap-2 w-1/4 bg-Gris/90 p-4 text-Blanco'>
						{/* Escaneo o ingreso de código */}
						<section className='flex flex-row w-full bg-Verde gap-2 px-6 py-2 rounded-full shadow-lg'>
							<Image
								width={30}
								height={30}
								src='/barcode.svg'
								alt='icono de código de barras'
							/>
							<input
								type='text'
								placeholder='Ingrese manualmente o escanee código de barras'
								className='border-none outline-none shadow-none bg-transparent bg-Verde text-Blanco placeholder-Blanco w-full ml-2'
							/>
						</section>
						<section className='flex flex-row items-center w-fit px-2 py-1 text-sm bg-Verde rounded-full text-Blanco gap-1'>
							<Image
								width={25}
								height={25}
								src='/recent.svg'
								alt='icono de código de barras'
							/>
							<p>Recientes</p>
						</section>

						{/* TODO: Hacer funcional los productos recientes con los mocks */}
						{/* Productos Recientes */}
						<div className='flex-1 overflow-y-auto mb-4'>
							<RecentProduct />
							<RecentProduct />
							<RecentProduct />
						</div>

						{/* TODO: Mejorar la sección de pagos */}
						{/* Método de pago */}
						<div>
							<h2 className='mb-2'>Método de pago</h2>
							<div className='space-y-2'>
								{['Efectivo', 'Débito', 'Crédito'].map((method, index) => (
									<button key={index} className='w-full justify-start'>
										{method}
									</button>
								))}
							</div>
						</div>
					</div>
				</main>
				{/* Footer */}
				{/* TODO: Terminar Footer */}
				<footer className='bg-Gris/90 p-4 flex justify-between items-center'>
					<div className='flex space-x-2'>
						<button>Cancelar</button>
						<button>Dejar Pendiente</button>
						<button className='bg-orange-500 text-white'>Boleta/Factura</button>
					</div>
					<div className='flex items-center'>
						<span className='mr-4'>Total $</span>
						<button className='bg-orange-500 text-white'>Pagar 31.300</button>
					</div>
				</footer>
				<Footer />
			</div>
		</div>
	)
}
