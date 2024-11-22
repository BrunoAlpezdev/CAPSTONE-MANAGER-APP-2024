import { Package } from 'lucide-react'

export const HomeUltGanancias = () => {
	return (
		<div className='dashboard-container box-shadow flex-grow rounded-sm border-primary/40 bg-foreground/5 text-foreground backdrop-blur-md'>
			<section className='mt-2 flex flex-row gap-2 px-4'>
				<Package />
				<h2>Ultimas Ganancias</h2>
			</section>
			<hr className='solid my-2' />
			{/* Tabla */}
			<div className='w-full flex-grow p-4'>
				<table className='min-w-full overflow-hidden rounded-lg border border-border bg-background text-left shadow-md'>
					<thead className='bg-border text-foreground/90'>
						<tr>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Fecha
							</th>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Cantidad Total Productos
							</th>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Ganancias Totales
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-border text-foreground'>
						<tr>
							<td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
								2021-10-10
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm'>2</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm'>6500</td>
						</tr>
						<tr>
							<td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
								2021-10-10
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm'>2</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm'>6500</td>
						</tr>
						<tr>
							<td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
								2021-10-10
							</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm'>2</td>
							<td className='whitespace-nowrap px-6 py-4 text-sm'>6500</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}
