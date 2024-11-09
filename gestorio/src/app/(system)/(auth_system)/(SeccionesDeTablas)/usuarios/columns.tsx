'use client'
import React from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import { Usuario } from '@/types'
import { firestore } from '@/firebase/firebaseConfig'
import { Toaster, toast } from 'react-hot-toast'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	doc
} from 'firebase/firestore'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

// This type is used to define the shape of our data.

async function getUsers() {
	const usuariosCol = collection(firestore, 'usuarios')
	const snapshot = await getDocs(usuariosCol)
	const data = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	})) as Usuario[]
	return data
}

// MODIFICAR USUARIO
async function updateUser(userId: string, updatedUser: Partial<Usuario>) {
	try {
		const userDoc = doc(firestore, 'usuarios', userId) // Referencia al documento basado en el ID
		await updateDoc(userDoc, updatedUser) // Actualiza el documento con los datos proporcionados
		toast.success('Usuario modificado exitosamente')
	} catch (error: any) {
		toast.error('Error al modificar el usuario')
		throw new Error(error.message)
	}
}

// ELIMINAR USUARIO
async function deleteUser(userId: string) {
	try {
		const userDoc = doc(firestore, 'usuarios', userId) // Referencia al documento basado en el ID
		await deleteDoc(userDoc) // Elimina el documento
		toast.success('Usuario eliminado exitosamente')
	} catch (error: any) {
		toast.error('Error al eliminar el usuario')
		throw new Error(error.message)
	}
}

export const columns: ColumnDef<Usuario>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
			/>
		)
	},
	{
		accessorKey: 'nombre',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='text-foreground'>
					Nombre
					<ArrowUpDown className='ml-2 h-4 w-4 text-foreground' />
				</Button>
			)
		},
		cell: ({ row }) => {
			const user = row.original
			return <div className='text-foreground'>{user.nombre}</div>
		}
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => {
			const user = row.original
			return <div className='text-foreground'>{user.email}</div>
		}
	},
	{
		accessorKey: 'rol',
		header: 'Rol',
		cell: ({ row }) => {
			const user = row.original
			return <div className='text-foreground'>{user.rol}</div>
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const user = row.original
			const [isOpen, setIsOpen] = useState(false)
			const [userType, setUserType] = useState(user.rol)
			const [data, setData] = useState<Usuario[]>([])

			const [modifyName, setModifyName] = useState(user.nombre)
			const [modifyEmail, setModifyEmail] = useState(user.email)
			const [modifyRole, setModifyRole] = useState(user.rol)

			const handleCopyToClipboard = async () => {
				try {
					await navigator.clipboard.writeText(user.id)
					console.log('Copiado al portapapeles')
				} catch (error) {
					console.error('Error al copiar:', error)
				}
			}

			const handleCancel = () => {
				setIsOpen(false)
			}

			useEffect(() => {
				const body = document.querySelector('body')
				if (body) {
					body.style.pointerEvents = isOpen ? 'all' : 'all'
				}
			}, [isOpen])

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<span className='sr-only'>Open menu</span>
								<MoreHorizontal className='h-4 w-4 text-foreground' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem onClick={() => setIsOpen(true)}>
								Modificar
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									deleteUser(user.id)
										.catch((error) => toast.error(error.message))
										.finally(() => {
											setIsOpen(false)
										})
								}}>
								Eliminar
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle className='text-foreground'>Modificar</DialogTitle>
								<DialogDescription>
									Aquí puedes modificar los campos.
								</DialogDescription>
							</DialogHeader>
							<div>
								<label
									htmlFor='id'
									className='block text-sm font-medium text-foreground'>
									ID
								</label>
								<input
									disabled
									type='text'
									name='id'
									id='id'
									className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
									value={user.id}
								/>
								<label
									htmlFor='username'
									className='block text-sm font-medium text-foreground'>
									Nombre
								</label>
								<input
									type='text'
									name='username'
									id='username'
									className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
									value={modifyName}
									onChange={(e) => setModifyName(e.target.value)}
								/>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-foreground'>
									Email
								</label>
								<input
									type='email'
									name='email'
									id='email'
									className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
									value={modifyEmail}
									onChange={(e) => setModifyEmail(e.target.value)}
								/>
								<label
									htmlFor='type'
									className='block text-sm font-medium text-foreground'>
									Rol
								</label>
								<input
									type='text'
									name='type'
									id='type'
									className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
									value={modifyRole}
									onChange={(e) => setModifyRole(e.target.value)}
								/>
							</div>
							<div className='mt-4 flex justify-end'>
								<Button
									variant='secondary'
									className='ml-2'
									onClick={(e) => {
										e.preventDefault()
										e.currentTarget.disabled = true
										updateUser(user.id, {
											nombre: modifyName,
											email: modifyEmail,
											rol: modifyRole
										})
											.catch((error) => toast.error(error.message))
											.then(() => {})
											.finally(() => {
												setIsOpen(false)
											})
									}}>
									Modificar
								</Button>
								<Button
									variant='secondary'
									className='ml-2'
									onClick={handleCancel}>
									Cancelar
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</>
			)
		}
	}
]
