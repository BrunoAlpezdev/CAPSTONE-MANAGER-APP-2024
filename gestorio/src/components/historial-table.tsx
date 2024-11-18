'use client'

import React, { useState } from 'react'
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion'

const pageSizeOptions = [5, 8, 10, 15, 20]

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

	const [date, setDate] = useState<Date>()
	const [pageSize, setPageSize] = useState(8)

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
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: pageSize
			}
		}
	})

	return (
		<>
			{/* Table */}
			<div className='justify- mr-5 flex items-center'>
				<div className='ml-3 flex items-center py-4'>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={'outline'}
								className={cn(
									'w-[280px] justify-start text-left font-normal',
									!date && 'text-muted-foreground'
								)}>
								<CalendarIcon className='mr-2 h-4 w-4' />
								{date ? format(date, 'dd-MM-yyyy') : <span>Elegir Fecha</span>}
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-auto p-0'>
							<Calendar
								mode='single'
								selected={date}
								onSelect={setDate}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className='ml-auto flex items-center space-x-2'>
					<span>Mostrar:</span>
					<Select
						value={String(pageSize)}
						onValueChange={(value) => {
							setPageSize(Number(value))
							table.setPageSize(Number(value))
						}}>
						<SelectTrigger className='w-[70px]'>
							<SelectValue placeholder={String(pageSize)} />
						</SelectTrigger>
						<SelectContent>
							{pageSizeOptions.map((option) => (
								<SelectItem key={option} value={String(option)}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<span>Registros</span>
				</div>
			</div>

			{/* Table Body */}
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
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
			</div>

			{/* Pagination */}
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
