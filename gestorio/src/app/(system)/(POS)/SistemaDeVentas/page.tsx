'use client'

import Footer from '@components/footer.component'
import Image from 'next/image'
import Product from '@/app/components/POS/product.component'
import { RecentProduct } from '@/app/components/POS/recent-product.component'
import { CreditCard, Banknote } from 'lucide-react'
import { useMenu } from '@/app/hooks/useMenu'
import ToggleMenu from '@/app/components/POS/toggle-menu.component'
import { useState } from 'react'

type PaymentMethod = {
	name: string
	icon: React.ReactNode
}

const paymentMethods: PaymentMethod[] = [
	{ name: 'Efectivo', icon: <Banknote className='mr-2' /> },
	{ name: 'Débito', icon: <CreditCard className='mr-2' /> },
	{ name: 'Crédito', icon: <CreditCard className='mr-2' /> }
]

function PaymentMethodSelector({
	selectedMethod,
	onSelectMethod
}: {
	selectedMethod: string
	onSelectMethod: (method: string) => void
}) {
	return (
		<div className='flex gap-2'>
			{paymentMethods.map((method) => (
				<button
					key={method.name}
					className={`flex w-full justify-center items-center bg-Naranjo/90 p-2 rounded-md transition-all hover:scale-105 ${
						selectedMethod === method.name ? 'bg-orange-500 text-white' : ''
					}`}
					onClick={() => onSelectMethod(method.name)}>
					{method.icon}
					{method.name}
				</button>
			))}
		</div>
	)
}

export default function POS() {
	const { isMenuOpen, toggleMenu } = useMenu()
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo')

	const togglePaymentMethod = (method: string) => {
		setSelectedPaymentMethod(method)
	}

	return (
		<div className='relative transition-all'>
			{/* Overlay translucido (transparencia oscura del menú) */}
			{isMenuOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-40'
					onClick={toggleMenu}
					aria-hidden='true'
				/>
			)}

			<ToggleMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

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
					<div className='flex-1 flex flex-col gap-2 p-4 overflow-y-auto scrollbar-modifier'>
						<Product />
						<Product />
						<Product />
						<Product />
						<Product />
						<Product />
						<Product />
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
								className='border-none outline-none shadow-none bg-transparent bg-Verde text-Blanco placeholder-Blanco w-full ml-2 text-sm'
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
						<div className='flex-1 overflow-y-auto mb-4 scrollbar-modifier pr-2'>
							<RecentProduct />
							<RecentProduct />
							<RecentProduct />
							<RecentProduct />
						</div>

						{/* TODO: Mejorar la sección de pagos */}
						{/* Método de pago */}
						<div>
							<h2 className='mb-2 h-fit'>Método de pago</h2>

							<PaymentMethodSelector
								selectedMethod={selectedPaymentMethod}
								onSelectMethod={togglePaymentMethod}
							/>
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
