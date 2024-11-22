'use client'
import React from 'react'
import { ResponsiveSunburst } from '@nivo/sunburst'

interface SunburstVentasProps {
	ventasMensuales: { mes: string; ventas: number }[]
}

const SunburstVentas: React.FC<SunburstVentasProps> = ({ ventasMensuales }) => {
	const data = {
		name: 'Ventas',
		children: ventasMensuales.map((item) => ({
			name: item.mes,
			loc: item.ventas
		}))
	}

	return (
		<div style={{ height: 400 }}>
			<h2 className='mb-4 text-xl font-semibold'>
				Distribución de Ventas Mensuales
			</h2>
			<ResponsiveSunburst
				data={data}
				margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
				id='name'
				value='loc'
				cornerRadius={9}
				borderWidth={2}
				borderColor={{ theme: 'background' }}
				colors={{ scheme: 'nivo' }}
				childColor={{
					from: 'color',
					modifiers: [['brighter', 0.4]]
				}}
				enableArcLabels={true}
				arcLabelsSkipAngle={45}
				arcLabelsTextColor={{
					from: 'color',
					modifiers: [['darker', 1.4]]
				}}
			/>
		</div>
	)
}

export default SunburstVentas
