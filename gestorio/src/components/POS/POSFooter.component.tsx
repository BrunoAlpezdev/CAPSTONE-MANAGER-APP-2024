/* eslint-disable no-unused-vars */
'use client'

import { Switch } from '@nextui-org/switch'
import { Ban, Bookmark, User, Building2, HandCoins } from 'lucide-react'

type POSFooterProps = {
	isSelected: boolean
	setIsSelected: (value: boolean) => void
	isPaymentOpen: boolean
	setIsPaymentOpen: (value: boolean) => void
	totalAmount: number
}

export function POSFooter({
	isSelected,
	setIsSelected,
	isPaymentOpen,
	setIsPaymentOpen,
	totalAmount
}: POSFooterProps) {
	return (
		<footer className='bg-background/90 p-4 flex items-center'>
			<div className='flex text-md bg-primary/70 rounded-lg py-2 px-4 w-[73.9dvw] justify-between'>
				<div className='flex items-center gap-4'>
					<button className='bg-accent/70 p-2 rounded-md border flex flex-row gap-2'>
						<Ban />
						Cancelar
					</button>
					<button className='bg-accent/70 p-2 rounded-md border flex flex-row gap-2'>
						<Bookmark />
						Dejar Pendiente
					</button>
					<Switch
						isSelected={isSelected}
						onValueChange={setIsSelected}
						defaultSelected
						size='lg'
						color='success'
						startContent={<User />}
						endContent={<Building2 />}>
						<p className=' text-muted-foreground'>
							{isSelected ? 'Boleta' : 'Factura'}
						</p>
					</Switch>
				</div>
				<div className='flex flex-row gap-3 items-center'>
					<button
						className='bg-accent text-accent-foreground border p-2 rounded-lg flex flex-row gap-2'
						onClick={() => setIsPaymentOpen(!isPaymentOpen)}>
						<HandCoins />
						Pagar
					</button>
					<span>Total $</span>
					<strong className='bg-primary/70 p-2 rounded-lg'>
						{totalAmount.toFixed(0)}
					</strong>
				</div>
			</div>
		</footer>
	)
}
