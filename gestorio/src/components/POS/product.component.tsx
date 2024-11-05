import Image from 'next/image'
import { ProductoProps } from '@/types'

export function Product({
	id,
	name,
	variant,
	price,
	quantity,
	onUpdateQuantity
}: ProductoProps) {
	return (
		<div className='flex h-16 w-full items-center justify-between rounded-sm bg-primary/40'>
			<div className='flex h-full w-fit items-center justify-center rounded-sm bg-primary/40 p-2'>
				{/* left section */}
				<Image
					src='/mockproduct.png'
					alt='alt'
					width={50}
					height={50}
					className='aspect-square object-contain'
				/>
			</div>
			{/* midsection */}
			<div className='flex h-full w-full flex-wrap items-center justify-center gap-x-24 px-4'>
				<table className='min-w-full overflow-hidden rounded-lg text-left'>
					<thead className='text-Gris'>
						<tr>
							<th className='text-s font-medium uppercase tracking-wider text-foreground'>
								Nombre Producto
							</th>
							<th className='text-s font-medium uppercase tracking-wider text-foreground'>
								Variante
							</th>
							<th className='text-s font-medium uppercase tracking-wider text-foreground'>
								$/Unidad
							</th>
							<th className='text-s font-medium uppercase tracking-wider text-foreground'>
								$/Cantidad
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 text-Gris'>
						<tr>
							<td className='text-s whitespace-nowrap font-medium text-foreground'>
								{name}
							</td>
							<td className='text-s whitespace-nowrap text-foreground'>
								{variant}
							</td>
							<td className='text-s whitespace-nowrap text-foreground'>
								{price}
							</td>
							<td className='text-s whitespace-nowrap text-foreground'>
								{price * quantity}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* right section */}
			<div className='flex h-full items-center justify-center rounded-sm bg-primary/40 p-4'>
				{/* minus, plus and a counter */}
				<div className='flex items-center justify-center gap-x-2'>
					<button onClick={() => onUpdateQuantity(id, quantity - 1)}>
						<Image src='/minus.svg' alt='alt' width={30} height={30} />
					</button>
					<div className='flex'>
						<input
							type='numeric'
							className='h-8 w-12 rounded-lg bg-primary/40 text-center text-Gris/100'
							value={quantity}
							onChange={(e) =>
								onUpdateQuantity(id, Math.max(0, parseInt(e.target.value) || 0))
							}
						/>
					</div>
					<button onClick={() => onUpdateQuantity(id, quantity + 1)}>
						<Image src='/plus.svg' alt='alt' width={30} height={30} />
					</button>
				</div>
			</div>
		</div>
	)
}
