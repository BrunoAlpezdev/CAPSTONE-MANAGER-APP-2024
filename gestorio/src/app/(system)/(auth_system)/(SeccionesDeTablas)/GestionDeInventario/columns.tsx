'use client'
import React from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
	id: string
	name: string
	product: 'pending' | 'processing' | 'success' | 'failed'
	email: string
}

export const columns: ColumnDef<User>[] = [
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
		accessorKey: 'Name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='text-black'>
					Nombre
					<ArrowUpDown className='ml-2 h-4 w-4 text-black' />
				</Button>
			)
		},
		cell: ({ row }) => <div className='text-black'>{row.getValue('name')}</div>
	},
	{
		accessorKey: 'Tipo',
		header: 'Tipo',
		cell: ({ row }) => <div className='text-black'>{row.getValue('Tipo')}</div>
	},
	{
		accessorKey: 'Stock',
		header: 'Stock',
		cell: ({ row }) => <div className='text-black'>{row.getValue('Stock')}</div>
	},
	{
		accessorKey: 'Nose',
		header: 'Nose',
		cell: ({ row }) => {
			const date = new Date(row.getValue('lastSeen'))
			const formatted = date.toLocaleDateString()
			return <div className='font-medium text-black'>{formatted}</div>
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const user = row.original
			const [isOpen, setIsOpen] = useState(false)
			const [productType, setProductType] = useState(user.product)

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
				window.location.reload() // Recarga la página
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
								<MoreHorizontal className='h-4 w-4 text-black' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem onClick={() => setIsOpen(true)}>
								Modificar
							</DropdownMenuItem>
							<DropdownMenuItem>Eliminar</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle className='text-black'>
									Modificar campos
								</DialogTitle>
								<DialogDescription>
									Aquí puedes modificar los campos.
								</DialogDescription>
							</DialogHeader>
							<div>
								<label
									htmlFor='username'
									className='block text-sm font-medium text-gray-700'>
									Nombre
								</label>
								<input
									type='text'
									name='username'
									id='username'
									className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									defaultValue={user.name}
								/>
								<label
									htmlFor='type'
									className='block text-sm font-medium text-gray-700'>
									Tipo
								</label>
								<input
									type='text'
									name='type'
									id='type'
									className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									value={productType} // Usa value para controlar el input
								/>
							</div>
							<div className='mt-4 flex justify-end'>
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
