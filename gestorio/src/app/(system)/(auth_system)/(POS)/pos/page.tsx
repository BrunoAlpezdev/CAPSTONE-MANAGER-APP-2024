'use client'

import { useState, useEffect, use, CSSProperties } from 'react'
import Image from 'next/image'
import { Button, TicketButton } from '@/components/ui/button'
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'
import { DefInput, Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useDatabaseStore from '@/store/dbStore'
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
import { useMenu } from '@/hooks'
import { Footer, FullLogo, ToggleMenu } from '@/components'

import { Producto, Ticket } from '@/types'
/* import { products } from '@/mocks/products' */
import { Label } from '@/components/ui/label'
import { getDownloadURL, ref } from 'firebase/storage'
import { storage } from '@/firebase'
import useImageStore from '@/store/useImageStorage'

export default function POS() {
	// Estado para manejar los tickets (incluyendo los pendientes)
	const [tickets, setTickets] = useState<Ticket[]>(() => {
		// Cargar los tickets desde localStorage al iniciar la aplicación
		const savedTickets = localStorage.getItem('tickets')
		return savedTickets
			? JSON.parse(savedTickets)
			: [{ id: 1, name: 'Ticket Actual', items: [] }]
	})
	// ID del ticket actualmente seleccionado
	const [currentTicketId, setCurrentTicketId] = useState(1)
	// Estado para el código escaneado
	const [scannedCode, setScannedCode] = useState('')
	// Estados para los diferentes métodos de pago
	const [cashAmount, setCashAmount] = useState(0)
	const [cardVoucher, setCardVoucher] = useState('')
	// Estado para el modo oscuro
	const [isDarkMode, setIsDarkMode] = useState(() => {
		return (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		)
	})
	// Estado para controlar la apertura del diálogo de ticket pendiente
	const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false)
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
	// Estado para el tipo de documento (boleta o factura)
	const [isBoleta, setIsBoleta] = useState(true)
	const [quantFocus, setQuantFocus] = useState(false)

	const [productsLoading, setProductsLoading] = useState(true)
	const db = useDatabaseStore((state) => state.db)
	const [products, setProducts] = useState<Producto[]>([])

	const fetchProductos = async () => {
		if (db) {
			try {
				// Obtén los datos de los productos desde la base de datos local (RxDB)
				const productosData = await db.productos.find().exec()

				// Mapear los productos a un array de objetos
				const productos = productosData.map((producto: any) =>
					producto.toJSON()
				)

				// Actualizar el estado de productos con los datos completos
				setProducts(productos)
			} catch (error) {
				makeToast('Error al obtener los productos:', '✖️')
			} finally {
				setProductsLoading(false)
			}
		}
	}

	const limpiarFoco = () => {
		const activeElement = document.activeElement as HTMLElement
		if (activeElement) {
			activeElement.blur()
			setOtherFocus(false)
		}
	}

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
		const product = products.find((product) => product.barcode === barcode)

		if (!product || product === undefined) {
			makeToast('Producto No Encontrado', '✖️') // Mostrar un toast de confirmación
			return
		}
		makeToast('Producto Escaneado', '🛒') // Mostrar un toast de confirmación
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
										? {
												...item,
												cantidad: Math.min(item.stock, item.cantidad + change)
											}
										: item
								)
								.filter((item) => item.cantidad >= 0)
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

	// Función para confirmar la orden actual
	const confirmOrder = () => {
		let total = calculateTotal()
		if (
			(paymentMethod === 'cash' && cashAmount < total) ||
			(paymentMethod === 'cash' && cashAmount === 0)
		) {
			makeToast('El monto en efectivo es menor al total de la orden', '✖️')
			return
		}
		makeToast(
			`Orden confirmada! Total: $${total} vuelto: $${Math.max(
				0,
				cashAmount - calculateTotal()
			).toLocaleString('es-CL')}`,
			'✅'
		)
		setTickets((prevTickets) => {
			// Filtrar y reorganizar IDs después de eliminar
			const filteredTickets = prevTickets.filter(
				(ticket) => ticket.id !== currentTicketId
			)

			// Reorganizar IDs, manteniendo el ticket 1 y reasignando el resto
			const reorganizedTickets = filteredTickets.map((ticket, index) => ({
				...ticket,
				id: index + 1 // El primer índice empieza en 2, porque el 1 siempre es el 1
			}))

			return [...reorganizedTickets]
		})
		if (tickets.length === 1) {
			setTickets([{ id: 1, name: 'Ticket Actual', items: [] }])
			setCurrentTicketId(1)
		} else {
			setCurrentTicketId(
				tickets.find((ticket) => ticket.id !== currentTicketId)?.id ||
					tickets[0].id
			)
		}
		limpiarFoco()
		setCashAmount(0)
		setCardVoucher('')
	}

	// Función para guardar un ticket como pendiente
	const setPendingTicket = () => {
		if (currentTicket.items.length > 0 && pendingTicketName) {
			// Verifica si el ticket actual ya ha sido guardado como pendiente
			const isAlreadyPending = tickets.some(
				(ticket) => ticket.name === pendingTicketName
			)

			if (isAlreadyPending) {
				// Si el ticket ya está pendiente, cambia al ticket en la posición 1
				setCurrentTicketId(1)
				setPendingTicketName('')
				setIsPendingDialogOpen(false)
				makeToast('El ticket ya está pendiente, cambiando al ticket 1', '📌')
				switchToTicket(1)
			} else {
				// Guarda el ticket actual como pendiente
				setTickets((prevTickets) => [
					...prevTickets,
					{
						id: prevTickets.length + 1,
						name: pendingTicketName,
						items: [...currentTicket.items]
					}
				])
				// Limpiar el Ticket actual (default)
				tickets[0].items = []
				setCurrentTicketId(1)
				setPendingTicketName('')
				setIsPendingDialogOpen(false)
				makeToast('Ticket guardado como pendiente', '📌')
				switchToTicket(1)
			}
			limpiarFoco()
		} else {
			makeToast('No hay items en el ticket o falta el nombre del ticket', '⚠️')
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
			// Si el ticket es el 1 y no tiene items
			if (currentTicket.items.length === 0) {
				makeToast('No hay items en el ticket actual para cancelar', '✖️')
				setIsDeleteDialogOpen(false)
				return
			}
			// Limpiar los items del ticket 1
			setTickets((prevTickets) =>
				prevTickets.map((ticket) =>
					ticket.id === 1 ? { ...ticket, items: [] } : ticket
				)
			)
		} else {
			// Eliminar el ticket actual si no es el ID 1
			setTickets((prevTickets) => {
				// Filtrar y reorganizar IDs después de eliminar
				const filteredTickets = prevTickets.filter(
					(ticket) => ticket.id !== currentTicketId
				)

				// Reorganizar IDs, manteniendo el ticket 1 y reasignando el resto
				const reorganizedTickets = filteredTickets.map((ticket, index) => ({
					...ticket,
					id: index + 1 // El primer índice empieza en 2, porque el 1 siempre es el 1
				}))

				return [...reorganizedTickets]
			})

			// Actualizar el ID del ticket actual
			setCurrentTicketId(
				tickets.find((ticket) => ticket.id !== currentTicketId)?.id ||
					tickets[0].id
			)
		}
		setIsDeleteDialogOpen(false)
		makeToast('Ticket actual cancelado')
	}
	// Filtra los productos basados en el término de búsqueda
	const filteredProducts = products.filter(
		(product) =>
			product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.variante?.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const cssOverride: CSSProperties = {
		display: 'block',
		margin: '0 auto',
		borderColor: 'red'
	}

	const makeToast = (message: string, icon?: string) => {
		toast.custom(
			(t) => (
				<div
					className={`border-1 h-fit rounded-sm border-primary/60 bg-white/5 px-4 py-2 text-foreground backdrop-blur-lg ${t.visible ? 'animate-appearance-in' : 'animate-appearance-out'}`}>
					<div className='flex items-center'>
						{icon && <span className='mr-2'>{icon}</span>}
						<span>{message}</span>
					</div>
				</div>
			),
			{ duration: 2000 }
		)
	}

	// Fetchea los productos al montar el componente
	useEffect(() => {
		fetchProductos()
	}, [])

	// Guardar los tickets en localStorage cada vez que cambien
	useEffect(() => {
		localStorage.setItem('tickets', JSON.stringify(tickets))
	}, [tickets])

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

				setScannedCode('') // Limpiar el valor del código de barras
				e.preventDefault() // Evitar que el "enter" haga un comportamiento por defecto
				return
			}

			if (!inputFocus && !otherFocus && e.key !== '-' && e.key !== '+') {
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
		const handleKeyPress = (e: KeyboardEvent) => {
			if (isPendingDialogOpen) {
				if (e.key === 'Enter') {
					// hacer click programaticamente a confirm-button nextjs "Button"
					const confirmButton = document.getElementById(
						'confirm-pending-button'
					)
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
	}, [isPendingDialogOpen])

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (isDeleteDialogOpen) {
				if (e.key === 'Enter') {
					// hacer click programaticamente a confirm-cancel-button nextjs "Button"
					const confirmButton = document.getElementById('confirm-cancel-button')
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
	}, [isDeleteDialogOpen])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				limpiarFoco()
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
			if (e.key === 'PageDown') {
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

			if (e.key === 'PageUp') {
				e.preventDefault()
				setPaymentMethod('card')
				const cardVoucherInput = document.getElementById(
					'card-voucher'
				) as HTMLInputElement
				if (cardVoucherInput) {
					cardVoucherInput.focus()
				}
				return
			}

			if (e.key === 'Insert') {
				const dejarPendienteButton = document.getElementById(
					'dejar-pendiente-button'
				)
				if (dejarPendienteButton) {
					dejarPendienteButton.click()
				}
			}

			if (e.key === 'Delete') {
				const cancelarTicketButton = document.getElementById(
					'cancelar-ticket-button'
				)
				if (cancelarTicketButton) {
					cancelarTicketButton.click()
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === 'ArrowRight') {
				if (currentTicketId < tickets.length) {
					setCurrentTicketId((prevId) => prevId + 1)
				}
			}

			if (e.ctrlKey && e.key === 'ArrowLeft') {
				if (currentTicketId > 1) {
					setCurrentTicketId((prevId) => prevId - 1)
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [currentTicketId, tickets.length])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(!quantFocus && e.key === 'ArrowUp') ||
				(!quantFocus && e.key === 'ArrowDown')
			) {
				//si el ticket tiene 1 o mas productos hacer focus a `item-quantity-0`
				try {
					if (currentTicket.items.length > 0) {
						const firstInput = document.getElementById(
							`item-quantity-0`
						) as HTMLInputElement
						const scannerInput = document.getElementById(
							'scanner'
						) as HTMLInputElement

						if (firstInput) {
							firstInput.focus()
						} else {
							scannerInput.focus()
						}
					}
				} catch (e) {
					console.log(e)
				}
			}
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [quantFocus, currentTicketId, tickets.length])

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
			<div className='flex h-[calc(100dvh-1px)] flex-col text-foreground'>
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
						<ScrollArea className='scrollbar-modifier h-fit text-foreground'>
							{currentTicket.items.map((item, index) => (
								<div
									key={item.id}
									className='shadow-small mb-2 mr-3 flex items-center rounded-lg bg-primary/25 p-1 shadow-foreground backdrop-blur-sm'>
									<Image
										src={'item.svg'}
										alt={item.nombre}
										width={50}
										height={50}
										className='mr-2 rounded-md'
									/>

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
										<Input
											id={`item-quantity-${index}`}
											className='mx-2'
											value={item.cantidad}
											onChange={(e) => {
												const newQuantity = parseInt(e.target.value) || 0
												updateQuantity(item.id, newQuantity - item.cantidad)
											}}
											max={item.stock}
											onKeyDown={(e) => {
												if (e.key === '-') {
													updateQuantity(item.id, -1)
												} else if (e.key === '+') {
													updateQuantity(item.id, 1)
												}
												if (e.key === 'ArrowDown') {
													// IR AL SIGUIENTE ITEM DE ABAJO, SI ES EL ULTIMO, OMITIR
													e.preventDefault()
													if (index === currentTicket.items.length - 1) {
														return
													}
													const nextInput = document.getElementById(
														`item-quantity-${index + 1}`
													) as HTMLInputElement
													if (nextInput) {
														nextInput.focus()
													}
												}
												if (e.key === 'ArrowUp') {
													// IR AL SIGUIENTE ITEM DE ARRIBA, A SU INPUT basándose en `item-quantity-${index}`, SI ES EL ULTIMO, OMITIR
													e.preventDefault()
													if (index === 0) {
														return
													}
													const nextInput = document.getElementById(
														`item-quantity-${index - 1}`
													) as HTMLInputElement
													if (nextInput) {
														nextInput.focus()
													}
												}
												if (e.ctrlKey && e.key === 'ArrowRight') {
													e.preventDefault()
													const nextInput = document.getElementById(
														`item-quantity-0`
													) as HTMLInputElement
													if (nextInput) {
														nextInput.focus()
													}
												}
												if (e.ctrlKey && e.key === 'ArrowLeft') {
													e.preventDefault()
													const nextInput = document.getElementById(
														`item-quantity-0`
													) as HTMLInputElement
													if (nextInput) {
														nextInput.focus()
													}
												}
											}}
											onFocus={() => {
												setOtherFocus(true)
												setQuantFocus(true)
											}}
											onBlur={() => {
												setInputFocus(false)
												setOtherFocus(false)
												setQuantFocus(false)
											}}
										/>
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
									onClick={() => addToCart(product)}>
									<Image
										src='item.svg'
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
												{Math.max(
													0,
													cashAmount - calculateTotal()
												).toLocaleString('es-CL')}
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
				</main>

				{/* Footer */}
				<footer className='col-span-2 flex items-center justify-between border-t bg-muted p-4'>
					<div className='flex space-x-2'>
						<Dialog
							open={isPendingDialogOpen}
							onOpenChange={setIsPendingDialogOpen}>
							<DialogTrigger asChild>
								<Button
									id='dejar-pendiente-button'
									variant='outline'
									className='w-fit gap-2'>
									<Bookmark className='h-4 w-4' />
									Dejar Pendiente (Insertar)
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
								<Button id='confirm-pending-button' onClick={setPendingTicket}>
									Guardar
								</Button>
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
									id='cancelar-ticket-button'
									variant='destructive'
									className='w-fit gap-2'
									onClick={() => setIsDeleteDialogOpen(true)}>
									<Ban className='h-4 w-4' />
									Cancelar Ticket (Suprimir)
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
								<RadioGroupItem
									value='boleta'
									id='r1'
									onClick={() => setIsBoleta(true)}
								/>
								<Label htmlFor='r1'>Boleta</Label>
							</div>
							<div className='flex items-center space-x-2'>
								<RadioGroupItem
									value='factura'
									id='r2'
									onClick={() => setIsBoleta(false)}
								/>
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
