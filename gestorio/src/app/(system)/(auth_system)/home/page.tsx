'use client'

import { DashboardItem, Menu } from '@/components'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef } from 'react'
import { createSwapy } from 'swapy'

const DEFAULT = {
	'1': 'a',
	'2': 'b',
	'3': 'c',
	'4': 'd'
}

function A() {
	return (
		<div className='item a' data-swapy-item='a'>
			<DashboardItem title='Ultimas Ventas' />
		</div>
	)
}

function B() {
	return (
		<div className='item b' data-swapy-item='b'>
			<DashboardItem title='Calendario' />
		</div>
	)
}

function C() {
	return (
		<div className='item c' data-swapy-item='c'>
			<DashboardItem title='Ultimas Compras' />
		</div>
	)
}
function D() {
	return (
		<div className='item d' data-swapy-item='d'>
			<DashboardItem title='Ganancias Mensuales' />
		</div>
	)
}
function getItemById(itemId: 'a' | 'b' | 'c' | 'd' | null) {
	switch (itemId) {
		case 'a':
			return <A />
		case 'b':
			return <B />
		case 'c':
			return <C />
		case 'd':
			return <D />
	}
}

export default function HomePage() {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const slotItems: Record<string, 'a' | 'b' | 'c' | 'd' | null> =
		localStorage.getItem('slotItem')
			? JSON.parse(localStorage.getItem('slotItem')!)
			: DEFAULT

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const swapy = createSwapy(container, {
			swapMode: 'hover'
		})
		swapy.onSwap(({ data }) => {
			console.log('swap', data)
			localStorage.setItem('slotItem', JSON.stringify(data.object))
		})
		swapy.onSwapEnd(({ data, hasChanged }) => {
			console.log(hasChanged)
			console.log('end', data)
		})
		swapy.onSwapStart(() => {
			console.log('start')
		})
		return () => {
			swapy.destroy()
		}
	}, [])
	return (
		<main className='dashboard-fondo flex h-[calc(100dvh-83px)] w-full flex-row overflow-hidden font-semibold'>
			<Menu />
			<ScrollArea className='w-full'>
				<section className='flex h-full w-full select-none flex-col gap-8 p-6 text-center text-foreground shadow-inner'>
					<header>
						<h1>Dashboard</h1>
					</header>
					<section
						ref={containerRef}
						className='flex w-full flex-wrap justify-center gap-6'>
						<div className='slot a' data-swapy-slot='1'>
							{getItemById(slotItems['1'])}
						</div>

						<div className='slot b' data-swapy-slot='2'>
							{getItemById(slotItems['2'])}
						</div>

						<div className='slot c' data-swapy-slot='3'>
							{getItemById(slotItems['3'])}
						</div>

						<div className='slot d' data-swapy-slot='4'>
							{getItemById(slotItems['4'])}
						</div>

						<div className='slot d' data-swapy-slot='4'>
							{getItemById(slotItems['4'])}
						</div>
					</section>

					{/* <section className='flex flex-wrap gap-6'>
						<DashboardItem title='Ultimas Ventas' />
						<DashboardItem title='Ultimas Compras' />
						<DashboardItem title='Ganancias Mensuales' />
						<DashboardItem title='Calendario' />
					</section> */}
				</section>
			</ScrollArea>
		</main>
	)
}
