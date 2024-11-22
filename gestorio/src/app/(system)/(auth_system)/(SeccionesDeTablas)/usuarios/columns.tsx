'use client'
import React from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import { Usuario } from '@/types'
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
	DialogTrigger,
	DialogFooter
} from '@/components/ui/dialog'
import Image from 'next/image'
import { useNotificationStore } from '@/store/notificationStore'
import { useLocalDb } from '@/hooks/useLocaldb'
import toast from 'react-hot-toast'

// This type is used to define the shape of our data.

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
			const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
			const [usuarioModificado, setUsuarioModificado] = useState<Usuario>(user)

			const { ModificarUsuarios } = useLocalDb()

			const handleModificar = () => {
				ModificarUsuarios(user.id, usuarioModificado)
				setIsOpen(false)
			}
			const idUsuario = user.id
			const { EliminarUsuario } = useLocalDb()

			const handleDelete = () => {
				EliminarUsuario(idUsuario)
				setIsDeleteDialogOpen(false)
			}

			const handleCancel = () => {
				setIsOpen(false)
			}

			useEffect(() => {
				const body = document.querySelector('body')
				if (body) {
					body.style.pointerEvents = isOpen ? 'all' : 'all'
				}
			}, [isOpen, isDeleteDialogOpen])

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
							<DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
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
									defaultValue={user.nombre}
									onChange={(e) => {
										setUsuarioModificado({
											...usuarioModificado,
											nombre: e.target.value
										})
									}}
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
									defaultValue={user.email}
									onChange={(e) => {
										setUsuarioModificado({
											...usuarioModificado,
											email: e.target.value
										})
									}}
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
									defaultValue={user.rol}
									onChange={(e) => {
										setUsuarioModificado({
											...usuarioModificado,
											rol: e.target.value
										})
									}}
								/>
							</div>
							<div className='mt-4 flex justify-end'>
								<Button
									variant='secondary'
									className='ml-2'
									onClick={handleModificar}>
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

					<Dialog
						open={isDeleteDialogOpen}
						onOpenChange={setIsDeleteDialogOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Confirmar eliminación</DialogTitle>
							</DialogHeader>
							<p>¿Estás seguro de que quieres eliminar este usuario?</p>
							<DialogFooter>
								<Button
									variant='default'
									onClick={() => setIsDeleteDialogOpen(false)}>
									Cancelar
								</Button>
								<Button variant='destructive' onClick={handleDelete}>
									Eliminar
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</>
			)
		}
	}
]
