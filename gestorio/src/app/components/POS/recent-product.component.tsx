import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'

export function RecentProduct() {
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
						<div>El Toro Rojo</div>
						<div className='text-sm'>Tamaño L</div>
					</div>
					<div className='pr-6'>
						<div>1700</div>
						<div className='text-sm'>Stock: 24</div>
					</div>
					<div className='flex'>
						<button className='bg-Verde text-white rounded-md p-2 border'>
							<ShoppingCart />
						</button>
					</div>
				</div>
			</div>
		</>
	)
}