import { useState } from 'react'
import { SaleProduct } from '@/types/SaleProduct'
import { products } from '@/mocks/products'

export function useSale() {
	const [saleItems, setSaleItems] = useState<SaleProduct[]>([])

	const addToSaleByBarcode = (barcode: string) => {
		// Aquí se debería hacer una petición a la API para obtener el producto
		// con el código de barras especificado
		const product = products.find((product) => product.id === barcode)

		if (!product) {
			console.error('Producto no encontrado')
			return
		}
		const productToADD: SaleProduct = {
			id: product.id,
			imgSrc: product.imgSrc,
			name: product.name,
			variant: product.variant,
			price: product.pricePerUnit,
			stock: product.stock,
			quantity: 1
		}
		addToSale({ ...productToADD })
	}

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
		(sum, item) => sum + item.price * item.quantity,
		0
	)

	return {
		saleItems,
		addToSale,
		addToSaleByBarcode,
		updateQuantity,
		totalAmount
	}
}
