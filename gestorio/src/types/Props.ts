/* eslint-disable no-unused-vars */
export type ProductoProps = {
	id: number
	name: string
	variant: string
	price: number
	stock: number
	quantity: number
	onUpdateQuantity: (id: number, newQuantity: number) => void
}

export type RecentProductProps = {
	id: number
	name: string
	variant: string
	price: number
	stock: number
	onAddToSale: (product: {
		id: number
		name: string
		variant: string
		price: number
		stock: number
		quantity: number
	}) => void
}
