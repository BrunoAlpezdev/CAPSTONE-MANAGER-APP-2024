import { useDataVentas } from '@/hooks/useSalesData'
import { TopProductosData, TopResponsablesData } from '@/types'
import { Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
export const HomeTopResponsables = () => {
	const { mejoresResponsables } = useDataVentas()
	const router = useRouter()
	return (
		<div className='dashboard-container box-shadow flex-grow rounded-sm border-primary/40 bg-foreground/5 text-foreground backdrop-blur-md'>
			<section
				className='mt-2 flex cursor-pointer flex-row gap-2 px-4'
				onClick={() => {
					router.push('/usuarios')
				}}>
				<Package />
				<h2>Responsables Con Más Ventas</h2>
			</section>
			<hr className='solid my-2' />
			{/* Tabla */}
			<div className='w-full flex-grow p-4'>
				<table className='min-w-full overflow-hidden rounded-lg border border-border bg-background text-left shadow-md'>
					<thead className='bg-border text-foreground/90'>
						<tr>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Producto
							</th>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Acumulado de Ventas
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-border text-foreground'>
						{mejoresResponsables.map((responsable) => (
							<tr>
								<td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
									{(() => {
										const sortedResponsables = [...mejoresResponsables].sort(
											(a, b) => b.value - a.value
										)
										const top3 = sortedResponsables.slice(0, 3)
										const getColor = (responsable: TopResponsablesData) => {
											const index = top3.findIndex(
												(r) => r.value === responsable.value
											)
											switch (index) {
												case 0:
													return 'text-yellow-500' // Oro
												case 1:
													return 'text-gray-400' // Plata
												case 2:
													return 'text-orange-500' // Bronce
												default:
													return ''
											}
										}
										return (
											<span className={getColor(responsable)}>
												{responsable.label}
											</span>
										)
									})()}
								</td>
								<td className='whitespace-nowrap px-6 py-4 text-sm'>
									{responsable.value}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
