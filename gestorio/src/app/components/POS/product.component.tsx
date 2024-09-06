import Image from 'next/image'

export default function Product() {
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
							<td className='whitespace-nowrap text-s font-medium '>
								El toro rojo
							</td>
							<td className=' whitespace-nowrap text-s '>Tamaño L</td>
							<td className=' whitespace-nowrap text-s '>1700</td>
							<td className=' whitespace-nowrap text-s '>5100</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* right section */}
			<div className='flex items-center justify-center h-full bg-Verde/40 p-4 rounded-xl'>
				{/* minus, plus and a counter */}
				<div className='flex items-center justify-center gap-x-2'>
					<button>
						<Image src='/minus.svg' alt='alt' width={30} height={30} />
					</button>
					<div className='flex '>
						<input
							type='numeric'
							className='w-12 h-8 text-center bg-Verde/40 text-Gris/100 rounded-lg'
							defaultValue={1}
						/>
					</div>
					<button>
						<Image src='/plus.svg' alt='alt' width={30} height={30} />
					</button>
				</div>
			</div>
		</div>
	)
}
