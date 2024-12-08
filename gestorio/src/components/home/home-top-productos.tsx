import { useDataVentas } from '@/hooks/useSalesData'
import { TopProductosData } from '@/types'
import { Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
export const HomeTopProductos = () => {
	const { topProductos } = useDataVentas()
	const router = useRouter()
	return (
		<div className='dashboard-container box-shadow flex-grow rounded-sm border-primary/40 bg-foreground/5 text-foreground backdrop-blur-md'>
			<section
				className='mt-2 flex cursor-pointer flex-row gap-2 px-4'
				onClick={() => {
					router.push('/inventario')
				}}>
				<Package />
				<h2>Productos Más Vendidos</h2>
			</section>
			<hr className='solid my-2' />
			{/* Tabla */}
			<div className='w-full flex-grow p-4'>
				<div className='scrollbar-modifier max-h-full max-w-full overflow-x-scroll'>
					<table className='min-w-full overflow-hidden rounded-lg border border-border bg-background text-left shadow-md'>
						<thead className='bg-border text-foreground/90'>
							<tr>
								<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
									Producto
								</th>
								<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
									Cantidad Vendidos
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-border text-foreground'>
							{topProductos.map((producto) => (
								<tr key={producto.id}>
									<td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
										{(() => {
											const sortedProductos = [...topProductos].sort(
												(a, b) => b.value - a.value
											)
											const top3 = sortedProductos.slice(0, 3)
											const getColor = (producto: TopProductosData) => {
												const index = top3.findIndex(
													(p) => p.value === producto.value
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
												<span className={getColor(producto)}>
													{producto.label}
												</span>
											)
										})()}
									</td>
									<td className='whitespace-nowrap px-6 py-4 text-sm'>
										{producto.value}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
