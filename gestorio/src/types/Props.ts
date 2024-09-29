import { SVGProps } from 'react'
/* eslint-disable no-unused-vars */
export interface ProductoProps {
	id: string
	name: string
	variant: string
	price: number
	stock: number
	quantity: number
	onUpdateQuantity: (id: string, newQuantity: number) => void
}

export interface RecentProductProps {
	id: string
	name: string
	variant: string
	price: number
	stock: number
	onAddToSale: (product: {
		id: string
		name: string
		variant: string
		price: number
		stock: number
		quantity: number
	}) => void
}

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number
}
