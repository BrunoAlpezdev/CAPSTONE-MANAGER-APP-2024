'use client'

import { DashboardItem, Menu } from '@/components'

export default function HomePage() {
	return (
		<main className='flex h-[calc(100dvh-82px)] w-full flex-row font-semibold'>
			<Menu />
			<section className='dashboard-fondo flex w-full flex-col gap-8 p-6 text-center text-foreground shadow-inner'>
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
		</main>
	)
}
