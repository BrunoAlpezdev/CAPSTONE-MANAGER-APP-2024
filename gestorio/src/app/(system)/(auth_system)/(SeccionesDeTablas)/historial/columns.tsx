'use client'
import React, { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Historial } from '@/types'
import { firestore } from '@/firebase/firebaseConfig'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'react-hot-toast'
import {
	collection,
	getDocs,
	addDoc,
	updateDoc,
	deleteDoc,
	doc
} from 'firebase/firestore'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet'

// Función para obtener los datos de historial desde Firebase
async function getHistorial() {
	const historialesCol = collection(firestore, 'historiales')
	const snapshot = await getDocs(historialesCol)
	const data = snapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data()
	})) as Historial[]
	return data
}

// Definir las columnas para la tabla
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
	},
	{
		id: 'accordion',
		header: 'DETALLES',
		cell: ({ row }) => {
			const historial = row.original
			const [isOpen, setIsOpen] = useState(false)

			const handleToggle = () => {
				setIsOpen(!isOpen)
			}

			return (
				<Sheet>
					<SheetTrigger asChild>
						<Button variant='outline'>Open</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Edit profile</SheetTitle>
							<SheetDescription>
								Make changes to your profile here. Click save when you're done.
							</SheetDescription>
						</SheetHeader>
						<div className='grid gap-4 py-4'></div>
					</SheetContent>
				</Sheet>
			)
		}
	}
]
