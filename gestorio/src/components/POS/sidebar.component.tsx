/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { RecentProduct, PaymentMethodSelector } from '@/components/index'
import { SaleProduct } from '@/types/SaleProduct'
import { products } from '@/mocks/products'

type SidebarProps = {
	addToSale: (product: SaleProduct) => void
	addToSaleByBarcode: (barcode: string) => void
	isPaymentOpen: boolean
	selectedPaymentMethod: string
	togglePaymentMethod: (method: string) => void
	handlePayment: (e: React.FormEvent<HTMLFormElement>) => void
	totalAmount: number
}

export function Sidebar({
	addToSale,
	addToSaleByBarcode,
	isPaymentOpen,
	selectedPaymentMethod,
	togglePaymentMethod,
	handlePayment,
	totalAmount
}: SidebarProps) {
	const [barcode, setBarcode] = useState('')
	const [clientChangeValue, setClientChangeValue] = useState(0)

	const handleProductAdded = (barcode: string) => {
		addToSaleByBarcode(barcode)
		setBarcode('')
	}

	const saleProducts: SaleProduct[] = products.map((product) => ({
		...product,
		quantity: 0
	}))

	const [sidebarItems] = useState<SaleProduct[]>(saleProducts)

	const [inputFocus, setInputFocus] = useState(false)
	const [otherFocus, setOtherFocus] = useState(false)

	useEffect(() => {
		if (otherFocus) {
			return
		}
		const handleKeyPress = (e: KeyboardEvent) => {
			// Ignorar la tecla "Enter"
			if (e.key === 'Enter') {
				handleProductAdded(barcode) // Procesar el código de barras cuando se presione Enter
				setBarcode('') // Limpiar el valor del código de barras
				e.preventDefault() // Evitar que el "enter" haga un comportamiento por defecto
				return
			}

			// Asegúrate de que no se esté escribiendo en otro input
			if (!inputFocus && !otherFocus) {
				// Concatenar el valor de la tecla presionada al código de barras
				setBarcode((prevBarcode) => prevBarcode + e.key)
			}
		}

		// Escuchar el evento keypress en todo el documento
		document.addEventListener('keypress', handleKeyPress)

		// Limpiar el evento al desmontar el componente
		return () => {
			document.removeEventListener('keypress', handleKeyPress)
		}
	}, [barcode, inputFocus, otherFocus])

	return (
		<div className='flex flex-col gap-2 w-1/4 bg-Gris/90 p-4 text-Blanco'>
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
						value={barcode}
						onFocus={() => setInputFocus(true)}
						onBlur={() => setInputFocus(false)}
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

			{isPaymentOpen && (
				<div>
					<h2 className='mb-2 h-fit'>Método de pago</h2>

					<PaymentMethodSelector
						selectedMethod={selectedPaymentMethod}
						onSelectMethod={togglePaymentMethod}
					/>
					{selectedPaymentMethod === 'Crédito' ||
					selectedPaymentMethod === 'Débito' ? (
						<form className='flex flex-col' onSubmit={(e) => handlePayment(e)}>
							<label htmlFor='comprobante'>Número de comprobante</label>
							<input id='comprobante' className='default-input' />
							<button type='submit' className='mt-2 bg-Verde/70 p-2 rounded-lg'>
								Confirmar
							</button>
						</form>
					) : (
						<form
							className='flex flex-col'
							onSubmit={(e) => {
								handlePayment(e)
								setOtherFocus(false)
								setClientChangeValue(0)
							}}>
							<label htmlFor='montoPagado'>Monto Pagado</label>
							<input
								id='montoPagado'
								type='number'
								className='default-input'
								onChange={(e) => {
									if (Number(e.target.value) < totalAmount) {
										setClientChangeValue(0)
									} else {
										setClientChangeValue(Number(e.target.value) - totalAmount)
									}
								}}
								onFocus={() => setOtherFocus(true)}
								onBlur={() => setOtherFocus(false)}
							/>

							<label>Vuelto: {clientChangeValue.toFixed(0)} CLP</label>

							<button type='submit' className='mt-2 bg-Verde/70 p-2 rounded-lg'>
								Confirmar
							</button>
						</form>
					)}
				</div>
			)}
		</div>
	)
}
