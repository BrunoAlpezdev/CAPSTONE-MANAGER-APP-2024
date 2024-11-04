'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import { Button, TicketButton } from '@/components/ui/button'
import { DefInput, Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import {
	ShoppingCart,
	X,
	Sun,
	Moon,
	Plus,
	Minus,
	MenuIcon,
	Bookmark,
	Ban
} from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { RxDatabase } from 'rxdb'
import setupDatabase from '@/lib/db/RxDB'
import { useMenu, useSale } from '@/hooks'
import { Footer, FullLogo, ToggleMenu } from '@/components'

import { Producto, Ticket } from '@/types'
import { products } from '@/mocks/products'
import { Label } from '@/components/ui/label'

export default function POS() {
	// Estado para manejar los tickets (incluyendo los pendientes)
	const [tickets, setTickets] = useState<Ticket[]>([
		{ id: 1, name: 'Ticket Actual', items: [] }
	])
	// ID del ticket actualmente seleccionado
	const [currentTicketId, setCurrentTicketId] = useState(1)
	// Estado para el código escaneado
	const [scannedCode, setScannedCode] = useState('')
	// Estados para los diferentes métodos de pago
	const [cashAmount, setCashAmount] = useState('')
	const [debitVoucher, setDebitVoucher] = useState('')
	const [creditVoucher, setCreditVoucher] = useState('')
	const [creditInstallments, setCreditInstallments] = useState('1')
	// Estado para el modo oscuro
	const [isDarkMode, setIsDarkMode] = useState(() => {
		return (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		)
	})
	// Estado para controlar la apertura del diálogo de ticket pendiente
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	// Estado para el nombre del ticket pendiente
	const [pendingTicketName, setPendingTicketName] = useState('')
	// Estado para el término de búsqueda de productos
	const [searchTerm, setSearchTerm] = useState('')
	// Estado para comprobar si el menú está abierto
	const { isMenuOpen, toggleMenu } = useMenu()
	const [inputFocus, setInputFocus] = useState(false)
	const [otherFocus, setOtherFocus] = useState(false)
	const [paymentMethod, setPaymentMethod] = useState('cash')
	const [confirmFocus, setConfirmFocus] = useState(false)

	const handleProductAdded = (barcode: string) => {
		addToCartByBarcode(barcode)
		setScannedCode('')
	}

	// Obtiene el ticket actual basado en el ID seleccionado
	const currentTicket =
		tickets.find((ticket) => ticket.id === currentTicketId) || tickets[0]

	// Función para añadir un producto al carrito
	const addToCart = (product: Producto) => {
		setTickets((prevTickets) =>
			prevTickets.map((ticket) =>
				ticket.id === currentTicketId
					? {
							...ticket,
							items: ticket.items.some((item) => item.id === product.id)
								? ticket.items.map((item) =>
										item.id === product.id
											? { ...item, cantidad: item.cantidad + 1 }
											: item
									)
								: [...ticket.items, { ...product, cantidad: 1 }]
						}
					: ticket
			)
		)
	}

	const addToCartByBarcode = (barcode: string) => {
		// Aquí se debería hacer una petición a la API para obtener el producto
		// con el código de barras especificado
		const product = products.find((product) => product.id === barcode)

		if (!product || product === undefined) {
			console.error('Producto no encontrado')
			return
		}

		addToCart(product)
	}

	// Función para remover un producto del carrito
	const removeFromCart = (productId: string) => {
		setTickets((prevTickets) =>
			prevTickets.map((ticket) =>
				ticket.id === currentTicketId
					? {
							...ticket,
							items: ticket.items.filter((item) => item.id !== productId)
						}
					: ticket
			)
		)
	}

	// Función para actualizar la cantidad de un producto en el carrito
	const updateQuantity = (productId: string, change: number) => {
		setTickets((prevTickets) =>
			prevTickets.map((ticket) =>
				ticket.id === currentTicketId
					? {
							...ticket,
							items: ticket.items
								.map((item) =>
									item.id === productId
										? { ...item, cantidad: Math.max(0, item.cantidad + change) }
										: item
								)
								.filter((item) => item.cantidad > 0)
						}
					: ticket
			)
		)
	}

	// Función para calcular el total del ticket actual
	const calculateTotal = () => {
		return currentTicket.items.reduce(
			(total, item) => total + item.precio * item.cantidad,
			0
		)
	}

	// Manejador para la entrada del escáner
	const handleScannerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setScannedCode(e.target.value)
		// En una aplicación real, aquí se buscaría el producto por código
		// y se añadiría al carrito si se encuentra
	}

	// Función para confirmar la orden actual
	const confirmOrder = () => {
		if (
			(paymentMethod === 'cash' && cashAmount === '0') ||
			(paymentMethod === 'cash' && cashAmount === '')
		) {
			toast.error('El monto en efectivo es menor al total de la orden')
			return
		}
		toast.success(
			`Orden confirmada! Total: $${calculateTotal().toLocaleString('es-CL')} vuelto: $${Math.max(
				0,
				parseInt(cashAmount) - calculateTotal()
			).toLocaleString('es-CL')}`
		)
		setTickets((prevTickets) =>
			prevTickets.filter((ticket) => ticket.id !== currentTicketId)
		)
		if (tickets.length === 1) {
			setTickets([{ id: Date.now(), name: 'Nuevo Ticket', items: [] }])
			setCurrentTicketId(Date.now())
		} else {
			setCurrentTicketId(
				tickets.find((ticket) => ticket.id !== currentTicketId)?.id ||
					tickets[0].id
			)
		}
		setCashAmount('')
		setDebitVoucher('')
		setCreditVoucher('')
		setCreditInstallments('1')
	}

	// Función para guardar un ticket como pendiente
	const setPendingTicket = () => {
		if (currentTicket.items.length > 0 && pendingTicketName) {
			// Guarda el ticket actual como pendiente
			setTickets((prevTickets) => [
				...prevTickets,
				{
					id: Date.now(),
					name: pendingTicketName,
					items: [...currentTicket.items]
				}
			])
			// Crea un nuevo ticket vacío y lo establece como el actual
			const newTicketId = Date.now() + 1
			setTickets((prevTickets) => [...prevTickets])
			// Limpiar el Ticket actual (default)
			tickets[0].items = []
			setCurrentTicketId(newTicketId)
			setPendingTicketName('')
			setIsDialogOpen(false)
			toast.success('Ticket guardado como pendiente')
			switchToTicket(1)
		} else {
			toast.error('No se puede guardar un ticket vacío o sin nombre')
		}
	}

	// Función para cambiar entre tickets
	const switchToTicket = (ticketId: number) => {
		setCurrentTicketId(ticketId)
	}

	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

	// Función para cancelar el ticket actual
	const cancelCurrentTicket = () => {
		if (currentTicketId === 1) {
			setTickets((prevTickets) =>
				prevTickets.map((ticket) =>
					ticket.id === 1 ? { ...ticket, items: [] } : ticket
				)
			)
		} else {
			setTickets((prevTickets) =>
				prevTickets.filter((ticket) => ticket.id !== currentTicketId)
			)
			if (tickets.length === 1) {
				setTickets([{ id: Date.now(), name: 'Nuevo Ticket', items: [] }])
				setCurrentTicketId(Date.now())
			} else {
				setCurrentTicketId(
					tickets.find((ticket) => ticket.id !== currentTicketId)?.id ||
						tickets[0].id
				)
			}
		}
		setIsDeleteDialogOpen(false)
		toast.success('Ticket actual cancelado')
	}

	// Filtra los productos basados en el término de búsqueda
	const filteredProducts = products.filter(
		(product) =>
			product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.variante?.toLowerCase().includes(searchTerm.toLowerCase())
	)

	// Efecto para aplicar el modo oscuro
	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleChange = (e: MediaQueryListEvent) => {
			setIsDarkMode(e.matches)
		}

		// Escucha los cambios en el modo oscuro del sistema
		mediaQuery.addEventListener('change', handleChange)

		// Limpia el listener al desmontar el componente
		return () => {
			mediaQuery.removeEventListener('change', handleChange)
		}
	}, [])

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [isDarkMode])

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (otherFocus) {
				return
			}
			if (e.key === 'Enter') {
				if (scannedCode === '') return
				handleProductAdded(scannedCode) // Procesar el código de barras cuando se presione Enter
				toast('Producto Escaneado', { icon: '🛒' }) // Mostrar un toast de confirmación
				setScannedCode('') // Limpiar el valor del código de barras
				e.preventDefault() // Evitar que el "enter" haga un comportamiento por defecto
				return
			}

			if (!inputFocus && !otherFocus) {
				setScannedCode((prevBarcode) => prevBarcode + e.key)
			}
		}

		document.addEventListener('keypress', handleKeyPress)

		return () => {
			document.removeEventListener('keypress', handleKeyPress)
		}
	}, [handleProductAdded, scannedCode, inputFocus, otherFocus])

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (confirmFocus) {
				if (e.key === 'Enter') {
					// hacer click programaticamente a confirm-button nextjs "Button"
					const confirmButton = document.getElementById('confirm-button')
					if (confirmButton) {
						confirmButton.click()
					}
				}
			}
		}
		document.addEventListener('keypress', handleKeyPress)

		return () => {
			document.removeEventListener('keypress', handleKeyPress)
		}
	}, [confirmFocus])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				const activeElement = document.activeElement as HTMLElement
				if (activeElement) {
					activeElement.blur()
				}
			}
			if (e.key === 'F1') {
				const scannerInput = document.getElementById(
					'scanner'
				) as HTMLInputElement
				if (scannerInput) {
					scannerInput.focus()
				}
				e.preventDefault()
				return
			}
			if (e.key === 'F2') {
				const searchProductsInput = document.getElementById(
					'search-products'
				) as HTMLInputElement
				if (searchProductsInput) {
					searchProductsInput.focus()
				}
				e.preventDefault()
				return
			}
			if (e.key === 'F3') {
				e.preventDefault()
				setPaymentMethod('cash')
				const cashAmountInput = document.getElementById(
					'cash-amount'
				) as HTMLInputElement
				if (cashAmountInput) {
					cashAmountInput.focus()
				}
				return
			}

			if (e.key === 'F5') {
				e.preventDefault()
				setPaymentMethod('debit')
				const debitVoucherInput = document.getElementById(
					'debit-voucher'
				) as HTMLInputElement
				if (debitVoucherInput) {
					debitVoucherInput.focus()
				}
				return
			}
			if (e.key === 'F6') {
				e.preventDefault()
				setPaymentMethod('credit')
				const creditVoucherInput = document.getElementById(
					'credit-voucher'
				) as HTMLInputElement
				if (creditVoucherInput) {
					creditVoucherInput.focus()
				}
				return
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	return (
		<div className='relative transition-all'>
			<Toaster />
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
					<div className='flex items-center space-x-4'>
						<div className='flex items-center space-x-2'>
							<Sun className='h-4 w-4' />
							<Switch
								checked={isDarkMode}
								onCheckedChange={setIsDarkMode}
								aria-label='Cambiar modo oscuro'
							/>
							<Moon className='h-4 w-4' />
						</div>
						<Button variant='outline' size='sm'>
							<ShoppingCart className='mr-2 h-4 w-4' />
							{currentTicket.items.reduce(
								(sum, item) => sum + item.cantidad,
								0
							)}
						</Button>
						<FullLogo size='large' />
					</div>
				</header>

				{/* Main content */}
				<main className='inner-custom-shadow dashboard-fondo z-auto flex flex-1 overflow-hidden dark:text-black'>
					<section className='scrollbar-modifier flex flex-1 flex-col gap-2 overflow-y-auto p-2'>
						<div className='center flex h-fit items-center rounded-lg bg-muted px-1'>
							<h3 className='font-semibold text-foreground'>Tickets</h3>
							<ScrollArea className='scrollbar-modifier flex h-fit'>
								{tickets.map((ticket) => (
									<TicketButton
										key={ticket.id}
										variant={
											ticket.id === currentTicketId ? 'default' : 'outline'
										}
										size='sm'
										className='ml-1'
										onClick={() => switchToTicket(ticket.id)}>
										{ticket.name}
									</TicketButton>
								))}
							</ScrollArea>
						</div>
						<h2 className='ml-1 text-xl font-semibold text-foreground'>
							Carrito Actual: {currentTicket.name}
						</h2>
						<ScrollArea className='scrollbar-modifier h-[calc(100vh-267px)] text-foreground'>
							{currentTicket.items.map((item) => (
								<div
									key={item.id}
									className='mb-2 mr-3 flex items-center rounded-lg bg-primary/25 p-1 shadow-small shadow-foreground backdrop-blur-sm'>
									{item.imagen ? (
										<Image
											src={item.imagen}
											alt={item.nombre}
											width={50}
											height={50}
											draggable={false}
											className='mr-2 max-h-12 max-w-12 rounded-md'
										/>
									) : (
										<Image
											src={'https://placehold.co/400'}
											alt={item.nombre}
											width={50}
											height={50}
											className='mr-2 rounded-md'
										/>
									)}

									<div className='flex-grow'>
										<div className='font-semibold'>{item.nombre}</div>
										<div className='text-sm text-muted-foreground'>
											{item.variante}
										</div>
									</div>

									<div className='mr-4 text-right'>
										<div>
											${(item.precio * item.cantidad).toLocaleString('es-CL')}
										</div>
										<div className='text-sm text-muted-foreground'>
											${item.precio.toLocaleString('es-CL')} c/u
										</div>
									</div>
									<div className='flex items-center'>
										<Button
											variant='outline'
											size='icon'
											onClick={() => updateQuantity(item.id, -1)}>
											<Minus className='h-4 w-4' />
										</Button>
										<span className='mx-2'>{item.cantidad}</span>
										<Button
											variant='outline'
											size='icon'
											onClick={() => updateQuantity(item.id, 1)}>
											<Plus className='h-4 w-4' />
										</Button>
									</div>
									<Button
										variant='destructive'
										size='icon'
										className='ml-2'
										onClick={() => removeFromCart(item.id)}>
										<X className='h-4 w-4' />
									</Button>
								</div>
							))}
						</ScrollArea>
					</section>

					{/* Sidebar */}
					<aside className='flex w-1/3 flex-col gap-2 bg-background/90 p-4 text-foreground'>
						<div className=''>
							<form
								onSubmit={(e) => {
									e.preventDefault()
									addToCartByBarcode(scannedCode)
								}}>
								<label
									htmlFor='scanner'
									className='mb-1 block text-sm font-medium'>
									Escáner (F1)
								</label>
								<Input
									id='scanner'
									value={scannedCode}
									onChange={handleScannerInput}
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
						<ScrollArea className='scrollbar-modifier flex-grow pr-3'>
							{filteredProducts.map((product) => (
								<Button
									key={product.id}
									variant='outline'
									className='mb-2 w-full justify-start px-3 py-7'
									onClick={() => addToCart(product)}>
									<Image
										src={product.imagen ?? 'https://via.placeholder.com/30'}
										alt={product.nombre}
										width={30}
										height={30}
										className='mr-2 rounded-md'
									/>
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
									<TabsList className='grid w-full grid-cols-3'>
										<TabsTrigger value='cash'>Efectivo (F3)</TabsTrigger>
										<TabsTrigger value='debit'>Débito (F5)</TabsTrigger>
										<TabsTrigger value='credit'>Crédito (F6)</TabsTrigger>
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
												value={cashAmount}
												onChange={(e) => {
													setCashAmount(e.target.value)
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
										{parseInt(cashAmount) > 0 && (
											<div className='mt-4 rounded-md bg-secondary p-2'>
												<span className='font-semibold'>Vuelto:</span> $
												{Math.max(
													0,
													parseInt(cashAmount) - calculateTotal()
												).toLocaleString('es-CL')}
											</div>
										)}
									</TabsContent>
									<TabsContent value='debit'>
										<div className='space-y-2'>
											<label
												htmlFor='debit-voucher'
												className='block text-sm font-medium'>
												Número de Comprobante
											</label>
											<Input
												id='debit-voucher'
												value={debitVoucher}
												onChange={(e) => {
													setDebitVoucher(e.target.value)
													setPaymentMethod('debit')
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
									<TabsContent value='credit'>
										<div className='space-y-2'>
											<label
												htmlFor='credit-voucher'
												className='block text-sm font-medium'>
												Número de Comprobante
											</label>
											<Input
												id='credit-voucher'
												value={creditVoucher}
												onChange={(e) => {
													setCreditVoucher(e.target.value)
													setPaymentMethod('credit')
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
										<div className='mt-4 space-y-2'>
											<label
												htmlFor='credit-installments'
												className='block text-sm font-medium'>
												Cuotas
											</label>
											<Select
												value={creditInstallments}
												onValueChange={setCreditInstallments}>
												<SelectTrigger id='credit-installments'>
													<SelectValue placeholder='Seleccione número de cuotas' />
												</SelectTrigger>
												<SelectContent>
													{[1, 2, 3, 6, 12, 18, 24].map((num) => (
														<SelectItem key={num} value={num.toString()}>
															{num} cuota{num > 1 ? 's' : ''}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
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
				</main>

				{/* Footer */}
				<footer className='col-span-2 flex items-center justify-between border-t bg-muted p-4'>
					<div className='flex space-x-2'>
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button variant='outline' className='w-fit gap-2'>
									<Bookmark className='h-4 w-4' />
									Dejar Pendiente
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Guardar Ticket Pendiente</DialogTitle>
								</DialogHeader>
								<div className='py-4'>
									<label
										htmlFor='pending-ticket-name'
										className='mb-1 block text-sm font-medium'>
										Nombre del Ticket
									</label>
									<DefInput
										id='pending-ticket-name'
										value={pendingTicketName}
										onChange={(e) => setPendingTicketName(e.target.value)}
										placeholder='Ingrese nombre para el ticket pendiente'
										className='default-input'
										onFocus={() => setOtherFocus(true)}
										onBlur={() => setOtherFocus(false)}
									/>
								</div>
								<Button onClick={setPendingTicket}>Guardar</Button>
							</DialogContent>
						</Dialog>

						{/* <Button
							variant='outline'
							className='w-fit gap-2'
							onClick={() => toast.success('Imprimiendo ticket...')}>
							<CreditCard className='h-4 w-4' />
							Imprimir Ticket
						</Button> */}

						<Dialog
							open={isDeleteDialogOpen}
							onOpenChange={setIsDeleteDialogOpen}>
							<DialogTrigger asChild>
								<Button
									variant='destructive'
									className='w-fit gap-2'
									onClick={() => setIsDeleteDialogOpen(true)}>
									<Ban className='h-4 w-4' />
									Cancelar Ticket
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>¿Desea Cancelar el Ticket Actual?</DialogTitle>
								</DialogHeader>
								<Button variant='destructive' onClick={cancelCurrentTicket}>
									Cancelar Ticket Actual
								</Button>
								<Button
									variant='secondary'
									onClick={() => setIsDeleteDialogOpen(false)}>
									Volver
								</Button>
							</DialogContent>
						</Dialog>

						<RadioGroup defaultValue='boleta'>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='boleta' id='r1' />
								<Label htmlFor='r1'>Boleta</Label>
							</div>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem value='factura' id='r2' />
								<Label htmlFor='r2'>Factura</Label>
							</div>
						</RadioGroup>
					</div>
				</footer>
				<Footer />
			</div>
		</div>
	)
}
