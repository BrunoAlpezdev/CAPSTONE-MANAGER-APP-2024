import { useState } from 'react'
import { Producto, CartItem } from '@/types'
import { products } from '@/mocks/products'

export function useSale() {
	const [saleItems, setSaleItems] = useState<CartItem[]>([])

	const addToSaleByBarcode = (barcode: string): Producto | undefined => {
		// Aquí se debería hacer una petición a la API para obtener el producto
		// con el código de barras especificado
		const product = products.find((product) => product.id === barcode)

		if (!product) {
			console.error('Producto no encontrado')
			return
		}

		return product
	}

	const updateQuantity = (id: string, newQuantity: number) => {
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
		(sum, item) => sum + item.precio * item.cantidad,
		0
	)

	return {
		saleItems,
		addToSaleByBarcode,
		updateQuantity,
		totalAmount
	}
}
