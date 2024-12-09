'use client'

import bcrypt from 'bcryptjs'
import { useState, useEffect, use, CSSProperties } from 'react'
import { ThemeSwitch } from '@/components'
import { Button } from '@/components/ui/button'
import useDatabaseStore from '@/store/dbStore'
import { v7 as uuidv7 } from 'uuid'
import { ShoppingCart, MenuIcon } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { useMenu } from '@/hooks'
import { Footer, FullLogo, ToggleMenu } from '@/components'
import { DetalleVenta, Producto, Ticket, Usuario, Venta } from '@/types'
import { useLocalDb } from '@/hooks/useLocaldb'
import { PosFooter } from '@/components/newPos/pos-footer.component'
import { PosSidebar } from '@/components/newPos/pos-sidebar'
import { PosMainSection } from '@/components/newPos/pos-main-section'
import { PosResponsibleGuard } from '@/components/newPos/pos-responsible-guard.component'
import { jsPDF } from 'jspdf'
import printJS from 'print-js'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter
} from '@/components/ui/dialog'

export default function POS() {
	// ticket para la boleta
	const [replicatedTicket, setReplicatedTicket] = useState<Ticket | null>(null)
	//fin del ticket
	//const del dialog
	const [isBoletaOpen, setIsBoletaOpen] = useState(false)
	// Estado para manejar los tickets (incluyendo los pendientes)
	const [tickets, setTickets] = useState<Ticket[]>(() => {
		// Cargar los tickets desde localStorage al iniciar la aplicación
		const savedTickets = localStorage.getItem('tickets')
		return savedTickets
			? JSON.parse(savedTickets)
			: [{ id: 1, name: 'Ticket Actual', items: [] }]
	})
	const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(true)
	// ID del ticket actualmente seleccionado
	const [currentTicketId, setCurrentTicketId] = useState(1)
	// Estado para el código escaneado
	const [scannedCode, setScannedCode] = useState('')
	// Estados para los diferentes métodos de pago
	const [cashAmount, setCashAmount] = useState(0)
	const [cardVoucher, setCardVoucher] = useState('')
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
	const [quantFocus, setQuantFocus] = useState(false)

	const [productsLoading, setProductsLoading] = useState(true)
	const db = useDatabaseStore((state) => state.db)
	const [products, setProducts] = useState<Producto[]>([])

	// Main POS Section
	const [usuarios, setUsuarios] = useState<Usuario[]>([])
	const [usuariosLoading, setUsuariosLoading] = useState(true)
	const [selectedUser, setSelectedUser] = useState<Usuario | null>(null)
	const [isVerified, setIsVerified] = useState<boolean>(false)
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true)
	const [password, setPassword] = useState<string>('')
	const [error, setError] = useState<string>('')

	useEffect(() => {
		if (!isVerified) {
			setIsDialogOpen(true)
		}
	}, [isVerified])

	const handleUserSelect = (userName: string) => {
		const user = usuarios.find((u) => u.nombre === userName)
		if (user) {
			setSelectedUser(user)
		}
	}

	const handlePasswordSubmit = async () => {
		if (selectedUser) {
			try {
				const isMatch = await bcrypt.compare(
					password,
					selectedUser.passwordHash
				)
				if (isMatch) {
					setIsVerified(true)
					setIsDialogOpen(false)
					setError('')
				} else {
					setError('Contraseña incorrecta')
				}
			} catch (err) {
				console.error('Error al verificar la contraseña:', err)
				setError('Ocurrió un error al verificar la contraseña')
			}
		}
		setPassword('')
	}

	const handleLogout = () => {
		setSelectedUser(null)
		setIsVerified(false)
		setIsDialogOpen(true)
		setIsAuthDialogOpen(true)
	}

	// POSFooter
	const [isBoleta, setIsBoleta] = useState(true)
	const [pdfUrl, setPdfUrl] = useState<string | null>(null)
	const [isFacturaDialogOpen, setIsFacturaDialogOpen] = useState(false)
	const [nombreRazonSocial, setNombreRazonSocial] = useState('')
	const [rutNif, setRutNif] = useState('')
	const [giro, setGiro] = useState('')
	const [direccionEmpresa, setDireccionEmpresa] = useState('')
	const [nombreContacto, setNombreContacto] = useState('')
	const [contacto, setContacto] = useState('')

	const handleBackFactura = () => {
		setNombreRazonSocial('')
		setRutNif('')
		setGiro('')
		setDireccionEmpresa('')
		setNombreContacto('')
		setContacto('')
		setIsFacturaDialogOpen(false)
	}

	const fetchUsuarios = async () => {
		if (db) {
			try {
				const localId = localStorage.getItem('userUuid')
				const Id_negocio = localId?.replaceAll('"', '')
				// Obtén los datos de los usuarios desde la base de datos local (RxDB)
				const usuariosData = await db.usuarios
					.find({
						selector: { id_negocio: Id_negocio }
					})
					.exec()

				// Mapear los usuarios a un array de objetos
				const usuarios = usuariosData.map((producto: any) => producto.toJSON())

				// Actualizar el estado de usuarios con los datos completos
				setUsuarios(usuarios)
			} catch (error) {
				makeToast('Error al obtener los usuarios:', '✖️')
			} finally {
				setUsuariosLoading(false)
			}
		}
	}

	const fetchProductos = async () => {
		if (db) {
			try {
				const localId = localStorage.getItem('userUuid')
				const Id_negocio = localId?.replaceAll('"', '')
				// Obtén los datos de los productos desde la base de datos local (RxDB)
				const productosData = await db.productos
					.find({
						selector: { id_negocio: Id_negocio, stock: { $gt: 0 } }
					})
					.exec()

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

	//boton para cerrar el dialog
	const handleCloseBoleta = () => {
		setIsBoletaOpen(true)
	}
	//fin del boton

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
			makeToast('Producto No Encontrado o Sin Stock', '✖️') // Mostrar un toast de confirmación
			return
		}

		// Comprobar stock del producto antes de agregar al carrito
		if (product.stock < 1) {
			makeToast('Producto sin Stock', '✖️') // Mostrar un toast de confirmación
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
	const { AgregarVenta, AgregarDetalleVenta } = useLocalDb()

	// Función para generar el pdf de la boleta
	const generateBoleta = () => {
		const doc = new jsPDF()

		// Centrar el título "Boleta"
		const pageWidth = doc.internal.pageSize.getWidth()
		doc.setFontSize(18)
		const title = 'Boleta'
		const titleWidth = doc.getTextWidth(title)
		doc.text(title, (pageWidth - titleWidth) / 2, 20)

		// Separar con una línea horizontal debajo del título
		doc.setLineWidth(0.5)
		doc.line(10, 25, pageWidth - 10, 25)

		// Información de encabezado
		doc.setFontSize(12)
		doc.text('Fecha:', 10, 35)
		doc.text(new Date().toLocaleDateString(), 50, 35)
		doc.text('Método de Pago:', 10, 45)
		doc.text('Efectivo', 50, 45)

		// Encabezado para la tabla de productos
		doc.setFontSize(14)
		doc.text('Productos:', 10, 60)

		// Tabla de productos
		let currentY = 70
		doc.setFontSize(12)
		let total = 0
		replicatedTicket?.items.forEach((item, index) => {
			doc.text(`${index + 1}. ${item.nombre}`, 10, currentY)
			doc.text(`Cantidad: ${item.cantidad}`, 55, currentY)
			doc.text(`Precio: $${item.precio}`, 120, currentY)
			total += item.cantidad * item.precio // Calcular el total
			currentY += 10
		})

		// Separar con otra línea
		doc.line(10, currentY, pageWidth - 10, currentY)
		currentY += 10

		// Mostrar el total calculado
		doc.setFontSize(14)
		doc.text('Total:', 10, currentY)
		doc.setFontSize(16)
		doc.text(`$${total}`, 50, currentY) // Usar el total calculado

		// Generar la URL del PDF como cadena
		const pdfUrl = doc.output('datauristring')
		return pdfUrl
	}
	//fin de la boleta

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
		const localId = localStorage.getItem('userUuid')
		const Id_negocio = localId?.replaceAll('"', '') ?? 'indefinido'

		const fecha = new Date()
		const fechaString = fecha.toISOString().slice(0, 19).replace('T', ' ')

		const VentaArmada: Venta = {
			cliente_id: 'indefinido',
			id_negocio: Id_negocio,
			id_responsable: selectedUser?.id || 'indefinido',
			fecha: fechaString,
			id: uuidv7(),
			metodoPago: paymentMethod === 'cash' ? 'efectivo' : 'tarjeta',
			total: total,
			boleta: isBoleta,
			contacto: contacto,
			direccion_empresa: direccionEmpresa,
			factura: !isBoleta,
			giro: giro,
			nombre_contacto: nombreContacto,
			nombre_razon_social: nombreRazonSocial,
			comprobante: cardVoucher,
			montoPagado: cashAmount,
			vuelto: Math.max(0, cashAmount - total)
		}

		const DetalleVentaArmada: DetalleVenta[] = currentTicket.items.map(
			(item) => ({
				id: uuidv7(),
				venta_id: VentaArmada.id,
				producto_id: item.id,
				cantidad: item.cantidad,
				precio: item.precio
			})
		)

		setReplicatedTicket(currentTicket)
		localStorage.setItem('replicatedTicket', JSON.stringify(replicatedTicket))

		AgregarVenta(VentaArmada)
			.then(() => {
				return Promise.all(
					DetalleVentaArmada.map((detalle) => AgregarDetalleVenta(detalle))
				)
			})
			.then(() => {
				makeToast(
					`Orden confirmada! Total: $${total} vuelto: $${Math.max(
						0,
						cashAmount - calculateTotal()
					).toLocaleString('es-CL')}`,
					'✅'
				)
			})
			.then(() => {
				setIsBoletaOpen(true)
				if (isBoleta) {
					generateBoleta()
				}
			})

			.catch((error) => {
				makeToast(`Error al confirmar la orden: ${error.message}`, '✖️')
			})

		// Reducir stock de los productos del ticket
		currentTicket.items.forEach((item) => {
			const product = products.find((product) => product.id === item.id)
			if (product) {
				const newStock = product.stock - item.cantidad
				db.productos.upsert({
					...product,
					stock: newStock
				})
			}
		})

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

	//use effect para el body
	useEffect(() => {
		const body = document.querySelector('body')
		if (body) {
			body.style.pointerEvents = isBoletaOpen ? 'all' : 'all'
		}
	}, [isBoletaOpen])
	//fin del use effect

	// Fetchea los productos al montar el componente
	useEffect(() => {
		fetchProductos()
		fetchUsuarios()
	}, [])

	// Guardar los tickets en localStorage cada vez que cambien
	useEffect(() => {
		localStorage.setItem('tickets', JSON.stringify(tickets))
	}, [tickets])

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

			if (e.ctrlKey && e.key === 'Enter') {
				// hacer click programaticamente a confirm-button nextjs "Button"
				const confirmButton = document.getElementById('confirm-button')
				if (confirmButton) {
					confirmButton.click()
				}
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	useEffect(() => {
		if (isAuthDialogOpen) {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === 'Enter') {
					// hacer click programaticamente a confirm-button nextjs "Button"
					const authConfirmButton = document.getElementById('auth-confirm')
					if (authConfirmButton) {
						authConfirmButton.click()
						setIsAuthDialogOpen(false)
					}
				}
			}

			window.addEventListener('keydown', handleKeyDown)

			return () => {
				window.removeEventListener('keydown', handleKeyDown)
			}
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

	useEffect(() => {
		if (!isVerified) {
			setOtherFocus(true)
			setInputFocus(true)
		} else {
			setInputFocus(false)
			setOtherFocus(false)
		}
	}, [isVerified])

	useEffect(() => {
		if (db?.productos) {
			const localId = localStorage.getItem('userUuid')
			const Id_negocio = localId?.replaceAll('"', '')

			const subscription = db.productos
				.find({
					selector: { id_negocio: Id_negocio }
				})
				.$ // '$' provides an observable that emits every time the query result changes
				.subscribe((productosData: any[]) => {
					const productos = productosData.map((productos) => productos.toJSON())
					setProducts(productos)
				})

			// Clean up the subscription on component unmount
			return () => subscription.unsubscribe()
		}
	}, [db])

	useEffect(() => {
		if (db?.usuarios) {
			const localId = localStorage.getItem('userUuid')
			const Id_negocio = localId?.replaceAll('"', '')

			const subscription = db.usuarios
				.find({
					selector: { id_negocio: Id_negocio }
				})
				.$ // '$' provides an observable that emits every time the query result changes
				.subscribe((usuariosData: any[]) => {
					const usuarios = usuariosData.map((usuarios) => usuarios.toJSON())
					setUsuarios(usuarios)
				})

			// Clean up the subscription on component unmount
			return () => subscription.unsubscribe()
		}
	}, [db])

	// Subscribe to changes in the productos collection
	useEffect(() => {
		const localId = localStorage.getItem('userUuid')
		const Id_negocio = localId?.replaceAll('"', '')
		if (db?.productos) {
			const subscription = db.productos
				.find({
					selector: { id_negocio: Id_negocio, stock: { $gt: 0 } }
				})
				.$ // '$' provides an observable that emits every time the query result changes
				.subscribe((productosData: any[]) => {
					const productos = productosData.map((producto) => producto.toJSON())
					setProducts(productos)
				})

			// Clean up the subscription on component unmount
			return () => subscription.unsubscribe()
		}
	}, [db])

	return (
		<div className='relative transition-all'>
			<Dialog open={isBoletaOpen} onOpenChange={setIsBoletaOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className='text-foreground'>Boleta</DialogTitle>
						<DialogDescription>
							{isBoletaOpen && (
								<iframe
									src={generateBoleta()} // Ahora generamos correctamente la URL del PDF
									width='100%'
									height='500px'
									style={{ border: 'none' }}
								/>
							)}
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			<PosResponsibleGuard
				error={error}
				handlePasswordSubmit={handlePasswordSubmit}
				handleUserSelect={handleUserSelect}
				isDialogOpen={isDialogOpen}
				password={password}
				selectedUser={selectedUser}
				usuarios={usuarios}
				usuariosLoading={usuariosLoading}
				setPassword={setPassword}
			/>

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
			{isVerified && selectedUser && (
				<div className='flex h-[calc(100dvh-1px)] flex-col text-foreground'>
					<header className='flex h-16 items-center justify-between px-3'>
						<button onClick={toggleMenu}>
							<MenuIcon className='fill-foreground' />
						</button>
						<div className='flex items-center space-x-4'>
							<ThemeSwitch />
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

					<main className='inner-custom-shadow dashboard-fondo z-auto flex flex-1 overflow-hidden dark:text-black'>
						<PosMainSection
							currentTicket={currentTicket}
							currentTicketId={currentTicketId}
							handleLogout={handleLogout}
							removeFromCart={removeFromCart}
							selectedUser={selectedUser}
							setInputFocus={setInputFocus}
							setOtherFocus={setOtherFocus}
							setQuantFocus={setQuantFocus}
							switchToTicket={switchToTicket}
							tickets={tickets}
							updateQuantity={updateQuantity}
						/>

						{/* Sidebar */}
						<PosSidebar
							addToCart={addToCart}
							addToCartByBarcode={addToCartByBarcode}
							calculateTotal={calculateTotal}
							cardVoucher={cardVoucher}
							cashAmount={cashAmount}
							confirmOrder={confirmOrder}
							filteredProducts={filteredProducts}
							paymentMethod={paymentMethod}
							setCardVoucher={setCardVoucher}
							setCashAmount={setCashAmount}
							setPaymentMethod={setPaymentMethod}
							productsLoading={productsLoading}
							scannedCode={scannedCode}
							setScannedCode={setScannedCode}
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							setConfirmFocus={setConfirmFocus}
							setInputFocus={setInputFocus}
							setOtherFocus={setOtherFocus}
						/>
					</main>

					<PosFooter
						isPendingDialogOpen={isPendingDialogOpen}
						setIsPendingDialogOpen={setIsPendingDialogOpen}
						setPendingTicketName={setPendingTicketName}
						setOtherFocus={setOtherFocus}
						pendingTicketName={pendingTicketName}
						setPendingTicket={setPendingTicket}
						setIsDeleteDialogOpen={setIsDeleteDialogOpen}
						isDeleteDialogOpen={isDeleteDialogOpen}
						cancelCurrentTicket={cancelCurrentTicket}
						isBoleta={isBoleta}
						setIsBoleta={setIsBoleta}
						isFacturaDialogOpen={isFacturaDialogOpen}
						setIsFacturaDialogOpen={setIsFacturaDialogOpen}
						nombreRazonSocial={nombreRazonSocial}
						setNombreRazonSocial={setNombreRazonSocial}
						giro={giro}
						setGiro={setGiro}
						direccionEmpresa={direccionEmpresa}
						setDireccionEmpresa={setDireccionEmpresa}
						contacto={contacto}
						setContacto={setContacto}
						nombreContacto={nombreContacto}
						setNombreContacto={setNombreContacto}
						rutNif={rutNif}
						setRutNif={setRutNif}
						handleBackFactura={handleBackFactura}
					/>
					<Footer />
				</div>
			)}
		</div>
	)
}
