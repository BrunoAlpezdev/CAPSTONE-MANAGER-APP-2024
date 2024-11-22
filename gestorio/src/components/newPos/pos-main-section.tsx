import { Minus, Plus, ShoppingBasket, UserIcon, X } from 'lucide-react'
import { Button, TicketButton } from '../ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { ScrollArea } from '../ui/scroll-area'
import { Input } from '../ui/input'
import { Ticket, Usuario } from '@/types'

interface PosMainSectionProps {
	setOtherFocus: (focus: boolean) => void
	setInputFocus: (focus: boolean) => void
	tickets: Ticket[]
	currentTicketId: number
	switchToTicket: (ticketId: number) => void
	selectedUser: Usuario
	handleLogout: () => void
	currentTicket: Ticket
	updateQuantity: (itemId: string, quantity: number) => void
	setQuantFocus: (focus: boolean) => void
	removeFromCart: (itemId: string) => void
}

export const PosMainSection: React.FC<PosMainSectionProps> = ({
	setOtherFocus,
	setInputFocus,
	tickets,
	currentTicketId,
	switchToTicket,
	selectedUser,
	handleLogout,
	currentTicket,
	updateQuantity,
	setQuantFocus,
	removeFromCart
}) => {
	return (
		<section className='scrollbar-modifier flex flex-1 flex-col gap-2 overflow-y-auto p-2'>
			<div className='flex h-fit items-center justify-between rounded-lg bg-muted px-1'>
				<div className='flex h-fit items-center'>
					<h3 className='font-semibold text-foreground'>Tickets</h3>
					<ScrollArea className='scrollbar-modifier flex h-fit'>
						{tickets.map((ticket) => (
							<TicketButton
								key={ticket.id}
								variant={ticket.id === currentTicketId ? 'default' : 'outline'}
								size='sm'
								className='ml-1'
								onClick={() => switchToTicket(ticket.id)}>
								{ticket.name}
							</TicketButton>
						))}
					</ScrollArea>
				</div>
				<div className='flex flex-row items-center gap-2 text-foreground'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='flex items-center space-x-2'>
								<UserIcon className='h-4 w-4' />
								<span>{selectedUser.nombre}</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-56'>
							<DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<span>Función: {selectedUser.rol}</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleLogout}>
								Cerrar sesión
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<h2 className='ml-1 text-xl font-semibold text-foreground'>
				Carrito Actual: {currentTicket.name}
			</h2>
			<ScrollArea className='scrollbar-modifier h-fit text-foreground'>
				{currentTicket.items.map((item, index) => (
					<div
						key={item.id}
						className='shadow-small mb-2 mr-3 flex items-center rounded-lg bg-primary/25 p-1 shadow-foreground backdrop-blur-sm'>
						<ShoppingBasket className='mx-2 h-8 w-8 rounded-md' />

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
	)
}
