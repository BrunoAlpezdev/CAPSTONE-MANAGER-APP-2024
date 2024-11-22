import { useLocalDb } from '@/hooks'
import { Usuario, Venta } from '@/types'
import { Package } from 'lucide-react'
import { useEffect, useState } from 'react'

interface VentaConResponsable extends Venta {
	responsable: string
}

export const HomeUltVentas = () => {
	const { LeerVentas, LeerUsuarios } = useLocalDb()
	const [ventasData, setVentasData] = useState<VentaConResponsable[]>([])

	useEffect(() => {
		const fetchData = async () => {
			const data = await LeerVentas()

			const sortedData = data.sort(
				(a: any, b: any) =>
					new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
			)

			const parsedData = JSON.parse(JSON.stringify(sortedData))

			const dataWithResponsable = await Promise.all(
				parsedData.map(async (venta: VentaConResponsable) => {
					const data = await LeerUsuarios()
					const responsable: Usuario = JSON.parse(JSON.stringify(data)).find(
						(usuario: Usuario) => usuario.id === venta.id_responsable
					)
					return { ...venta, responsable: responsable.nombre }
				})
			)

			setVentasData(dataWithResponsable.slice(0, 5))
		}

		fetchData()
	}, [])

	return (
		<div className='dashboard-container box-shadow flex-grow rounded-sm border-primary/40 bg-foreground/5 text-foreground backdrop-blur-md'>
			<section className='mt-2 flex flex-row gap-2 px-4'>
				<Package />
				<h2>Ultimas Ventas</h2>
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
								Metodo Pago
							</th>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Responsable
							</th>
							<th className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>
								Total
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-border text-foreground'>
						{ventasData.map((venta) => (
							<tr key={venta.id}>
								<td className='whitespace-nowrap px-6 py-4 text-sm font-medium'>
									{venta.fecha
										? new Date(venta.fecha).toLocaleDateString()
										: 'Invalid Date'}
								</td>
								<td className='whitespace-nowrap px-6 py-4 text-sm'>
									{venta.metodoPago}
								</td>
								<td className='whitespace-nowrap px-6 py-4 text-sm'>
									{venta.responsable}
								</td>
								<td className='whitespace-nowrap px-6 py-4 text-sm'>
									{venta.total}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
