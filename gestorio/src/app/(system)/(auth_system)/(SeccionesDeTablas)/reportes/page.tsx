'use client'

import React from 'react'
import { useDataVentas } from '@/hooks/useSalesData'
import BarChart from '@/components/bar-chart'

export default function ReportesPage() {
	const { ventasMensuales, transaccionesMensuales } = useDataVentas()

	return (
		<div className='p-6'>
			<h1 className='mb-4 text-2xl font-bold'>Reportes de Ventas</h1>

			{/* Gráfico de Ventas Mensuales */}
			<div className='mb-8'>
				<h2 className='text-xl font-semibold'>Ventas Mensuales</h2>
				<BarChart
					data={ventasMensuales}
					keys={['ventas']}
					indexBy='mes'
					axisBottomLegend='Mes'
					axisLeftLegend='Ventas ($)'
				/>
			</div>

			{/* Gráfico de Transacciones Mensuales */}
			<div className='mb-8'>
				<h2 className='text-xl font-semibold'>Transacciones Mensuales</h2>
				<BarChart
					data={transaccionesMensuales}
					keys={['transacciones']}
					indexBy='mes'
					axisBottomLegend='Mes'
					axisLeftLegend='Transacciones'
				/>
			</div>
		</div>
	)
}
