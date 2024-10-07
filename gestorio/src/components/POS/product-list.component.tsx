/* eslint-disable no-unused-vars */
import { Product } from '@/components/index'
import { SaleProduct } from '@/types'

type ProductListProps = {
	saleItems: SaleProduct[]
	updateQuantity: (id: string, newQuantity: number) => void
}

export function ProductList({ saleItems, updateQuantity }: ProductListProps) {
	return (
		<div className='flex-1 flex flex-col gap-2 p-4 overflow-y-auto scrollbar-modifier'>
			{saleItems.map((item) => (
				<Product
					key={item.id}
					id={item.id}
					name={item.name}
					variant={item.variant}
					price={item.price}
					quantity={item.quantity}
					onUpdateQuantity={updateQuantity}
					stock={item.stock}
				/>
			))}
		</div>
	)
}
