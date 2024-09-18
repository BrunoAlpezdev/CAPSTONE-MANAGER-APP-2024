import { useState } from 'react'

export function usePayment(totalAmount: number) {
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Efectivo')
	const [isPaymentOpen, setIsPaymentOpen] = useState(false)

	const togglePaymentMethod = (method: string) => {
		setSelectedPaymentMethod(method)
	}

	const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (selectedPaymentMethod === 'Efectivo') {
			const cashAmount = Number(
				(e.currentTarget.elements.namedItem('montoPagado') as HTMLInputElement)
					.value
			)
			console.log(
				`Pago de ${totalAmount} con ${selectedPaymentMethod}. Cliente paga ${cashAmount} , vuelto: ${cashAmount - totalAmount}`
			)
		} else {
			console.log(
				`Pago de ${totalAmount} con ${selectedPaymentMethod}, número de comprobante: ${(e.currentTarget.elements.namedItem('comprobante') as HTMLInputElement).value}`
			)
		}
		setIsPaymentOpen(false)
	}

	return {
		selectedPaymentMethod,
		isPaymentOpen,
		setIsPaymentOpen,
		togglePaymentMethod,
		handlePayment
	}
}
