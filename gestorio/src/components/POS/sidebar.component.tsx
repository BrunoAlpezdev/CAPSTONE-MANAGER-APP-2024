/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { RecentProduct, PaymentMethodSelector } from '@/components'
import { CartItem } from '@/types'
import { products } from '@/mocks/products'
import { ScanBarcode, History } from 'lucide-react'

type SidebarProps = {
	addToSale: (product: CartItem) => void
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

	const saleProducts: CartItem[] = products.map((product) => ({
		...product,
		cantidad: 0
	}))

	const [sidebarItems] = useState<CartItem[]>(saleProducts)

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
		<div className='flex w-1/4 flex-col gap-2 bg-background/90 p-4 text-foreground'>
			<section className='flex w-full flex-row gap-2 rounded-full bg-primary px-6 py-2 shadow-lg'>
				<ScanBarcode />
				<form
					className='flex w-full flex-row'
					onSubmit={(e) => {
						e.preventDefault()
						handleProductAdded(barcode)
					}}>
					<input
						type='text'
						onChange={(e) => setBarcode(e.target.value)}
						placeholder='Ingrese manualmente o escanee código de barras'
						className='ml-2 w-full border-none bg-primary text-sm text-foreground placeholder-foreground shadow-none outline-none'
						value={barcode}
						onFocus={() => setInputFocus(true)}
						onBlur={() => setInputFocus(false)}
					/>
				</form>
			</section>
			<section className='flex w-fit flex-row items-center gap-1 rounded-full bg-primary px-2 py-1 text-sm text-foreground'>
				<History />
				<p>Recientes</p>
			</section>

			<div className='scrollbar-modifier mb-4 flex-1 overflow-y-auto pr-2'>
				{sidebarItems.map((product) => (
					<RecentProduct
						key={product.id}
						id={product.id}
						name={product.nombre}
						variant={product.variante}
						price={product.precio}
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
							<input
								id='comprobante'
								className='rounded-md bg-secondary px-2 py-1 text-secondary-foreground'
							/>
							<button
								type='submit'
								className='mt-2 rounded-lg bg-primary/70 p-2 text-white'>
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
								className='rounded-md bg-secondary px-2 py-1 text-secondary-foreground'
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

							<button
								type='submit'
								className='mt-2 rounded-lg bg-primary/70 p-2 text-white'>
								Confirmar
							</button>
						</form>
					)}
				</div>
			)}
		</div>
	)
}
