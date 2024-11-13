'use client'
import React from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useEffect } from 'react'
import { Historial } from '@/types'
import { firestore } from '@/firebase/firebaseConfig'
import { Toaster, toast } from 'react-hot-toast'
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	doc
} from 'firebase/firestore'

async function getHistorial() {
	const historialesCol = collection(firestore, 'historiales')
	const snapshot = await getDocs(historialesCol)
	const data = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	})) as Historial[]
	return data
}

export const columns: ColumnDef<Historial>[] = [
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
		accessorKey: 'id',
		header: 'CÓDIGO',
		cell: ({ row }) => {
			const historial = row.original
			return <div className='text-foreground'>{historial.id}</div>
		}
	},
	{
		accessorKey: 'responsable',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className='text-foreground'>
					RESPONSABLE
					<ArrowUpDown className='ml-2 h-4 w-4 text-foreground' />
				</Button>
			)
		},
		cell: ({ row }) => {
			const historial = row.original
			return <div className='text-foreground'>{historial.responsable}</div>
		}
	},
	{
		accessorKey: 'totalVenta',
		header: 'TOTAL VENTA',
		cell: ({ row }) => {
			const historial = row.original
			return <div className='text-foreground'>{historial.totalVenta}</div>
		}
	},
	{
		accessorKey: 'pago',
		header: 'MÉTODO DE PAGO',
		cell: ({ row }) => {
			const historial = row.original
			return <div className='text-foreground'>{historial.pago}</div>
		}
	}
]
