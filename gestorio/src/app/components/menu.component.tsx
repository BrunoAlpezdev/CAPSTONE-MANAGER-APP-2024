'use client'
import Image from 'next/image'
import Link from 'next/link'
import AnimateContent from './animated-content.component'

export default function Menu() {
	return (
		<div className='w-fit h-full bg-Gris/90 text-Blanco px-6 py-8 font-normal shadow-right z-auto fondo'>
			<section className='flex flex-col gap-12'>
				<AnimateContent>
					<Link href='/' className='flex flex-row gap-2 items-center w-48'>
						<Image
							src={'/POS.svg'}
							alt='Logo de Savanna'
							width={30}
							height={30}
							className='cursor-pointer pointer-events-none'
						/>
						<p>Sistema de Ventas</p>
					</Link>
				</AnimateContent>
				<AnimateContent>
					<Link href='/' className='flex flex-row gap-2 items-center'>
						<Image
							src={'/inventario.svg'}
							alt='Logo de Savanna'
							width={30}
							height={100}
							className='cursor-pointer pointer-events-none'
						/>
						<p>Inventario</p>
					</Link>
				</AnimateContent>
				<AnimateContent>
					<Link href='/' className='flex flex-row gap-2 items-center'>
						<Image
							src={'/proveedores.svg'}
							alt='Logo de Savanna'
							width={30}
							height={100}
							className='cursor-pointer pointer-events-none'
						/>
						<p>Proveedores</p>
					</Link>
				</AnimateContent>
				<AnimateContent>
					<Link
						href='/'
						className='flex flex-row gap-2 items-center cursor-pointer select-none '>
						<Image
							src={'/reportes.svg'}
							alt='Logo de Savanna'
							width={30}
							height={100}
							className='cursor-pointer pointer-events-none'
						/>
						<p>Reportes</p>
					</Link>
				</AnimateContent>
			</section>
		</div>
	)
}
