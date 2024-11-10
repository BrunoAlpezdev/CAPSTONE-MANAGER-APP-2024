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
import { useLocalDb } from '@/hooks/useLocaldb'
import toast from 'react-hot-toast'

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
			const [productoModificado, setProductoModificado] =
				useState<Producto>(product)
			const { ModificarProductos } = useLocalDb()
			const handleModificar = () => {
				ModificarProductos(product.id, productoModificado)
				setIsOpen(false)
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
							<div className='flex flex-col gap-3 text-foreground'>
								<div>
									<label
										htmlFor='username'
										className='block text-sm font-medium'>
										Nombre
									</label>
									<input
										type='text'
										name='username'
										id='username'
										className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
										defaultValue={product.nombre}
										onChange={(e) => {
											setProductoModificado({
												...productoModificado,
												nombre: e.target.value
											})
										}}
									/>
								</div>
								<div>
									<label
										htmlFor='barcode'
										className='block text-sm font-medium text-foreground'>
										barcode
									</label>
									<input
										type='string'
										name='type'
										id='type'
										className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
										defaultValue={product.barcode} // Usa value para controlar el input
										onChange={(e) => {
											setProductoModificado({
												...productoModificado,
												barcode: e.target.value
											})
										}}
									/>
								</div>
								<div>
									<label
										htmlFor='marca'
										className='block text-sm font-medium text-foreground'>
										marca
									</label>
									<input
										type='string'
										name='type'
										id='type'
										className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
										defaultValue={product.marca} // Usa value para controlar el input
										onChange={(e) => {
											setProductoModificado({
												...productoModificado,
												marca: e.target.value
											})
										}}
									/>
								</div>
								<div>
									<label
										htmlFor='precio'
										className='block text-sm font-medium text-foreground'>
										precio
									</label>
									<input
										type='string'
										name='type'
										id='type'
										className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
										defaultValue={product.precio} // Usa value para controlar el input
										onChange={(e) => {
											setProductoModificado({
												...productoModificado,
												precio: parseInt(e.target.value)
											})
										}}
									/>
								</div>
								<div>
									<label
										htmlFor='stock'
										className='block text-sm font-medium text-foreground'>
										stock
									</label>
									<input
										type='number'
										name='type'
										id='type'
										className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
										defaultValue={product.stock} // Usa value para controlar el input
										onChange={(e) => {
											setProductoModificado({
												...productoModificado,
												stock: parseInt(e.target.value)
											})
										}}
									/>
								</div>
							</div>
							<div className='mt-4 flex justify-end'>
								<Button
									variant='default'
									className='ml-2'
									onClick={handleModificar}>
									Modificar
								</Button>
								<Button
									variant='destructive'
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
