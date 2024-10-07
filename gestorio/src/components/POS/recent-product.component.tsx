import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { RecentProductProps } from '@/types'

export function RecentProduct({
	id,
	name,
	variant,
	price,
	stock,
	onAddToSale
}: RecentProductProps) {
	return (
		<>
			<div className='mb-4 bg-Verde/60 text-white p-2 rounded-md shadow-xl border'>
				<div className='flex items-center'>
					<div className='w-10 h-10 bg-Verde/60 rounded'>
						<Image
							src='/mockproduct.png'
							alt='Producto'
							width={40}
							height={40}
						/>
					</div>
					<div className='pl-6 flex-1'>
						<div>{name}</div>
						<div className='text-sm'>{variant}</div>
					</div>
					<div className='pr-6'>
						<div>{price}</div>
						<div className='text-sm'>{stock}</div>
					</div>
					<div className='flex'>
						<button
							className='bg-Verde text-white rounded-md p-2 border'
							onClick={() =>
								onAddToSale({ id, name, variant, price, stock, quantity: 0 })
							}>
							<ShoppingCart />
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
