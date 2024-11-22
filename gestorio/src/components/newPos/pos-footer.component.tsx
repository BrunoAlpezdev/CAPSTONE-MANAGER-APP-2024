import { Ban, Bookmark, Building2 } from 'lucide-react'
import { Button } from '../ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '../ui/dialog'
import { DefInput } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'

interface PosFooterProps {
	isPendingDialogOpen: boolean
	setIsPendingDialogOpen: (open: boolean) => void
	pendingTicketName: string
	setPendingTicketName: (name: string) => void
	setOtherFocus: (focus: boolean) => void
	setPendingTicket: () => void
	setIsDeleteDialogOpen: (open: boolean) => void
	isDeleteDialogOpen: boolean
	cancelCurrentTicket: () => void
	setIsBoleta: (isBoleta: boolean) => void
	isBoleta: boolean
	isFacturaDialogOpen: boolean
	setIsFacturaDialogOpen: (open: boolean) => void
	nombreRazonSocial: string
	setNombreRazonSocial: (name: string) => void
	rutNif: string
	setRutNif: (rut: string) => void
	direccionEmpresa: string
	setDireccionEmpresa: (direccion: string) => void
	giro: string
	setGiro: (giro: string) => void
	nombreContacto: string
	setNombreContacto: (name: string) => void
	contacto: string
	setContacto: (contact: string) => void
	handleBackFactura: () => void
}

export const PosFooter: React.FC<PosFooterProps> = ({
	isPendingDialogOpen,
	setIsPendingDialogOpen,
	pendingTicketName,
	setPendingTicketName,
	setOtherFocus,
	setPendingTicket,
	setIsDeleteDialogOpen,
	isDeleteDialogOpen,
	cancelCurrentTicket,
	setIsBoleta,
	isBoleta,
	isFacturaDialogOpen,
	setIsFacturaDialogOpen,
	nombreRazonSocial,
	setNombreRazonSocial,
	rutNif,
	setRutNif,
	direccionEmpresa,
	setDireccionEmpresa,
	giro,
	setGiro,
	nombreContacto,
	setNombreContacto,
	contacto,
	setContacto,
	handleBackFactura
}) => {
	return (
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
				<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
				{!isBoleta && <Separator orientation='vertical' className='h-15' />}
				{!isBoleta && (
					<Dialog
						open={isFacturaDialogOpen}
						onOpenChange={setIsFacturaDialogOpen}>
						<DialogTrigger asChild>
							<Button
								id='cancelar-ticket-button'
								variant='outline'
								className='w-fit gap-2'
								onClick={() => setIsFacturaDialogOpen(true)}>
								<Building2 />
								Ingresar Datos
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Datos de Facturación</DialogTitle>
							</DialogHeader>
							<Separator orientation='horizontal' />
							<h3 className='text-nowrap'>Nombre o Razón social</h3>
							<DefInput
								type='text'
								className='bg-background text-foreground'
								onFocus={() => setOtherFocus(true)}
								onBlur={() => setOtherFocus(false)}
								value={nombreRazonSocial}
								onChange={(e) => setNombreRazonSocial(e.target.value)}
							/>
							<h3 className='text-nowrap'>RUT o NIF</h3>
							<DefInput
								type='text'
								className='bg-background text-foreground'
								onFocus={() => setOtherFocus(true)}
								onBlur={() => setOtherFocus(false)}
								value={rutNif}
								onChange={(e) => setRutNif(e.target.value)}
							/>
							<h3 className='text-nowrap'>Dirección de la Empresa</h3>
							<DefInput
								type='text'
								className='bg-background text-foreground'
								onFocus={() => setOtherFocus(true)}
								onBlur={() => setOtherFocus(false)}
								value={direccionEmpresa}
								onChange={(e) => setDireccionEmpresa(e.target.value)}
							/>
							<h3 className='text-nowrap'>Giro o Actividad Económica</h3>
							<DefInput
								type='text'
								className='bg-background text-foreground'
								onFocus={() => setOtherFocus(true)}
								onBlur={() => setOtherFocus(false)}
								value={giro}
								onChange={(e) => setGiro(e.target.value)}
							/>
							<h3 className='text-nowrap'>Nombre Contacto</h3>
							<DefInput
								type='text'
								className='bg-background text-foreground'
								onFocus={() => setOtherFocus(true)}
								onBlur={() => setOtherFocus(false)}
								value={nombreContacto}
								onChange={(e) => setNombreContacto(e.target.value)}
							/>
							<h3 className='text-nowrap'>Dato de Contacto</h3>
							<DefInput
								type='text'
								className='bg-background text-foreground'
								onFocus={() => setOtherFocus(true)}
								onBlur={() => setOtherFocus(false)}
								value={contacto}
								onChange={(e) => setContacto(e.target.value)}
							/>
							<Button
								variant='default'
								onClick={() => setIsDeleteDialogOpen(false)}>
								Guardar
							</Button>
							<Button variant='outline' onClick={() => handleBackFactura}>
								Volver
							</Button>
						</DialogContent>
					</Dialog>
				)}
			</div>
		</footer>
	)
}
