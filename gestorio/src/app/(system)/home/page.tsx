import { DashboardItem, Menu } from '@/components/index'

export default function HomePage() {
	return (
		<main className='flex flex-row w-full h-full font-semibold'>
			<Menu />
			<section className='flex flex-col gap-8 w-full p-6 text-center'>
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
