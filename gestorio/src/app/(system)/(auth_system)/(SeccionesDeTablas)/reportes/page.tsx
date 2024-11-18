'use client'

import { Monitor } from 'lucide-react'
import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	PieChart,
	Pie,
	Cell,
	LineChart,
	Line,
	LabelList,
	Tooltip as RechartsTooltip,
	Legend
} from 'recharts'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent
} from '@/components/ui/chart'
import { useState } from 'react'

const chartConfig = {
	desktop: {
		label: 'Desktop',
		icon: Monitor,
		color: 'hsl(var(--chart-1))'
	},
	mobile: {
		label: 'Mobile',
		color: 'hsl(var(--chart-2))'
	},
	otro: {
		label: 'Otro',
		color: 'hsl(var(--chart-3))'
	},
	otra: {
		label: 'Otra',
		color: 'hsl(var(--chart-4))'
	}
} satisfies ChartConfig

const chartData = [
	{ month: 'January', desktop: 186, mobile: 80, otro: 100, otra: 140 },
	{ month: 'February', desktop: 305, mobile: 200, otro: 100, otra: 140 },
	{ month: 'March', desktop: 237, mobile: 120, otro: 100, otra: 140 },
	{ month: 'April', desktop: 73, mobile: 190, otro: 100, otra: 140 },
	{ month: 'May', desktop: 209, mobile: 130, otro: 150, otra: 140 },
	{ month: 'June', desktop: 214, mobile: 140, otro: 100, otra: 140 },
	{ month: 'July', desktop: 214, mobile: 140, otro: 214, otra: 140 }
]

const combinedData = {
	monthlyData: chartData,
	pieData: [
		{
			name: 'Desktop',
			value: chartData.reduce((acc, curr) => acc + curr.desktop, 0)
		},
		{
			name: 'Mobile',
			value: chartData.reduce((acc, curr) => acc + curr.mobile, 0)
		},
		{
			name: 'Otro',
			value: chartData.reduce((acc, curr) => acc + curr.otro, 0)
		},
		{
			name: 'Otra',
			value: chartData.reduce((acc, curr) => acc + curr.otra, 0)
		}
	]
}

const totalValue = combinedData.pieData.reduce(
	(acc, item) => acc + item.value,
	0
)

export default function GestionDeReportes() {
	const [selectedChart, setSelectedChart] = useState<
		'bar' | 'pie' | 'line' | null
	>(null)
	const { monthlyData, pieData } = combinedData

	const renderChart = () => {
		switch (selectedChart) {
			case 'bar':
				return (
					<ChartContainer config={chartConfig} className='h-[50rem] w-[100rem]'>
						<BarChart data={monthlyData}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='month'
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<ChartLegend content={<ChartLegendContent />} />
							<Bar
								dataKey='desktop'
								fill={chartConfig.desktop.color}
								radius={4}
							/>
							<Bar
								dataKey='mobile'
								fill={chartConfig.mobile.color}
								radius={4}
							/>
							<Bar dataKey='otro' fill={chartConfig.otro.color} radius={4} />
							<Bar dataKey='otra' fill={chartConfig.otra.color} radius={4} />
						</BarChart>
					</ChartContainer>
				)
			case 'pie':
				return (
					<ChartContainer config={chartConfig} className='h-[50rem] w-[100rem]'>
						<PieChart>
							<Pie
								data={pieData}
								dataKey='value'
								nameKey='name'
								innerRadius={80}
								outerRadius={120}
								paddingAngle={5}
								label={({ name, percent }) =>
									`${name}: ${(percent * 100).toFixed(0)}%`
								}>
								{pieData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={
											chartConfig[
												entry.name.toLowerCase() as keyof typeof chartConfig
											].color
										}
									/>
								))}
							</Pie>
							<text
								x='50%'
								y='50%'
								dominantBaseline='middle'
								textAnchor='middle'
								className='fill-foreground text-2xl font-bold'>
								{totalValue}
							</text>
							<RechartsTooltip />
							<Legend />
						</PieChart>
					</ChartContainer>
				)
			case 'line':
				return (
					<ChartContainer config={chartConfig} className='h-[50rem] w-[100rem]'>
						<LineChart
							accessibilityLayer
							data={monthlyData}
							margin={{ top: 20, left: 12, right: 12 }}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey='month'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip
								cursor={false}
								content={<ChartTooltipContent indicator='line' />}
							/>
							<Line
								dataKey='desktop'
								type='natural'
								stroke={chartConfig.desktop.color}
								strokeWidth={2}
								dot={{ fill: chartConfig.desktop.color }}
								activeDot={{ r: 6 }}>
								<LabelList
									position='top'
									offset={12}
									className='fill-foreground'
									fontSize={12}
								/>
							</Line>
							<Line
								dataKey='mobile'
								type='natural'
								stroke={chartConfig.mobile.color}
								strokeWidth={2}
								dot={{ fill: chartConfig.mobile.color }}
								activeDot={{ r: 6 }}>
								<LabelList
									position='top'
									offset={12}
									className='fill-foreground'
									fontSize={12}
								/>
							</Line>
						</LineChart>
					</ChartContainer>
				)
			default:
				return (
					<div className='text-center text-gray-500'>
						Seleccione un gráfico y variables para visualizar reportes.
					</div>
				)
		}
	}

	return (
		<div className='relative transition-all'>
			<div className='flex justify-between p-4'>
				<div className='flex h-[50rem] w-[80%] items-center justify-center rounded-lg border border-gray-300 p-4'>
					{renderChart()}
				</div>
				<div className='ml-4 flex flex-col justify-center space-y-2'>
					<button
						className='rounded bg-blue-500 px-4 py-2 text-white'
						onClick={() => setSelectedChart('bar')}>
						Gráfico de Barras
					</button>
					<button
						className='rounded bg-green-500 px-4 py-2 text-white'
						onClick={() => setSelectedChart('pie')}>
						Gráfico de Pastel
					</button>
					<button
						className='rounded bg-red-500 px-4 py-2 text-white'
						onClick={() => setSelectedChart('line')}>
						Gráfico de Líneas
					</button>
				</div>
			</div>
		</div>
	)
}
