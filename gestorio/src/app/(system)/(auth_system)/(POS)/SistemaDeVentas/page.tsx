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
import { useEffect, useState } from 'react'
import { MenuIcon } from '@/components/icons'
import setupDatabase from '@/lib/db/RxDB'
import { RxDatabase } from 'rxdb'

export default function POS() {
	const [db, setDb] = useState<RxDatabase | null>(null)
	const [error, setError] = useState<string | null>(null)
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
	const [mounted, setMounted] = useState(false)

	// Para evitar problemas de renderizado por desincronización en el servidor y el cliente
	useEffect(() => {
		setMounted(true)
		async function initDatabase() {
			try {
				const database = await setupDatabase() // Invoca la función de setup
				setDb(database) // Almacena la referencia de la base de datos en el estado
			} catch (err) {
				console.error('Error setting up the database:', err)
				setError('Failed to setup database')
			}
		}

		initDatabase() // Llama a la función de inicialización
	}, [])

	if (!mounted) return null // Para evitar que el componente se renderice antes de que el tema se monte

	return (
		<div className='relative transition-all'>
			{/* Overlay translucido (transparencia oscura del menú) */}
			{isMenuOpen && (
				<div
					className='fixed inset-0 z-40 bg-black bg-opacity-50'
					onClick={toggleMenu}
					aria-hidden='true'
				/>
			)}

			<ToggleMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

			{/* Main POS */}
			<div className='flex h-screen flex-col text-foreground'>
				<header className='flex h-16 items-center justify-between px-3'>
					<button onClick={toggleMenu}>
						<MenuIcon className='fill-foreground' />
					</button>
					<FullLogo size='large' />
				</header>
				<main className='inner-custom-shadow dashboard-fondo z-auto flex flex-1 overflow-hidden dark:bg-foreground dark:text-black'>
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
			</div>
		</div>
	)
}
