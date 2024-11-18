'use client'
import React, { useState, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion'

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
				<Accordion type='single' collapsible className='w-full'>
					<AccordionItem value='item-1'>
						{/* Mostrar la palabra "Resumen" solo cuando el acordeón está abierto */}
						<AccordionTrigger
							onClick={handleToggle}
							className='flex items-center justify-between border-0 outline-none hover:border-none hover:no-underline focus:ring-0'>
							<span className={`${isOpen ? 'block' : 'hidden'}`}>Resumen</span>
							{/* Solo mostrar la palabra "Resumen" cuando el acordeón está abierto */}
						</AccordionTrigger>
						<AccordionContent>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p>
										<strong>Cantidad:</strong> {historial.pago}
									</p>
									<p>
										<strong>Precio:</strong> {historial.pago}
									</p>
								</div>
								<div>
									<p>
										<strong>Fecha:</strong> {historial.pago}
									</p>
									<p>
										<strong>Venta:</strong> {historial.pago}
									</p>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			)
		}
	}
]
