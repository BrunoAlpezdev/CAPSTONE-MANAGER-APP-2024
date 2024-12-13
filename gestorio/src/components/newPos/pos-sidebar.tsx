import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { Producto } from '@/types'
import { ShoppingBasket } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { CSSProperties } from 'react'
import { Product } from '../POS/product.component'

const cssOverride: CSSProperties = {
	display: 'block',
	margin: '0 auto',
	borderColor: 'red'
}

interface PosSidebarProps {
	setOtherFocus: (focus: boolean) => void
	addToCartByBarcode: (barcode: string) => void
	setScannedCode: (code: string) => void
	scannedCode: string
	setInputFocus: (focus: boolean) => void
	searchTerm: string
	setSearchTerm: (term: string) => void
	productsLoading: boolean
	filteredProducts: Producto[]
	addToCart: (product: Producto) => void
	calculateTotal: () => number
	paymentMethod: string
	setPaymentMethod: (method: string) => void
	cashAmount: number
	setCashAmount: (amount: number) => void
	setConfirmFocus: (focus: boolean) => void
	setCardVoucher: (voucher: string) => void
	cardVoucher: string
	confirmOrder: () => void
	handleAddingByList: (product: Producto) => void
}

export const PosSidebar: React.FC<PosSidebarProps> = ({
	setOtherFocus,
	scannedCode,
	setScannedCode,
	addToCartByBarcode,
	setInputFocus,
	searchTerm,
	setSearchTerm,
	productsLoading,
	filteredProducts,
	addToCart,
	calculateTotal,
	paymentMethod,
	setPaymentMethod,
	cashAmount,
	setCashAmount,
	setConfirmFocus,
	cardVoucher,
	setCardVoucher,
	confirmOrder,
	handleAddingByList
}) => {
	return (
		<aside className='flex w-1/3 flex-col gap-2 bg-background/90 p-4 text-foreground'>
			<div className=''>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						addToCartByBarcode(scannedCode)
					}}>
					<label htmlFor='scanner' className='mb-1 block text-sm font-medium'>
						Escáner (F1)
					</label>
					<Input
						id='scanner'
						value={scannedCode}
						onChange={(e) => setScannedCode(e.target.value)}
						placeholder='Escanea o ingresa código'
						className='default-input font-bold'
						onFocus={() => setInputFocus(true)}
						onBlur={() => setInputFocus(false)}
					/>
				</form>
			</div>
			<div className=''>
				<label
					htmlFor='search-products'
					className='mb-1 block text-sm font-medium'>
					Buscar Productos (F2)
				</label>
				<Input
					id='search-products'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder='Buscar por nombre o variante'
					className='default-input'
					onFocus={() => setOtherFocus(true)}
					onBlur={() => setOtherFocus(false)}
				/>
			</div>
			<h3 className='mt-1 font-semibold'>Productos</h3>
			{/* Loader */}
			{productsLoading && <p>Cargando Productos...</p>}
			<ClimbingBoxLoader
				color='#2477eb'
				loading={productsLoading}
				size={15}
				cssOverride={cssOverride}
				aria-label='Loading Spinner'
				data-testid='loader'
			/>
			<ScrollArea className='scrollbar-modifier flex-grow pr-3'>
				{filteredProducts.map((product) => (
					<Button
						key={product.id}
						variant='outline'
						className='mb-2 w-full justify-start px-3 py-7'
						onClick={() => handleAddingByList(product)}>
						<ShoppingBasket className='mr-2 h-8 w-8 rounded-md' />

						<div className='flex-grow text-left'>
							<div>{product.nombre}</div>
							<div className='text-sm text-muted-foreground transition-all'>
								{/* este texto -> text-accent-foreground cuando se haga hover, pero a la carta entera, no al texto solo */}
								{product.variante}
							</div>
						</div>
						<div>${product.precio.toLocaleString('es-CL')}</div>
					</Button>
				))}
			</ScrollArea>
			{/* Payment section */}
			<Card className='col-span-2'>
				<CardHeader className='bg-primary text-foreground'>
					<CardTitle className='text-foreground'>Pago</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex justify-between p-1'>
						<span className='font-semibold'>Total:</span>
						<span className='text-xl'>
							${calculateTotal().toLocaleString('es-CL')}
						</span>
					</div>
					<Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
						<TabsList className='grid w-full grid-cols-2'>
							<TabsTrigger value='cash'>Efectivo (PageDown)</TabsTrigger>
							<TabsTrigger value='card'>Tarjeta (PageUp)</TabsTrigger>
						</TabsList>
						<TabsContent value='cash'>
							<div className='space-y-2'>
								<label
									htmlFor='cash-amount'
									className='block text-sm font-medium'>
									Monto en Efectivo
								</label>
								<Input
									id='cash-amount'
									type='number'
									value={cashAmount === 0 ? '' : cashAmount}
									onChange={(e) => {
										setCashAmount(parseInt(e.target.value) || 0)
										setPaymentMethod('cash')
									}}
									placeholder='Ingrese monto en efectivo'
									className='default-input'
									onFocus={() => {
										setOtherFocus(true)
										setConfirmFocus(true)
									}}
									onBlur={() => {
										setOtherFocus(false)
										setConfirmFocus(false)
									}}
								/>
							</div>
							{cashAmount > 0 && (
								<div className='mt-4 rounded-md bg-secondary p-2'>
									<span className='font-semibold'>Vuelto:</span> $
									{Math.max(0, cashAmount - calculateTotal()).toLocaleString(
										'es-CL'
									)}
								</div>
							)}
						</TabsContent>
						<TabsContent value='card'>
							<div className='space-y-2'>
								<label
									htmlFor='card-voucher'
									className='block text-sm font-medium'>
									Número de Comprobante
								</label>
								<Input
									id='card-voucher'
									value={cardVoucher}
									onChange={(e) => {
										setCardVoucher(e.target.value)
										setPaymentMethod('card')
									}}
									placeholder='Ingrese número de comprobante'
									className='default-input'
									onFocus={() => {
										setOtherFocus(true)
										setConfirmFocus(true)
									}}
									onBlur={() => {
										setOtherFocus(false)
										setConfirmFocus(false)
									}}
								/>
							</div>
						</TabsContent>
					</Tabs>
					<Button
						id='confirm-button'
						className='mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90'
						onClick={confirmOrder}>
						Confirmar Orden
					</Button>
				</CardContent>
			</Card>
		</aside>
	)
}
