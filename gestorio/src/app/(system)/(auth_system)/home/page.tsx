'use client'

import { Calendar } from '@/components/ui/calendar'
import { Menu } from '@/components'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef, useState } from 'react'
import { createSwapy } from 'swapy'
import { HomeTopProductos } from '@/components/home/home-top-productos'
import { HomeUltVentas } from '@/components/home/home-ultimas-ventas'
import { HomeTopResponsables } from '@/components/home/home-top-resp'

const DEFAULT = {
	'1': 'topProductos',
	'2': 'ultimasVentas',
	'3': 'calendario',
	'4': 'topResponsables'
}

function Calendario() {
	const [date, setDate] = useState<Date | undefined>(new Date())

	return (
		<div
			className='item calendario justify-self-center'
			data-swapy-item='calendario'>
			<Calendar
				mode='single'
				selected={date}
				onSelect={setDate}
				className='rounded-md border bg-background'
			/>
		</div>
	)
}

function TopProductos() {
	return (
		<div className='item topProductos' data-swapy-item='topProductos'>
			<HomeTopProductos />
		</div>
	)
}

function UltimasVentas() {
	return (
		<div className='item ultimasVentas' data-swapy-item='ultimasVentas'>
			<HomeUltVentas />
		</div>
	)
}
function TopResponsables() {
	return (
		<div className='item topResponsables' data-swapy-item='topResponsables'>
			<HomeTopResponsables />
		</div>
	)
}
function getItemById(
	itemId:
		| 'topProductos'
		| 'ultimasVentas'
		| 'calendario'
		| 'topResponsables'
		| null
) {
	switch (itemId) {
		case 'topProductos':
			return <TopProductos />
		case 'ultimasVentas':
			return <UltimasVentas />
		case 'calendario':
			return <Calendario />
		case 'topResponsables':
			return <TopResponsables />
	}
}

export default function HomePage() {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const slotItems: Record<
		string,
		'topProductos' | 'ultimasVentas' | 'calendario' | 'topResponsables' | null
	> = localStorage.getItem('slotItem')
		? JSON.parse(localStorage.getItem('slotItem')!)
		: DEFAULT

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const swapy = createSwapy(container, {
			swapMode: 'hover'
		})
		swapy.onSwap(({ data }) => {
			localStorage.setItem('slotItem', JSON.stringify(data.object))
		})
		swapy.onSwapEnd(({ data, hasChanged }) => {})
		swapy.onSwapStart(() => {})
		return () => {
			swapy.destroy()
		}
	}, [])
	return (
		<main className='flex h-[calc(100dvh-83px)] w-full flex-row overflow-hidden font-semibold'>
			<Menu />
			<ScrollArea className='dashboard-fondo w-full'>
				<section className='flex h-full w-full select-none flex-col gap-8 p-8 text-center text-foreground shadow-inner'>
					<section
						ref={containerRef}
						className='flex w-full flex-wrap justify-center gap-6'>
						<div
							className='slot topProductos w-1/2 2xl:w-1/3'
							data-swapy-slot='1'>
							{getItemById(slotItems['1'])}
						</div>

						<div
							className='slot ultimasVentas w-1/2 2xl:w-1/3'
							data-swapy-slot='2'>
							{getItemById(slotItems['2'])}
						</div>

						<div
							className='slot calendario w-1/2 2xl:w-1/3'
							data-swapy-slot='3'>
							{getItemById(slotItems['3'])}
						</div>

						<div
							className='slot topResponsables w-1/2 2xl:w-1/3'
							data-swapy-slot='4'>
							{getItemById(slotItems['4'])}
						</div>
					</section>
				</section>
			</ScrollArea>
		</main>
	)
}
