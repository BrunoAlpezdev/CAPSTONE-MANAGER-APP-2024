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
		accessorKey: 'imagen',
		header: 'Imagen',
		cell: ({ row }) => {
			const product = row.original
			return (
				<div className='font-medium text-foreground'>
					{product.imagen ? (
						<Image
							src={product.imagen}
							alt='Imagen Producto'
							height={40}
							width={40}
							className='aspect-square object-contain'
						/>
					) : (
						<Image
							src='https://loremflickr.com/cache/resized/defaultImage.small_640_480_nofilter.jpg'
							alt='Imagen Producto'
							height={4}
							width={4}
							className='aspect-square object-contain'
						/>
					)}
				</div>
			)
		}
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
		accessorKey: 'variante',
		header: 'Variante',
		cell: ({ row }) => {
			const product = row.original
			return <div className='text-foreground'>{product.variante}</div>
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
			const [productType, setProductType] = useState(product.variante)

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
									htmlFor='type'
									className='block text-sm font-medium text-foreground'>
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
