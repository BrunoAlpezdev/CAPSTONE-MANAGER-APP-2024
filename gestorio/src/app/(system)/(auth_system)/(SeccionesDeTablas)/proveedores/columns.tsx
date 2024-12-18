'use client'
import React from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import { Producto } from '@/types'
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
import Image from 'next/image'
import { useNotificationStore } from '@/store/notificationStore'

// This type is used to define the shape of our data.

export const columns: ColumnDef<Producto>[] = [
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
			const product = row.original
			return <div className='text-foreground'>{product.nombre}</div>
		}
	},
	{
		accessorKey: 'barcode',
		header: 'barcode',
		cell: ({ row }) => {
			const product = row.original
			return <div className='text-foreground'>{product.barcode}</div>
		}
	},
	{
		accessorKey: 'marca',
		header: 'marca',
		cell: ({ row }) => {
			const product = row.original
			return <div className='text-foreground'>{product.marca}</div>
		}
	},
	{
		accessorKey: 'precio',
		header: 'Precio',
		cell: ({ row }) => {
			const product = row.original
			return <div className='text-foreground'>{product.precio}</div>
		}
	},
	{
		accessorKey: 'stock',
		header: 'Stock',
		cell: ({ row }) => {
			const product = row.original
			return <div className='text-foreground'>{product.stock}</div>
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const product = row.original
			const [isOpen, setIsOpen] = useState(false)
			const [productType, setProductType] = useState(product.id_negocio)

			const handleCopyToClipboard = async () => {
				try {
					await navigator.clipboard.writeText(product.id)
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

			const { addNotification } = useNotificationStore()
			useEffect(() => {
				if (product.stock < 10) {
					const message = `El producto ${product.nombre} tiene un stock menor a 10 unidades.`
					addNotification(message)
				}
			}, [product])

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
							<DropdownMenuItem>Eliminar</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle className='text-foreground'>
									Modificar campos
								</DialogTitle>
								<DialogDescription>
									Aquí puedes modificar los campos.
								</DialogDescription>
							</DialogHeader>
							<div>
								<label
									htmlFor='username'
									className='block text-sm font-medium text-foreground'>
									Nombre
								</label>
								<input
									type='text'
									name='username'
									id='username'
									className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									defaultValue={product.nombre}
								/>
								<label
									htmlFor='precio'
									className='block text-sm font-medium text-foreground'>
									precio
								</label>
								<input
									type='text'
									name='type'
									id='type'
									className='mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									defaultValue={product.precio} // Usa value para controlar el input
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
