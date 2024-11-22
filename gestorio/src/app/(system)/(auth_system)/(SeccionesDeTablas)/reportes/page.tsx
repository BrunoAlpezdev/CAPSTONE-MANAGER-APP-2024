'use client'

import { useMenu } from '@/hooks'
import React, { useState } from 'react'
import BarChart from '@/components/bar-chart'
import PieChart from '@/components/pie-chart'
import LineChart from '@/components/line-chart'
import { useDataVentas } from '@/hooks/useSalesData'
import { Footer, FullLogo, ToggleMenu } from '@/components'
import toast, { Toaster } from 'react-hot-toast'
import { SystemHeader } from '@/components/systemHeader.component'
import { ScrollArea } from '@/components/ui/scroll-area'
import SunburstVentas from '@/components/sunburst'

// Definimos el tipo para los gráficos
type ChartOption = {
	id: string
	label: string
	component: JSX.Element
}

export default function ReportesPage() {
	const {
		ingresosMensuales,
		transaccionesMensuales,
		topProductos,
		promedioVentasDiarias
	} = useDataVentas()
	const { isMenuOpen, toggleMenu } = useMenu()

	// Lista de opciones de gráficos con su tipado
	const chartOptions: ChartOption[] = [
		{
			id: 'ingresos',
			label: 'Ingresos Mensuales',
			component: (
				<BarChart
					data={ingresosMensuales}
					keys={['ventas']}
					indexBy='mes'
					axisBottomLegend='Mes'
					axisLeftLegend='ingresos ($)'
				/>
			)
		},
		{
			id: 'transacciones',
			label: 'Transacciones Mensuales',
			component: (
				<BarChart
					data={transaccionesMensuales}
					keys={['transacciones']}
					indexBy='mes'
					axisBottomLegend='Mes'
					axisLeftLegend='Transacciones'
				/>
			)
		},
		{
			id: 'productos',
			label: 'Producto más vendido',
			component: (
				<PieChart
					data={topProductos.map((producto) => ({
						id: producto.label,
						label: producto.label,
						value: producto.value,
						color: producto.color
					}))}
				/>
			)
		}
	]

	// Estado para el gráfico seleccionado
	const [selectedChart, setSelectedChart] = useState<ChartOption | null>(null)

	return (
		<div className='flex h-screen flex-col overflow-hidden overflow-y-auto'>
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
			<div className='flex-1'>
				<div className='flex h-auto'>
					{/* Área de gráficos */}
					<div className='flex-1 p-6'>
						{selectedChart ? (
							<div>
								<h2 className='mb-5 text-2xl font-semibold'>
									{selectedChart.label}
								</h2>
								<div className='rounded-md border bg-white p-4 shadow'>
									{selectedChart.component}
								</div>
							</div>
						) : (
							<div className='flex h-full items-center justify-center text-gray-500'>
								<p>Seleccione un gráfico para visualizar los reportes</p>
							</div>
						)}
					</div>

					{/* Panel lateral (cards de gráficos) */}
					<div className='w-1/5 bg-white p-4 dark:bg-background'>
						<h2 className='mb-4 text-4xl font-bold text-foreground'>
							Gráficos
						</h2>
						<div className='space-y-4'>
							{chartOptions.map((chart) => (
								<div
									key={chart.id}
									onClick={() => setSelectedChart(chart)}
									className={`group relative cursor-pointer rounded-md transition-shadow hover:shadow-xl hover:shadow-black/30 ${
										selectedChart?.id === chart.id
											? 'border border-accent bg-accent/20'
											: 'border border-secondary bg-secondary/10'
									}`}>
									{/* Imagen de fondo o placeholder */}
									<div className='relative h-40 w-full overflow-hidden rounded-t-md bg-gray-200'>
										<img
											src={`/icons/${chart.id}.png`}
											alt={chart.label}
											className='h-full w-full object-cover opacity-50 group-hover:opacity-100'
										/>
									</div>

									{/* Fondo del hover */}
									<div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 group-hover:from-black/70 group-hover:via-black/60'></div>

									{/* Contenedor del título */}
									<div className='absolute inset-0 flex translate-y-0 items-center justify-center text-center transition-all duration-500 group-hover:-translate-y-8'>
										<h1 className='z-10 text-2xl font-bold text-primary'>
											{chart.label}
										</h1>
									</div>
									{/* Descripción opcional al hacer hover */}
									<div className='absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 px-4 text-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
										<p className='text-sm text-white'>
											Haga clic para visualizar {chart.label.toLowerCase()}.
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	)
}
