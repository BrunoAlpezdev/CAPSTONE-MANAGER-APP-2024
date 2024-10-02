'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
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
		accessorKey: 'Nombre',
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
		header: 'Product',
		cell: ({ row }) => (
			<div className='text-black'>{row.getValue('product')}</div>
		)
	},
	{
		accessorKey: 'Stock',
		header: 'Stock',
		cell: ({ row }) => <div className='text-black'>{row.getValue('email')}</div>
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
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4 text-black' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(user.id)}>
							Agregar
						</DropdownMenuItem>
						<DropdownMenuItem>Modificar</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(user.id)}>
							Eliminar
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]
