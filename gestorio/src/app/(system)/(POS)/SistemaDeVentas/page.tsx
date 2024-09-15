/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import {
	ProductList,
	ToggleMenu,
	Product,
	Footer,
	RecentProduct
} from '@/components/index'
import { useMenu } from '@/hooks/useMenu'
import { SaleProduct } from '@/types/SaleProduct'
import { Switch } from '@nextui-org/switch'
import {
	Ban,
	Banknote,
	Bookmark,
	Building2,
	CreditCard,
	HandCoins,
	User
} from 'lucide-react'
import Image from 'next/image'
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
	/* Menú lateral */
	const { isMenuOpen, toggleMenu } = useMenu()
	/* Switch de Boleta o Factura */
	const [isSelected, setIsSelected] = useState(true)
	/* Método de pago */
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo')
	const [isPaymentOpen, setIsPaymentOpen] = useState(false)
	/* Temporal del sidebar y cambio */
	const [barcode, setBarcode] = useState('')
	const [clientChangeValue, setClientChangeValue] = useState(0)
	const [cashAmount, setCashAmount] = useState(0)
	/* Sale/Carrito */
	const [saleItems, setSaleItems] = useState<SaleProduct[]>([])
	const [sidebarItems, setSidebarItems] = useState<SaleProduct[]>([
		{
			id: 1,
			name: 'El Toro Rojo',
			variant: 'Tamaño L',
			price: 1700,
			stock: 24,
			quantity: 0
		},
		{
			id: 2,
			name: 'Energizante X',
			variant: 'Tamaño M',
			price: 1500,
			stock: 30,
			quantity: 0
		}
	])

	const setDefaultSale = () => {
		setSaleItems([])
		setIsPaymentOpen(false)
		setClientChangeValue(0)
	}

	const addToSale = (product: SaleProduct) => {
		const existingItem = saleItems.find((item) => item.id === product.id)
		if (existingItem) {
			setSaleItems(
				saleItems.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			)
		} else {
			setSaleItems([...saleItems, { ...product, quantity: 1 }])
		}
	}

	const updateQuantity = (id: number, newQuantity: number) => {
		if (newQuantity === 0) {
			setSaleItems(saleItems.filter((item) => item.id !== id))
		} else {
			setSaleItems(
				saleItems.map((item) =>
					item.id === id ? { ...item, quantity: newQuantity } : item
				)
			)
		}
	}

	const totalAmount = saleItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	)

	const togglePaymentMethod = (method: string) => {
		setSelectedPaymentMethod(method)
	}

	const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (selectedPaymentMethod === 'Efectivo') {
			console.log(
				`Pago de ${totalAmount} con ${selectedPaymentMethod}. Cliente paga ${cashAmount} , vuelto: ${clientChangeValue}`
			)
			setDefaultSale()
		} else {
			console.log(
				`Pago de ${totalAmount} con ${selectedPaymentMethod}, número de comprobante: ${e.currentTarget.comprobante.value}`
			)
			setDefaultSale()
		}
	}

	const handleProductAdded = (barcode: string) => {
		console.log(barcode)
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
						{saleItems.map((item) => (
							<Product
								key={item.id}
								id={item.id}
								name={item.name}
								variant={item.variant}
								price={item.price}
								quantity={item.quantity}
								onUpdateQuantity={updateQuantity}
								stock={item.stock}
							/>
						))}
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
							<form
								className='flex flex-row w-full'
								onSubmit={(e) => {
									e.preventDefault()
									handleProductAdded(barcode)
								}}>
								<input
									type='text'
									onChange={(e) => setBarcode(e.target.value)}
									placeholder='Ingrese manualmente o escanee código de barras'
									className='border-none outline-none shadow-none bg-transparent bg-Verde text-Blanco placeholder-Blanco w-full ml-2 text-sm'
								/>
							</form>
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
							{sidebarItems.map((product) => (
								<RecentProduct
									key={product.id}
									id={product.id}
									name={product.name}
									variant={product.variant}
									price={product.price}
									stock={product.stock}
									onAddToSale={addToSale}
								/>
							))}
						</div>

						{/* TODO: Mejorar la sección de pagos */}
						{/* Método de pago */}
						{isPaymentOpen && (
							<div>
								<h2 className='mb-2 h-fit'>Método de pago</h2>

								<PaymentMethodSelector
									selectedMethod={selectedPaymentMethod}
									onSelectMethod={togglePaymentMethod}
								/>
								{selectedPaymentMethod === 'Crédito' ||
								selectedPaymentMethod === 'Débito' ? (
									<form
										className='flex flex-col'
										onSubmit={(e) => handlePayment(e)}>
										<label htmlFor='comprobante'>Número de comprobante</label>
										<input id='comprobante' className='default-input' />
										<button
											type='submit'
											className='mt-2 bg-Verde/70 p-2 rounded-lg'>
											Confirmar
										</button>
									</form>
								) : (
									<form
										className='flex flex-col'
										onSubmit={(e) => handlePayment(e)}>
										<label htmlFor='montoPagado'>Monto Pagado</label>
										<input
											id='montoPagado'
											type='number'
											className='default-input'
											onChange={(e) => {
												setCashAmount(Number(e.target.value))
												setClientChangeValue(
													totalAmount - Number(e.target.value)
												)
											}}
										/>

										<label>Vuelto: {clientChangeValue.toFixed(2)}</label>

										<button
											type='submit'
											className='mt-2 bg-Verde/70 p-2 rounded-lg'>
											Confirmar
										</button>
									</form>
								)}
							</div>
						)}
					</div>
				</main>
				{/* Footer */}
				{/* TODO: Terminar Footer */}
				<footer className='bg-Gris/90 p-4 flex items-center'>
					<div className='flex text-md bg-Verde/70 rounded-lg py-2 px-4 w-[73.9dvw] justify-between'>
						<div className='flex items-center gap-4'>
							<button className='bg-Verde/70 p-2 rounded-md border flex flex-row gap-2'>
								<Ban />
								Cancelar
							</button>
							<button className='bg-Verde/70 p-2 rounded-md border flex flex-row gap-2'>
								<Bookmark />
								Dejar Pendiente
							</button>
							<Switch
								isSelected={isSelected}
								onValueChange={setIsSelected}
								defaultSelected
								size='lg'
								color='success'
								startContent={<User />}
								endContent={<Building2 />}>
								<p className=' text-default-300'>
									{isSelected ? 'Boleta' : 'Factura'}
								</p>
							</Switch>
						</div>
						<div className='flex flex-row gap-3 items-center'>
							<button
								className='bg-Naranjo text-white border p-2 rounded-lg flex flex-row gap-2'
								onClick={() => setIsPaymentOpen(!isPaymentOpen)}>
								<HandCoins />
								Pagar
							</button>
							<span>Total $</span>
							<strong className='bg-Verde/70 p-2 rounded-lg'>
								{totalAmount.toFixed(0)}
							</strong>
						</div>
					</div>
				</footer>
				<Footer />
			</div>
		</div>
	)
}
