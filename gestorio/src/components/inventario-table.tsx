'use client'

import React, { useEffect } from 'react'
import {
	ColumnDef,
	SortingState,
	VisibilityState,
	flexRender,
	ColumnFiltersState,
	getSortedRowModel,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable
} from '@tanstack/react-table'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
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
import { Producto } from '@/types'
import { useLocalDb } from '@/hooks/useLocaldb'
import { v7 as uuidv7 } from 'uuid'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

export function DataTable<TData, TValue>({
	columns,
	data
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})
	const [isOpen, setIsOpen] = useState(false)
	const { AgregarProducto } = useLocalDb()
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		},
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel()
	})

	const handleCancel = () => {
		setIsOpen(false)
	}

	const handleAgregar = () => {
		const id = GenerateNewId()

		const newProduct = { ...productToAdd, id }

		// Validación básica
		if (!newProduct.nombre || !newProduct.precio || !newProduct.stock) {
			alert('Por favor, completa todos los campos obligatorios.')
			return
		}

		AgregarProducto(newProduct)

		setProductToAdd({
			id: '',
			nombre: '',
			barcode: '',
			marca: '',
			precio: 0,
			id_negocio: Id_negocio ?? '',
			variante: '',
			stock: 0
		})
		setIsOpen(false)
	}

	useEffect(() => {
		const body = document.querySelector('body')
		if (body) {
			body.style.pointerEvents = isOpen ? 'all' : 'all'
		}
	}, [isOpen])

	const GenerateNewId = () => {
		return uuidv7()
	}

	const Id_negocio = localStorage.getItem('userUuid')

	const [productToAdd, setProductToAdd] = useState<Producto>({
		id: '',
		nombre: '',
		barcode: '',
		marca: '',
		precio: 0,
		id_negocio: Id_negocio ?? '',
		variante: '',
		stock: 0
	})

	return (
		<>
			{/*Table*/}
			<div className='justify- mr-5 flex items-center'>
				<div className='ml-3 flex items-center py-4'>
					<Input
						placeholder='Filtrar Nombre'
						value={
							(table.getColumn('nombre')?.getFilterValue() as string) ?? ''
						}
						onChange={(event) =>
							table.getColumn('nombre')?.setFilterValue(event.target.value)
						}
						className='max-w-sm'
					/>
				</div>
				<div className='ml-auto flex items-center space-x-2'>
					<Button variant='outline' onClick={() => setIsOpen(true)}>
						Agregar
					</Button>

					{/* Dialog para agregar */}
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle className='text-foreground'>
									Rellene los campos
								</DialogTitle>
								<DialogDescription>
									Aquí puedes agregar campos.
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
										onChange={(e) => {
											setProductToAdd({
												...productToAdd,
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
										onChange={(e) => {
											setProductToAdd({
												...productToAdd,
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
										onChange={(e) => {
											setProductToAdd({
												...productToAdd,
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
										onChange={(e) => {
											setProductToAdd({
												...productToAdd,
												precio: parseInt(e.target.value)
											})
										}}
									/>
								</div>
								<div>
									<label
										htmlFor='username'
										className='block text-sm font-medium'>
										variante
									</label>
									<input
										type='text'
										name='username'
										id='username'
										className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
										onChange={(e) => {
											setProductToAdd({
												...productToAdd,
												variante: e.target.value
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
										name='stock'
										id='type'
										className='mt-1 block w-full rounded-md border border-border bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:ring-ring sm:text-sm'
										onChange={(e) => {
											setProductToAdd({
												...productToAdd,
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
									onClick={handleAgregar}>
									Agregar
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
					{/* Dialog para agregar */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='ml-auto'>
								Columnas
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className='capitalize'
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}>
											{column.id}
										</DropdownMenuCheckboxItem>
									)
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>{' '}
			{/*Pagination*/}
			<div className='mr-5 flex items-center justify-end space-x-2 py-4'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
					className='text-foreground'>
					anterior
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
					className='text-foreground'>
					siguiente
				</Button>
			</div>
		</>
	)
}
