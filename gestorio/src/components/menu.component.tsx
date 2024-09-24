'use client'
import Link from 'next/link'
import { AnimateContent } from '@components/index'
import {
	Package,
	CreditCard,
	Truck,
	BarChart,
	UserRound,
	LogOut
} from 'lucide-react'

export function Menu() {
	return (
		<div className='w-fit h-full bg-Gris/90 text-Blanco px-6 py-8 font-normal shadow-right z-auto main-fondo'>
			<section className='flex flex-col gap-12'>
				<AnimateContent>
					<Link
						href='/SistemaDeVentas'
						className='flex flex-row gap-2 items-center w-48'>
						<CreditCard />
						<p>Sistema de Ventas</p>
					</Link>
				</AnimateContent>
				<AnimateContent>
					<Link href='/' className='flex flex-row gap-2 items-center'>
						<Package />
						<p>Inventario</p>
					</Link>
				</AnimateContent>
				<AnimateContent>
					<Link href='/' className='flex flex-row gap-2 items-center'>
						<Truck />
						<p>Proveedores</p>
					</Link>
				</AnimateContent>
				<AnimateContent>
					<Link
						href='/'
						className='flex flex-row gap-2 items-center cursor-pointer select-none '>
						<BarChart />
						<p>Reportes</p>
					</Link>
				</AnimateContent>
				<AnimateContent>
					<Link
						href='/GestionDeUsuarios'
						className='flex flex-row gap-2 items-center cursor-pointer select-none '>
						<UserRound />
						<p>Usuario</p>
					</Link>
				</AnimateContent>
				<AnimateContent>
					<Link
						href='/'
						className='flex flex-row gap-2 items-center cursor-pointer select-none '>
						<LogOut />
						<p>Cerrar Session</p>
					</Link>
				</AnimateContent>
			</section>
		</div>
	)
}
