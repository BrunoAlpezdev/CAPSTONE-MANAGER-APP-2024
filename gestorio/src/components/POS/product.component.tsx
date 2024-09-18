import Image from 'next/image'
import { ProductoProps } from '@/types/Props'

export function Product({
	id,
	name,
	variant,
	price,
	quantity,
	onUpdateQuantity
}: ProductoProps) {
	return (
		<div className='flex items-center justify-between bg-Verde/40 w-full h-24 rounded-xl'>
			<div className='flex items-center justify-center w-fit h-full bg-Verde/40 p-4 rounded-xl'>
				{/* left section */}
				<Image
					src='/mockproduct.png'
					alt='alt'
					width={80}
					height={80}
					className='aspect-square object-contain'
				/>
			</div>
			{/* midsection */}
			<div className='flex flex-wrap items-center justify-center gap-x-24 w-full h-full px-4'>
				<table className='min-w-full text-left rounded-lg overflow-hidden'>
					<thead className='text-Gris'>
						<tr>
							<th className=' text-s font-medium uppercase tracking-wider'>
								Nombre Producto
							</th>
							<th className=' text-s font-medium uppercase tracking-wider'>
								Variante
							</th>
							<th className=' text-s font-medium uppercase tracking-wider'>
								$/Unidad
							</th>
							<th className=' text-s font-medium uppercase tracking-wider'>
								$/Cantidad
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 text-Gris'>
						<tr>
							<td className='whitespace-nowrap text-s font-medium '>{name}</td>
							<td className=' whitespace-nowrap text-s '>{variant}</td>
							<td className=' whitespace-nowrap text-s '>{price}</td>
							<td className=' whitespace-nowrap text-s '>{price * quantity}</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* right section */}
			<div className='flex items-center justify-center h-full bg-Verde/40 p-4 rounded-xl'>
				{/* minus, plus and a counter */}
				<div className='flex items-center justify-center gap-x-2'>
					<button onClick={() => onUpdateQuantity(id, quantity - 1)}>
						<Image src='/minus.svg' alt='alt' width={30} height={30} />
					</button>
					<div className='flex '>
						<input
							type='numeric'
							className='w-12 h-8 text-center bg-Verde/40 text-Gris/100 rounded-lg'
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
