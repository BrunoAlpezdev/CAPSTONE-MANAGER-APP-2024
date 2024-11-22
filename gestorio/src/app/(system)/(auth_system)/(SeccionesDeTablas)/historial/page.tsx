'use client'

import { Footer, ToggleMenu } from '@/components'
import { columns } from './columns'
import { DataTable } from '@/components/historial-table'
import { useMenu } from '@/hooks'
import { useState, useEffect, use } from 'react'
import { Toaster } from 'react-hot-toast'
import { SystemHeader } from '@/components/systemHeader.component'
import { Historial, VentasConDetalle } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useVentasConDetalles } from '@/hooks/useDetalleVenta'

import { Progress } from '@/components/ui/progress'
import useDatabaseStore from '@/store/dbStore'
import { useLocalDb } from '@/hooks/useLocaldb'

export default function GestionDeHistoriales() {
	const { fetchData, detalledata } = useVentasConDetalles()

	const { isMenuOpen, toggleMenu } = useMenu()

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<div className='relative overflow-hidden transition-all'>
			<Toaster />
			{/* Overlay translucido (transparencia oscura del menú) */}
			{isMenuOpen && (
				<div
					className='fixed inset-0 z-40 bg-black bg-opacity-50'
					onClick={toggleMenu}
					aria-hidden='true'
				/>
			)}

			<ToggleMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

			<SystemHeader toggleMenu={toggleMenu} />

			{/* Main POS */}
			<main className='tables-fondo m-3 flex h-[calc(100dvh-109px)] w-[calc(100dvw-40px)]'>
				<ScrollArea className='scrollbar-modifier flex h-full w-full rounded-md border border-primary/60 bg-white/5 p-2 text-foreground backdrop-blur-sm'>
					<h1 className='text-center text-3xl font-bold'>
						Historial de Ventas
					</h1>
					<DataTable columns={columns} data={detalledata} />
				</ScrollArea>
			</main>
			<Footer />
		</div>
	)
}
