'use client'
import React from 'react'
import { ResponsiveBar } from '@nivo/bar'

interface BarChartProps {
	data: any[]
	keys: string[]
	indexBy: string
	axisBottomLegend: string
	axisLeftLegend: string
}

const BarChart: React.FC<BarChartProps> = ({
	data,
	keys,
	indexBy,
	axisBottomLegend,
	axisLeftLegend
}) => {
	// Asignar un color único por producto
	const getColor = (bar: any) => {
		// Aquí puedes personalizar la lógica de colores, por ejemplo, usando un hash del producto
		// o generando colores de manera dinámica con la librería d3
		const colors = [
			'#3c73a7',
			'#893391',
			'#3357FF',
			'#a269d1',
			'#c73b71',
			'#9c3333'
		]
		const index = bar.index % colors.length
		return colors[index]
	}

	return (
		<div style={{ height: 400 }}>
			<ResponsiveBar
				data={data}
				keys={keys}
				indexBy={indexBy}
				margin={{ top: 60, right: 100, bottom: 40, left: 65 }} // Márgenes modificados
				padding={0.3}
				valueScale={{ type: 'linear' }}
				indexScale={{ type: 'band', round: true }}
				colors={getColor} // Aplicar la función para colores personalizados
				borderColor={{
					from: 'color',
					modifiers: [['darker', 1.6]]
				}}
				axisTop={null}
				axisRight={null}
				axisBottom={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: axisBottomLegend,
					legendPosition: 'middle',
					legendOffset: 32
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: axisLeftLegend,
					legendPosition: 'middle',
					legendOffset: -55 // Desplazamiento de la leyenda izquierda modificado
				}}
				labelSkipWidth={12}
				labelSkipHeight={12}
				labelTextColor={{
					from: 'color',
					modifiers: [['darker', 1.6]]
				}}
				legends={[
					{
						dataFrom: 'keys',
						anchor: 'bottom-right',
						direction: 'column',
						justify: false,
						translateX: 120,
						translateY: 0,
						itemsSpacing: 2,
						itemWidth: 100,
						itemHeight: 20,
						itemDirection: 'left-to-right',
						itemOpacity: 0.85,
						symbolSize: 20,
						effects: [
							{
								on: 'hover',
								style: {
									itemOpacity: 1
								}
							}
						]
					}
				]}
				role='application'
				ariaLabel='Nivo bar chart'
				barAriaLabel={(e) => `${e.id}: ${e.formattedValue} in ${e.indexValue}`}
			/>
		</div>
	)
}

export default BarChart
