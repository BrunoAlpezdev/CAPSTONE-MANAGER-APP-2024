'use client'
import React, { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Historial, VentasConDetalle, Venta } from '@/types'
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
export const columns: ColumnDef<VentasConDetalle>[] = [
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
			const VentaConDetalles: VentasConDetalle = row.original
			return <div className='text-foreground'>{VentaConDetalles.id}</div>
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
			const VentaConDetalles: VentasConDetalle = row.original
			return (
				<div className='text-foreground'>{VentaConDetalles.responsable}</div>
			)
		}
	},
	{
		accessorKey: 'totalVenta',
		header: 'TOTAL VENTA',
		cell: ({ row }) => {
			const VentaConDetalles: VentasConDetalle = row.original
			return (
				<div className='text-foreground'>{VentaConDetalles.totalVenta}</div>
			)
		}
	},
	{
		accessorKey: 'pago',
		header: 'MÉTODO DE PAGO',
		cell: ({ row }) => {
			const VentaConDetalles: VentasConDetalle = row.original
			return (
				<div className='text-foreground'>{VentaConDetalles.metodoDePago}</div>
			)
		}
	},
	{
		id: 'accordion',
		header: 'DETALLES',
		cell: ({ row }) => {
			const VentaConDetalles: VentasConDetalle = row.original
			const [isOpen, setIsOpen] = useState(false)

			const handleToggle = () => {
				setIsOpen(!isOpen)
			}

			return (
				<Sheet>
					<SheetTrigger asChild>
						<Button variant='outline'>Detalle</Button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle className='text-2xl'>Detalles De Venta</SheetTitle>
							<SheetDescription>
								<Label>Detalle Venta id: {VentaConDetalles.id}</Label>
							</SheetDescription>
						</SheetHeader>
						<div className='grid gap-4 py-4'>
							{VentaConDetalles.detalles.map((detalle, index) => (
								<div
									key={index}
									className='rounded-md border border-primary/50 bg-secondary p-4'>
									<div>Detalle n°: {index + 1}</div>
									<div className='my-[4px] h-[1px] w-full bg-white/30'></div>
									<div>nombre: {detalle.nombre}</div>
									<div>variante: {detalle.variante}</div>
									<div>cantidad: {detalle.cantidad}</div>
									<div>precio: {detalle.precio}</div>
								</div>
							))}
						</div>
					</SheetContent>
				</Sheet>
			)
		}
	}
]
