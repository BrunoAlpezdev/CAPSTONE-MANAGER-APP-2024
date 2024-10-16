'use client'

import {
	ProductList,
	ToggleMenu,
	Footer,
	Sidebar,
	POSFooter,
	FullLogo
} from '@/components/index'
import { useMenu } from '@/hooks'
import { useSale } from '@/hooks'
import { usePayment } from '@/hooks'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { MenuIcon } from '@/components/icons'
export default function POS() {
	const { isMenuOpen, toggleMenu } = useMenu()
	const {
		saleItems,
		addToSale,
		addToSaleByBarcode,
		updateQuantity,
		totalAmount
	} = useSale()
	const {
		isPaymentOpen,
		setIsPaymentOpen,
		selectedPaymentMethod,
		togglePaymentMethod,
		handlePayment
	} = usePayment(totalAmount)
	const [isSelected, setIsSelected] = useState(true)

	const { theme } = useTheme()
	const [mounted, setMounted] = useState(false)

	// Para evitar problemas de renderizado por desincronización en el servidor y el cliente
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null // Para evitar que el componente se renderice antes de que el tema se monte

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
			<div className='flex flex-col h-screen text-foreground'>
				<header className='flex justify-between items-center h-16 px-3'>
					<button onClick={toggleMenu}>
						<MenuIcon className='fill-foreground' />
					</button>
					<FullLogo size='large' />
				</header>
				<main className='inner-custom-shadow dashboard-fondo flex-1 flex overflow-hidden dark:bg-foreground dark:text-black z-auto'>
					{/* Lista de Productos */}
					<ProductList saleItems={saleItems} updateQuantity={updateQuantity} />
					{/* Sidebar */}
					<Sidebar
						addToSale={addToSale}
						addToSaleByBarcode={addToSaleByBarcode}
						isPaymentOpen={isPaymentOpen}
						selectedPaymentMethod={selectedPaymentMethod}
						togglePaymentMethod={togglePaymentMethod}
						handlePayment={handlePayment}
						totalAmount={totalAmount}
					/>
				</main>
				{/* Footer */}
				{/* TODO: Terminar Footer */}
				<POSFooter
					isSelected={isSelected}
					setIsSelected={setIsSelected}
					setIsPaymentOpen={setIsPaymentOpen}
					isPaymentOpen={isPaymentOpen}
					totalAmount={totalAmount}
				/>
				<Footer />
			</div>
		</div>
	)
}
