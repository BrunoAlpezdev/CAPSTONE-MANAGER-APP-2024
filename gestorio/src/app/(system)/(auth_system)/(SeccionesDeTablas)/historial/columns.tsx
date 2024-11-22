'use client'
import React, { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Historial, VentasConDetalle, Venta } from '@/types'
import { firestore } from '@/firebase/firebaseConfig'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'react-hot-toast'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
					<SheetContent className='flex h-full max-h-screen flex-col'>
						<SheetHeader>
							<SheetTitle className='text-2xl'>Detalles De Venta</SheetTitle>
							<SheetDescription>
								<Label>Detalle Venta id: {VentaConDetalles.id}</Label>
							</SheetDescription>
						</SheetHeader>
						<div className='flex-1 overflow-hidden'>
							<ScrollArea className='h-full overflow-y-auto'>
								<div className='grid gap-6 py-6'>
									{VentaConDetalles.detalles.map((detalle, index) => (
										<div
											key={index}
											className='rounded-md border border-primary/50 bg-secondary p-6'>
											<div className='text-lg font-semibold'>
												Detalle n°: {index + 1}
											</div>
											<div className='my-2 h-[2px] w-full bg-white/30'></div>
											<div>
												Nombre:{' '}
												<span className='font-medium'>{detalle.nombre}</span>
											</div>
											<div>
												Variante:{' '}
												<span className='font-medium'>{detalle.variante}</span>
											</div>
											<div>
												Cantidad:{' '}
												<span className='font-medium'>{detalle.cantidad}</span>
											</div>
											<div>
												Precio:{' '}
												<span className='font-medium'>${detalle.precio}</span>
											</div>
										</div>
									))}
								</div>
							</ScrollArea>
						</div>
					</SheetContent>
				</Sheet>
			)
		}
	}
]
