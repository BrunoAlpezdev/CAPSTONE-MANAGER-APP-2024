import React, { useEffect, useState } from 'react'
import { ResponsiveAreaBump } from '@nivo/bump'

// Definir los tipos de datos que esperamos
interface Venta {
	fecha: string
	promedio: number
}

interface PromedioVentaPorDiaProps {
	ventasDiarias: Venta[][]
}

const PromedioVentaPorDia: React.FC<PromedioVentaPorDiaProps> = ({
	ventasDiarias
}) => {
	const [data, setData] = useState<any[]>([])

	useEffect(() => {
		const formattedData = ventasDiarias.map((item: Venta[]) => ({
			id: 'Ventas',
			data: item.map((venta: Venta) => ({
				x: venta.fecha,
				y: venta.promedio
			}))
		}))
		setData(formattedData)
	}, [ventasDiarias])

	return (
		<div style={{ height: '500px' }}>
			{data.length > 0 ? (
				<ResponsiveAreaBump
					data={data}
					margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
					spacing={8}
					colors={{ scheme: 'nivo' }}
					blendMode='multiply'
					defs={[
						{
							id: 'dots',
							type: 'patternDots',
							background: 'inherit',
							color: '#38bcb2',
							size: 4,
							padding: 1,
							stagger: true
						},
						{
							id: 'lines',
							type: 'patternLines',
							background: 'inherit',
							color: '#eed312',
							rotation: -45,
							lineWidth: 6,
							spacing: 10
						}
					]}
					fill={[
						{
							match: { id: 'Ventas' },
							id: 'dots'
						}
					]}
					startLabel={(datum) => datum.id} // Cambiado a una función que devuelve el 'id'
					endLabel={(datum) => datum.id} // Cambiado a una función que devuelve el 'id'
					axisTop={{
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						legend: 'Fecha',
						legendPosition: 'middle',
						legendOffset: -36
					}}
					axisBottom={{
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
						legend: 'Día',
						legendPosition: 'middle',
						legendOffset: 32
					}}
				/>
			) : (
				<p>No hay datos de ventas para mostrar.</p>
			)}
		</div>
	)
}

export default PromedioVentaPorDia
