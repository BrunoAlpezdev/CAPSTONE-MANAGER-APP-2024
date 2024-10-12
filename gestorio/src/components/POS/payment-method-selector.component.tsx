/* eslint-disable no-unused-vars */
import { Banknote, CreditCard } from 'lucide-react'

type PaymentMethod = {
	name: string
	icon: React.ReactNode
}

const paymentMethods: PaymentMethod[] = [
	{ name: 'Efectivo', icon: <Banknote className='mr-2' /> },
	{ name: 'Débito', icon: <CreditCard className='mr-2' /> },
	{ name: 'Crédito', icon: <CreditCard className='mr-2' /> }
]

type PaymentMethodSelectorProps = {
	selectedMethod: string
	onSelectMethod: (method: string) => void
}

export function PaymentMethodSelector({
	selectedMethod,
	onSelectMethod
}: PaymentMethodSelectorProps) {
	return (
		<div className='flex gap-2'>
			{paymentMethods.map((method) => (
				<button
					key={method.name}
					className={`flex w-full justify-center items-center p-2 rounded-md transition-all hover:scale-105 ${
						selectedMethod === method.name
							? 'bg-primary-500 text-white'
							: ' bg-secondary text-secondary-foreground'
					}`}
					onClick={() => onSelectMethod(method.name)}>
					{method.icon}
					{method.name}
				</button>
			))}
		</div>
	)
}
