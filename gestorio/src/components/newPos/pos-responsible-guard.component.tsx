'use client'
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '../ui/dialog'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '../ui/select'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Usuario } from '@/types'
import { CSSProperties } from 'react'
import { useRouter } from 'next/navigation'

const cssOverride: CSSProperties = {
	display: 'block',
	margin: '0 auto',
	borderColor: 'red'
}

interface PosMainSectionProps {
	selectedUser: Usuario | null
	isDialogOpen: boolean
	handleUserSelect: (value: string) => void
	usuariosLoading: boolean
	usuarios: Usuario[]
	password: string
	setPassword: (password: string) => void
	handlePasswordSubmit: () => void
	error: string
}

export const PosResponsibleGuard: React.FC<PosMainSectionProps> = ({
	selectedUser,
	isDialogOpen,
	handleUserSelect,
	usuariosLoading,
	usuarios,
	password,
	setPassword,
	handlePasswordSubmit,
	error
}) => {
	const router = useRouter()
	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={() => {
				router.back()
			}}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Seleccionar Responsable</DialogTitle>
					<DialogDescription>
						Por favor, selecciona tu nombre y ingresa tu contraseña para
						acceder.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<Select onValueChange={handleUserSelect}>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Selecciona un responsable' />
						</SelectTrigger>
						<SelectContent>
							{usuariosLoading ? (
								<ClimbingBoxLoader color='#000' cssOverride={cssOverride} />
							) : (
								<SelectGroup>
									<SelectLabel>Responsable</SelectLabel>
									{usuarios.map((usuario) => (
										<SelectItem key={usuario.id} value={usuario.nombre}>
											{usuario.nombre}
										</SelectItem>
									))}
								</SelectGroup>
							)}
						</SelectContent>
					</Select>
					{selectedUser && (
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='password' className='text-right'>
								Contraseña
							</Label>
							<Input
								id='password'
								type='password'
								value={password}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setPassword(e.target.value)
								}
								className='col-span-3'
							/>
						</div>
					)}
					{error && <p className='text-sm text-red-500'>{error}</p>}
				</div>
				<DialogFooter>
					<Button
						id='auth-confirm'
						onClick={handlePasswordSubmit}
						disabled={!selectedUser}>
						Verificar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
