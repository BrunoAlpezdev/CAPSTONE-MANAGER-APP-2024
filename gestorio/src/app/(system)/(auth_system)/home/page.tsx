'use client'

import { DashboardItem, Menu } from '@/components'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function HomePage() {
	return (
		<main className='flex h-[calc(100dvh-83px)] w-full flex-row overflow-hidden font-semibold'>
			<Menu />
			<ScrollArea>
				<section className='dashboard-fondo flex w-full select-none flex-col gap-8 p-6 text-center text-foreground shadow-inner'>
					<header>
						<h1>Dashboard</h1>
					</header>
					<section className='flex flex-wrap gap-6'>
						<DashboardItem title='Ultimas Ventas' />
						<DashboardItem title='Ultimas Compras' />
						<DashboardItem title='Ganancias Mensuales' />
						<DashboardItem title='Calendario' />
						<DashboardItem title='Calendario' />
					</section>
				</section>
			</ScrollArea>
		</main>
	)
}
