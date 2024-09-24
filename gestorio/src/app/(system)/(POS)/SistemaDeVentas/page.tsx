'use client'

import {
	ProductList,
	ToggleMenu,
	Footer,
	Sidebar,
	POSFooter
} from '@/components/index'
import { useMenu } from '@/hooks/useMenu'
import { useSale } from '@/hooks/useSale'
import { usePayment } from '@/hooks/usePayment'
import Image from 'next/image'
import { useState } from 'react'

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
