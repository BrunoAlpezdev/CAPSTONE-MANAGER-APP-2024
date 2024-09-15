import { useState } from 'react'
import { SaleProduct } from '@/types/SaleProduct'

export function useSale() {
	const [saleItems, setSaleItems] = useState<SaleProduct[]>([])

	const addToSale = (product: SaleProduct) => {
		const existingItem = saleItems.find((item) => item.id === product.id)
		if (existingItem) {
			setSaleItems(
				saleItems.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item
				)
			)
		} else {
			setSaleItems([...saleItems, { ...product, quantity: 1 }])
		}
	}

	const updateQuantity = (id: number, newQuantity: number) => {
		if (newQuantity === 0) {
			setSaleItems(saleItems.filter((item) => item.id !== id))
		} else {
			setSaleItems(
				saleItems.map((item) =>
					item.id === id ? { ...item, quantity: newQuantity } : item
				)
			)
		}
	}

	const totalAmount = saleItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	)

	return { saleItems, addToSale, updateQuantity, totalAmount }
}
